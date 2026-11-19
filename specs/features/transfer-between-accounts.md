# Transfer between own accounts

| Field | Value |
|---|---|
| **spec-id** | northgate/feature/transfer-between-accounts |
| **revision** | 1 |
| **status** | approved |

## Goal

A customer moves money between two of their own accounts in one step, sees that the request was accepted, and sees it in the list of recent transfers. It takes under 30 seconds and needs no help text.

## Who and where

A signed-in retail customer, on desktop or phone, from the Accounts area. Not for payments to other people (a different feature with confirmation and limits).

## Flow

1. The person opens "Transfer between accounts". Nothing is chosen. The form is on the left (or on top on a phone), the recent transfers are below it.
2. They choose the account to take money from (From), the account to put it into (To), type an amount, and may add a reference.
3. They may tick "Email me a confirmation".
4. They press "Confirm transfer". The button shows its loading state and ignores repeated presses for the time the request takes.
5. Success: the form is cleared, focus goes back to the first field, the transfer appears at the top of Recent transfers with the status Pending, and a polite message says "Transfer of {amount} to {account} was accepted".
6. Cancel clears the form without asking.

## Rules

- From and To list the person's own accounts. A closed account is shown disabled and cannot be chosen. The same account cannot be both.
- The amount is a positive number with at most two decimals, not more than the available balance of the From account. The balance is shown in the hint under Amount once From is chosen ("Available 3,240.00").
- Reference is optional, up to 35 characters.
- Errors are shown when the person presses Confirm, and cleared as the person fixes the field. One field is never in error and in hint at once: the error replaces the hint.
- A transfer is Pending until the bank settles it. Later states (Settled, Failed) come from the product and are shown as a badge in the list.

## Fields and copy

| Field | Component | Label | Placeholder or hint | Error |
|---|---|---|---|---|
| From | Select, with the account icon | From | placeholder "Select an account" | "Choose the account to take money from" |
| To | Select, with the account icon | To | placeholder "Select an account" | "Choose a different account from the one you are taking money from" (same account) or "Choose the account to put money into" (empty) |
| Amount | Input, type number | Amount | hint "Available {balance}" when From is chosen | "Enter an amount up to {balance}" (too high), "Enter an amount greater than zero" (empty or zero) |
| Reference | Input | Reference | hint "Optional, up to 35 characters" | "Use 35 characters or fewer" |
| Confirmation | Checkbox | Email me a confirmation | | |

Buttons: "Confirm transfer" (primary, loading while sending), "Cancel" (secondary).

Recent transfers: a table with the columns Date, To, Status, Amount. Status is a Badge (Pending, Settled, Failed). The amount is shown with its sign.

## States

| State | What the person sees |
|---|---|
| Empty | Form with placeholders; Recent transfers shows the existing history |
| Filling | Hint under Amount shows the available balance after From is chosen |
| Error | Error messages under the fields that failed; focus goes to the first of them |
| Sending | Confirm button in its loading state; fields stay as they are |
| Success | Form cleared, new row at the top of the list with Pending, polite status message |
| No history | Recent transfers says "No transfers yet" instead of an empty table (needs a component, see Gaps) |

## Components to use

Select, Input, Checkbox, Button, Table with Badge. Nothing else may be improvised: if a piece is missing, it is listed under Gaps in the build report and proposed as a new component with its own spec.

## Acceptance

1. Every control is a library component; the screen has no hand-made controls and no raw colours or sizes.
2. Pressing Confirm with an empty form shows an error on From, To and Amount, and moves focus to From.
3. Choosing the same account in To as in From shows the "different account" error on To.
4. An amount above the available balance shows the balance in the error.
5. A valid form shows the loading state, then the success state; the new row is first in the list with the status Pending.
6. The whole flow works with the keyboard alone, and the fields are read with their labels, hints and errors.
7. The screen has no axe violations in the empty, error and success states.
8. The screen reads as one column of at most 560 wide on a phone, with no horizontal scroll at 320.
