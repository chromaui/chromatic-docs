# Snapshot terminology reference

Source of truth: [“Billed Snapshots” Proposal](https://app.notion.com/p/chromatic-ui/Billed-Snapshots-Proposal-3896e81620348038a114f174b387dc95)
(accepted). This file restates it for offline verification. If the Notion doc
changes, update this file.

## Core concepts

### `snapshot` — the unit of work

A snapshot is work performed for one test: taking a screenshot, capturing
accessibility data, copying such information from another test, or bypassing
the work entirely when it's unnecessary.

- **Always pair the plural `snapshots` with a modifier** (`visual snapshots`,
  `captured snapshots`, …). Bare `snapshots` is ambiguous — historically it has
  meant visual, captured, or billed snapshots depending on the reader.
  Never use it alone internally; avoid it in user-facing docs where possible.
- Singular `snapshot` is acceptable **if the type is clear from context**
  (e.g. a paragraph that already established it's discussing visual snapshots).
- To refer to all snapshots of every type, use **`total snapshots`**.
- `snapshot` is always a **noun**, never a verb. Chromatic doesn't "snapshot"
  something — it _takes_, _captures_, or _generates_ a snapshot _of_
  something. Avoid `snapshotting`, `snapshotted`, `to snapshot`, and `it
snapshots X`; these blur the noun/verb distinction the same way a bare
  plural does.

### `test` vs `capture` — not interchangeable

- `test` is the product-level action (a **Visual Test**, comparing a build
  against baselines). It is not a synonym for producing a snapshot.
- `capture` is the specific term for producing a new snapshot image, per the
  "type of work" ontology below.
- `re-test` / `retest` describing TurboSnap (or anything else) deciding to
  trigger a **new snapshot** for a story is the same drift as `snapshot`-as-verb —
  use `re-capture` / `recapture` instead. Reserve `test`/`retest` for the
  broader visual-test run itself, not the act of producing a snapshot.

### `billed snapshot` — the unit of billing

What appears on the Stripe invoice and triggers overages.

- A billed snapshot is **not a type of snapshot** — it is the _cost_ of a
  snapshot (0 to 1 depending on the snapshot's type). Snapshots are never
  "taken", "captured", or "run" as billed snapshots; they _incur_ or
  _generate_ billed snapshots.
- Never use bare `snapshots` as shorthand for billed snapshots.
- When attributing billed snapshots to a snapshot type, **separate the
  modifiers**: `billed snapshots from turbosnaps`. Never fuse them
  (`billed turbosnaps`, `billed captured snapshots`) — fusing implies a
  whole-number subset of that snapshot type rather than a fractional cost.

### `billable` vs `billed` — not interchangeable

- `billable snapshot` — a snapshot that **may incur** some amount of billed
  snapshots, depending on account/business settings.
- `non-billable snapshot` — always incurs **zero** billed snapshots
  (e.g. a snapshot on a limited build).
- `billed snapshots` — the actual usage amount incurred.

### TurboSnap

- **TurboSnap** (capitalized, one word) — the feature.
- `turbosnap` — shorthand for `turbo snapshot`, a type of snapshot (see below).

## Modifier ontology

Three stackable categories. Conventional stacking order follows the list order
below, e.g. `captured visual chrome snapshots` = snapshots that actually took a
screenshot in Chrome.

1. **Type of work**
   - `captured snapshot` (aka a `capture`) — went to the capture cloud.
   - `turbo snapshot` (aka `turbosnap`) — either a:
     - `copied snapshot` (aka `inherited snapshot`) — copied due to TurboSnap, or a:
     - `bypassed snapshot` — neither captured nor copied (build had no TurboSnap-relevant changes).
2. **Type of (potential) capture**
   - `visual snapshot` — (may have) resulted in a screenshot. Includes captured, copied, and bypassed snapshots.
   - `accessibility snapshot` — (may have) resulted in an accessibility report. Same inclusions.
3. **Type of (potential) environment**
   - `web snapshot` — any browser. Narrower: `chrome snapshot`, etc.
   - `mobile snapshot` — any mobile device. Narrower: `ios snapshot`, etc.

Special modifiers:

- `billable` / `non-billable` — see above.
- `potential snapshot` — would have been captured if not for limiting; may end
  up `captured` or `skipped`.

Invalid combinations (contradictions within category 1):

- `inherited capture` / `copied capture` — an oxymoron: copied means it did
  **not** go to the capture cloud. (The internal metric `inherited_capture_count`
  is acknowledged in the proposal as misnamed — don't propagate the phrasing
  into prose.)
- `bypassed capture`, `captured turbosnap` — same contradiction.

## Existing internal metric names (do not flag as identifiers, do not imitate in prose)

| Identifier                      | Measures                                  |
| ------------------------------- | ----------------------------------------- |
| `billable_capture_count`        | billable captured snapshots               |
| `accessibility_capture_count`   | accessibility captured snapshots          |
| `inherited_capture_count`       | visual web inherited snapshots (misnamed) |
| `accessibility_inherited_count` | accessibility inherited snapshots         |
| `potential_capture_count`       | potential snapshots                       |
| `actual_capture_count`          | captured snapshots                        |
| `final_billable_count`          | **billed snapshots**                      |
| `android_capture_count`         | android visual captured snapshots         |
| `chrome_capture_count`          | chrome visual captured snapshots          |

## Worked examples

| ❌ Incorrect                                   | ✅ Correct                                                     |
| ---------------------------------------------- | -------------------------------------------------------------- |
| "Your plan includes 35,000 snapshots"          | "Your plan includes 35,000 billed snapshots"                   |
| "billed turbosnaps"                            | "billed snapshots from turbosnaps"                             |
| "TurboSnap snapshots are billed at 1/5"        | "turbosnaps incur billed snapshots at 1/5 the rate"            |
| "Chromatic takes a billed snapshot"            | "each snapshot generates some amount of billed snapshot usage" |
| "billable snapshots appear on your invoice"    | "billed snapshots appear on your invoice"                      |
| "snapshots are captured in Chrome" (ambiguous) | "visual snapshots are captured in Chrome"                      |
| "an inherited capture"                         | "a copied (inherited) snapshot"                                |
| "It intelligently snapshots only the stories"  | "It intelligently captures snapshots only of the stories"      |
| "stories to snapshot"                          | "stories to capture"                                           |
| "enabling it to be snapshotted correctly"      | "enabling a correct snapshot to be captured"                   |
| "we re-test everything in these situations"    | "we re-capture everything in these situations"                 |
| "TurboSnap retests all stories"                | "TurboSnap re-captures all stories"                            |

Correct usage from the proposal, useful as templates:

- "Snapshots taken on the platform (visual or accessibility) are billed
  differently depending on whether they are captured, copied, or bypassed due
  to TurboSnap. Each snapshot generates some amount of 'billed snapshot' usage."
- "`Billed Snapshots per Build` counts the average usage cost of a build (what
  shows up on your bill), driven by the snapshots taken on that build and how
  they are optimised by TurboSnap."
