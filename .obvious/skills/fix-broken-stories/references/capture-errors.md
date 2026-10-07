# Capture errors, kind by kind

Where the Chromatic web app names causes for a kind, the table uses them. The
other rows follow the kind's description in the public API. Read the error's
own fields first; they usually name the limit that was hit.

| Kind                       | What happened                                                   | Where to look                                                                                                              |
| -------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `FAILED_JS`                | The story's JavaScript threw while the story was being set up   | `error` holds the thrown error. Look for browser APIs the capture browser lacks, and for build configuration (Babel, Vite) |
| `JS_ERROR`                 | An internal error in Chromatic's capture infrastructure         | Rerun the build. If it repeats, report `error` and `errorsJsonUrl` to the user rather than changing code                   |
| `INTERACTION_FAILURE`      | A `play` function step failed or an assertion did not hold      | `error.message` is the failing step. Fix the component or the test, whichever is wrong                                     |
| `RENDER_TIMEOUT`           | The story did not finish rendering in `timeoutMs`               | Data that never resolves, a loader waiting on the network, an infinite render loop                                         |
| `INTERACTION_TEST_TIMEOUT` | The `play` function did not finish in `timeoutMs`               | A `waitFor` or `findBy` that never matches, a missing mock                                                                 |
| `PAGE_EVALUATE_TIMEOUT`    | Capture's own script locked up the browser                      | `functionSource` names the script. Look for heavy synchronous work on load                                                 |
| `NAVIGATION_TIMEOUT`       | The page did not load in `navigationTimeoutMs`                  | Third-party scripts, heavy media, calls to an external API. Serve assets from Storybook's static directory                 |
| `SCREENSHOT_TIMEOUT`       | The screenshot did not complete in `screenshotTimeoutMs`        | Heavy work triggered by a viewport resize; extremely wide or tall elements, even ones translated off screen                |
| `NO_JS`                    | The bundle's JavaScript did not evaluate in the capture browser | Build configuration, or APIs the capture browser does not support used during initialization                               |
| `STORY_MISSING`            | The story was not found in the published Storybook              | Story names that differ between browsers, or JavaScript that failed before the story registered                            |
| `COMPONENT_OFF_PAGE`       | The component rendered off the page                             | An animation that starts or ends off screen. See https://www.chromatic.com/docs/animations                                 |
| `IMAGE_TOO_LARGE`          | The snapshot is over `maxImagePixels`                           | Split a page-sized story into components, or reduce very large elements                                                    |
| `BROWSER_DIMENSION_LIMIT`  | `offendingDimension` is over `maxOffendingDimensionDevicePx`    | Same fixes as `IMAGE_TOO_LARGE`, for the one dimension named                                                               |

## Timeouts are symptoms

Chromatic allows 15 seconds to render a story and another 15 seconds for its
interaction test. Raising a limit or adding a `delay` hides a story that waits
on something it should not. Find what the story is waiting for first. Use the
`delay` parameter only for a known, finite animation, and cite
https://www.chromatic.com/docs/delay when you do.

## Not the story's fault

- A test with status `FAILED` (not `BROKEN`) is a Chromatic infrastructure
  error. Nothing in the repository causes it. Rerun the build.
- A build with status `FAILED` is the same at the build level.
- A capture with result `SYSTEM_ERROR` is Chromatic's, not the story's.
