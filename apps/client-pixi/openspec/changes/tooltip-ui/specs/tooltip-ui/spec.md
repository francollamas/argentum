# Tooltip UI Specification

## Purpose

Define a reusable in-canvas tooltip that reveals contextual content on hover without changing surrounding layout.

## Requirements

### Requirement: Delayed Hover Visibility

The system MUST show a tooltip only after a small hover delay and MUST hide it immediately when the pointer leaves the trigger.

#### Scenario: Show after hover delay

- GIVEN a tooltip trigger is idle and hidden
- WHEN the pointer remains over the trigger past the configured small delay
- THEN the tooltip becomes visible
- AND the surrounding layout remains unchanged

#### Scenario: Hide immediately on pointer out

- GIVEN a tooltip is visible or waiting to appear
- WHEN the pointer leaves the trigger
- THEN the tooltip hides immediately
- AND any pending show is cancelled

### Requirement: Single Trigger Wrapper

The system MUST accept exactly one trigger child for each tooltip instance and SHALL anchor tooltip placement to that child.

#### Scenario: One trigger child renders normally

- GIVEN a tooltip wraps one interactive child
- WHEN the UI renders
- THEN the child remains usable as the trigger anchor

#### Scenario: Invalid trigger structure is rejected

- GIVEN a tooltip is provided zero or multiple trigger children
- WHEN the component is evaluated
- THEN the usage is rejected as invalid

### Requirement: Flexible Tooltip Content

The system MUST accept arbitrary ReactNode content and SHALL size the tooltip to its natural content without applying a default max-width policy.

#### Scenario: Mixed content renders inside tooltip

- GIVEN tooltip content includes text and other React elements
- WHEN the tooltip becomes visible
- THEN all provided content is rendered in the tooltip shell

#### Scenario: Wide content grows naturally

- GIVEN tooltip content requires more width than a short label
- WHEN the tooltip is shown
- THEN the tooltip grows to fit its content
- AND no default max-width constrains it

### Requirement: Placement Hints and Visual Shell

The system MUST support top, bottom, left, and right placement hints and SHALL render the tooltip using a dedicated thin-border, non-rounded nine-slice asset.

#### Scenario: Placement hint positions tooltip

- GIVEN a tooltip is configured with a supported placement hint
- WHEN it becomes visible
- THEN the tooltip is positioned relative to the trigger using that hint

#### Scenario: Tooltip remains hidden until positioned

- GIVEN tooltip and trigger measurements are not ready yet
- WHEN the hover delay completes
- THEN the tooltip remains invisible until a placement can be resolved
- AND it appears using the dedicated nine-slice shell once positioned
