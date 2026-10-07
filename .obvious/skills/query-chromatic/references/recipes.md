# Recipes

Queries that answer the questions agents ask most. Each one is a starting
point: trim the selection to what the task needs, and search the schema before
adding a field that is not here.

## Contents

- [Build by number](#build-by-number)
- [Branches the project has built](#branches-the-project-has-built)
- [What a build holds, in counts](#what-a-build-holds-in-counts)
- [Tests on a build, by status](#tests-on-a-build-by-status)
- [Why a story failed to capture](#why-a-story-failed-to-capture)
- [The visual change on one story](#the-visual-change-on-one-story)
- [Reviewer comments on a build](#reviewer-comments-on-a-build)
- [Quarantined stories](#quarantined-stories)
- [Components in a published Storybook](#components-in-a-published-storybook)
- [A branch's latest build, with its counts](#a-branchs-latest-build-with-its-counts)
- [Where a build's snapshots go](#where-a-builds-snapshots-go)
- [Ignored tests on a build](#ignored-tests-on-a-build)
- [How the project is set up](#how-the-project-is-set-up)
- [Every component in a published Storybook, by name](#every-component-in-a-published-storybook-by-name)
- [Projects for a repository](#projects-for-a-repository)
- [Changing a test](#changing-a-test)

## Build by number

CI logs and pull request checks name a build by its number, not its id.
`webUrl` exists only once a build has started, so it sits inside the state
fragments.

```graphql
query BuildByNumber($projectId: ID!, $number: Int!) {
  project(id: $projectId) {
    build(number: $number) {
      id
      number
      status
      branch
      commit
      isSuperseded
      isLimited
      error {
        message
      }
      ... on StartedBuild {
        webUrl
      }
      ... on CompletedBuild {
        webUrl
        result
        completedAt
      }
    }
  }
}
```

## Branches the project has built

`limit` defaults to 10 and the server caps it at 100.

```graphql
query Branches($projectId: ID!) {
  project(id: $projectId) {
    branchNames(limit: 50)
  }
}
```

## What a build holds, in counts

`testCount` is cheap; use it before paging through tests. The API allows one
alias per query, except for a few count names, so keep these exact aliases.

```graphql
query BuildCounts($buildId: ID!) {
  build(id: $buildId) {
    number
    status
    ... on CompletedBuild {
      webUrl
      result
      testCount
      pendingCount: testCount(statuses: [PENDING])
      brokenCount: testCount(statuses: [BROKEN])
      deniedCount: testCount(statuses: [DENIED])
      reviewableCount: testCount(reviewable: true)
    }
  }
}
```

## Tests on a build, by status

`resultOrder` puts errors first, then new stories, then changes. Page with
`after: <endCursor>` while `hasNextPage` is true.

```graphql
query BuildTests($buildId: ID!, $statuses: [TestStatus!], $after: ID) {
  build(id: $buildId) {
    number
    status
    ... on CompletedBuild {
      tests(
        statuses: $statuses
        first: 20
        after: $after
        orderBy: { field: resultOrder, direction: ASC }
      ) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          status
          result
          webUrl
          mode {
            name
          }
          parameters {
            viewport {
              width
            }
          }
          story {
            storyId
            name
            component {
              name
              path
            }
          }
        }
      }
    }
  }
}
```

## Why a story failed to capture

Filter to one story with `storyId`. Each comparison is one browser and
viewport; the capture error sits on its `headCapture`. `errorsJsonUrl` is a
signed link to the full error report. It does not always download; when it
fails, work from the error fields and give the user the test's `webUrl`.

```graphql
query CaptureError($buildId: ID!, $storyId: String!) {
  build(id: $buildId) {
    ... on CompletedBuild {
      tests(storyId: $storyId, statuses: [BROKEN], first: 10) {
        nodes {
          id
          webUrl
          mode {
            name
          }
          visualComparisons {
            result
            platform {
              name
            }
            viewport {
              width
            }
            headCapture {
              result
              errorsJsonUrl
              captureError {
                kind
                ... on CaptureErrorJSError {
                  error
                }
                ... on CaptureErrorFailedJS {
                  error
                }
                ... on CaptureErrorInteractionFailure {
                  error
                }
                ... on CaptureErrorRenderTimeout {
                  timeoutMs
                }
                ... on CaptureErrorInteractionTestTimeout {
                  timeoutMs
                }
                ... on CaptureErrorPageEvaluateTimeout {
                  timeoutMs
                  functionSource
                }
                ... on CaptureErrorNavigationTimeout {
                  navigationTimeoutMs
                }
                ... on CaptureErrorScreenshotTimeout {
                  screenshotTimeoutMs
                }
                ... on CaptureErrorImageTooLarge {
                  width
                  height
                  maxImagePixels
                }
                ... on CaptureErrorBrowserDimensionLimit {
                  width
                  height
                  offendingDimension
                  maxOffendingDimensionDevicePx
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## The visual change on one story

Image URLs are signed and expire. Fetch them when you need them rather than
storing them.

```graphql
query VisualChange($buildId: ID!, $storyId: String!) {
  build(id: $buildId) {
    ... on CompletedBuild {
      tests(storyId: $storyId, first: 10) {
        nodes {
          id
          status
          result
          webUrl
          mode {
            name
          }
          visualComparisons {
            result
            platform {
              name
            }
            viewport {
              width
            }
            baseCapture {
              captureImage {
                imageUrl
              }
            }
            headCapture {
              captureImage {
                imageUrl
              }
            }
            diff {
              result
              diffImage {
                imageUrl
              }
              focusImage {
                imageUrl
              }
            }
          }
        }
      }
    }
  }
}
```

## Reviewer comments on a build

There is no status filter; read `status` on each thread and skip `RESOLVED`
ones unless asked. `test` is null for a thread attached to a single snapshot
rather than a test; use the thread's `webUrl` for those.

```graphql
query Discussions($buildId: ID!, $after: ID) {
  build(id: $buildId) {
    ... on CompletedBuild {
      discussions(first: 20, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          status
          webUrl
          test {
            webUrl
            mode {
              name
            }
            story {
              storyId
              name
              component {
                name
                path
              }
            }
          }
          comments(first: 20) {
            nodes {
              message
              createdAt
              author {
                name
              }
            }
          }
        }
      }
    }
  }
}
```

## Quarantined stories

A project without quarantine enabled gets an empty list, not an error, and a
null `links.quarantineDashboard`. `issueRate` covers the story's most recent
tests, up to 100: `rate` is the share of them the quarantine was applied to,
from 0 to 1, so a low rate over a large `sampleSize` means the story has mostly
rendered stably.

```graphql
query Quarantined($projectId: ID!, $after: ID) {
  project(id: $projectId) {
    links {
      quarantineDashboard
    }
    quarantinedStories(first: 50, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        modeName
        quarantinedAt
        stats {
          issueRate {
            count
            sampleSize
            rate
          }
        }
        story {
          storyId
          name
          component {
            name
          }
        }
        latestTest {
          id
          status
          result
          isUnstable
          ignoreReason
          webUrl
        }
      }
    }
  }
}
```

## Components in a published Storybook

`url` is a published Storybook's address, such as a build's `storybookUrl`.
A null result means the URL matches no project, the project has no build yet,
or this login cannot see it. The API does not say which.

```graphql
query Components($url: URL!, $after: ID) {
  storybook(url: $url) {
    storybookUrl
    components(first: 50, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
        title
        path
        stories(first: 20) {
          nodes {
            storyId
            name
          }
        }
      }
    }
  }
}
```

## A branch's latest build, with its counts

Name the branch. `defaultBranch: true` can come back null even when the
default branch has builds, so read the default branch from git instead.

```graphql
query BranchBuild($projectId: ID!, $branch: String!) {
  project(id: $projectId) {
    lastBuild(branches: [$branch]) {
      id
      number
      status
      branch
      commit
      isSuperseded
      isLimited
      ... on CompletedBuild {
        webUrl
        storybookUrl
        result
        completedAt
        testCount
        reviewableCount: testCount(reviewable: true)
        brokenCount: testCount(statuses: [BROKEN])
        deniedCount: testCount(statuses: [DENIED])
        discussions(first: 50) {
          totalCount
          nodes {
            status
            webUrl
          }
        }
      }
    }
  }
}
```

## Where a build's snapshots go

One test is one story in one mode. Each test is captured once per browser, so
a build's snapshots are its tests times its browsers. Keep the selection this
small and pages at 250: every field added costs characters on every test.
`totalCount` counts only the tests after the cursor, so take the total from
the build-counts recipe's `testCount`.

```graphql
query BuildSnapshots($buildId: ID!, $after: ID) {
  build(id: $buildId) {
    number
    isLimited
    browsers {
      key
    }
    ... on CompletedBuild {
      componentCount
      specCount
      tests(first: 250, after: $after) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          mode {
            name
          }
          story {
            storyId
            component {
              name
            }
          }
        }
      }
    }
  }
}
```

## Ignored tests on a build

`ignoreReason` says why a test was left out of review: `QUARANTINE`,
`UNSTABLE` (the flake filter caught it) or `MANUAL`.

```graphql
query IgnoredTests($buildId: ID!, $after: ID) {
  build(id: $buildId) {
    ... on CompletedBuild {
      tests(statuses: [IGNORED], first: 50, after: $after) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          ignoreReason
          isUnstable
          result
          webUrl
          mode {
            name
          }
          story {
            storyId
            name
            component {
              name
            }
          }
        }
      }
    }
  }
}
```

## How the project is set up

`type` is the test framework the project runs. `features` says whether UI
Tests and UI Review are on. `linkedRepository` is null for a project not
linked to a git repository. `links.manage` is the project's Manage screen,
where those features and the browsers are set.

```graphql
query ProjectSetup($projectId: ID!, $branch: String!) {
  project(id: $projectId) {
    name
    type
    webUrl
    links {
      manage
    }
    features {
      uiTests
      uiReview
    }
    linkedRepository {
      owner
      name
      gitProvider
    }
    lastBuild(branches: [$branch]) {
      number
      status
      branch
      createdAt
      ... on CompletedBuild {
        webUrl
        result
      }
    }
  }
}
```

## Every component in a published Storybook, by name

The light version of the components recipe, for scanning a whole Storybook:
names, sidebar titles and one story link each, 100 to a page. The API has no
search by name, so page through and match locally.

```graphql
query ComponentIndex($url: URL!, $after: ID) {
  storybook(url: $url) {
    storybookUrl
    components(first: 100, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
        title
        representativeStory {
          storyId
          storybookUrl
        }
      }
    }
  }
}
```

## Projects for a repository

Finds the projects linked to a git repository, in every account the user can
see. `owner` and `name` come from the repository's remote URL, as in
`github.com/<owner>/<name>`, and both must match exactly. A login from before
`viewer` and `account` were added is refused; logging in again fixes it.

```graphql
query ProjectsForRepository($owner: String!, $name: String!) {
  viewer {
    accounts {
      name
      projects(filter: { repositoryOwner: $owner, repositoryName: $name }, limit: 10) {
        id
        name
        webUrl
      }
    }
  }
}
```

## Changing a test

These three run with `chromatic_mutate`, not `chromatic_query`, and only for a
change the user asked for. Name the tests before you run one. `testId` is a
test's `id` from the tests-by-status, ignored-tests or quarantined-stories
recipe. When the API declines, for example because the build was superseded,
the reason comes back in `userErrors` or `errors` rather than as a failure, so
always select them.

### Review a test

`status` is `ACCEPTED`, `DENIED`, `IGNORED` or `PENDING`, which undoes a
review. To review every test of the same story, the same component or the
whole build at once, add `batch: SPEC`, `COMPONENT` or `BUILD` to the input,
and only when the user asked for that many.

```graphql
mutation ReviewTest($testId: ID!, $status: ReviewTestInputStatus!) {
  reviewTest(input: { testId: $testId, status: $status }) {
    updatedTests {
      id
      status
      webUrl
    }
    userErrors {
      __typename
      ... on UserError {
        message
      }
    }
  }
}
```

### Quarantine a test

Quarantine covers the test's story in that mode, on every later build, until
someone unquarantines it. The test is also ignored on this build.

```graphql
mutation Quarantine($testId: ID!) {
  testQuarantine(input: { testId: $testId }) {
    __typename
    ... on TestQuarantineSuccess {
      test {
        id
        status
        webUrl
      }
    }
    ... on TestQuarantineFailure {
      errors {
        __typename
        ... on MutationError {
          message
        }
      }
    }
  }
}
```

### Unquarantine a test

```graphql
mutation Unquarantine($testId: ID!) {
  testUnquarantine(input: { testId: $testId }) {
    __typename
    ... on TestUnquarantineSuccess {
      test {
        id
        status
        webUrl
      }
    }
    ... on TestUnquarantineFailure {
      errors {
        __typename
        ... on MutationError {
          message
        }
      }
    }
  }
}
```
