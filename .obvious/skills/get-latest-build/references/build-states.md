# What a build's state means

## Status

| Status        | Meaning                                                      | What to do next                                        |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| `ANNOUNCED`   | The CLI created the build; the Storybook is not uploaded yet | Wait                                                   |
| `PUBLISHED`   | Uploaded, not ready for testing                              | Wait                                                   |
| `PREPARED`    | Ready for testing, not started                               | Wait                                                   |
| `IN_PROGRESS` | Testing stories now                                          | Wait                                                   |
| `SKIPPED`     | No stories were affected, so nothing ran                     | Nothing                                                |
| `PASSED`      | Every test passed without changes                            | Nothing                                                |
| `PENDING`     | At least one change is waiting for review                    | the `review-visual-changes` skill                      |
| `ACCEPTED`    | Every change was accepted                                    | Nothing                                                |
| `DENIED`      | At least one change was denied                               | Fix what was denied, then build again                  |
| `BROKEN`      | Stories failed to render                                     | the `fix-broken-stories` skill                         |
| `FAILED`      | A Chromatic infrastructure error, usually transient          | Rerun the build; nothing in the repository causes this |
| `CANCELLED`   | Cancelled before it finished                                 | Build again if a result is needed                      |

## Result, once complete

| Result          | Meaning                                        |
| --------------- | ---------------------------------------------- |
| `SUCCESS`       | Every test completed                           |
| `CAPTURE_ERROR` | At least one story failed to capture           |
| `SYSTEM_ERROR`  | At least one test had a Chromatic system error |
| `TIMEOUT`       | The build timed out                            |

## Flags

- `isSuperseded`: a newer build exists on the same branch, and this one can no
  longer be reviewed. Report the newer one instead.
- `isLimited`: the account passed its snapshot quota, so only one story per
  component was captured. Results cover part of the Storybook; say so.
- `error.message`: why the build failed, when it did.
