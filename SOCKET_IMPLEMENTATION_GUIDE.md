# Socket & Signal Store Implementation Guide

## Overview

This implementation uses Angular Signals and a workflow-aware socket service to reliably track agent completion and manage loading states.

## Architecture

### 1. Socket Connection Service (`socket-connection.service.ts`)

#### Core Signals

```typescript
// Raw agent data
public dataSignal = signal<Record<string, Agent>>({});

// Expected agent count based on workflow
public expectedAgentCount = signal<number>(4);

// Current workflow type
public currentWorkflowType = signal<WorkflowType>('email');
```

#### Computed Signals

```typescript
// Number of agents received
public receivedAgentCount = computed(() =>
  Object.keys(this.dataSignal()).length
);

// Number of completed agents
public completedAgentCount = computed(() => {
  const agents = this.dataSignal();
  return Object.values(agents).filter(agent => {
    const normalized = agent.status?.toUpperCase().replace(/[_\s-]/g, '');
    return normalized === 'COMPLETED' || normalized === 'COMPLETE' || normalized === 'DONE';
  }).length;
});

// ALL agents completed (core completion logic)
public allAgentsCompleted = computed(() => {
  const received = this.receivedAgentCount();
  const expected = this.expectedAgentCount();
  const completed = this.completedAgentCount();

  // Must have ALL expected agents AND all must be completed
  return received === expected &&
         received > 0 &&
         completed === expected &&
         completed > 0;
});
```

### 2. Workflow Types & Expected Agent Counts

```typescript
export type WorkflowType = "email" | "social" | "blog" | "combined" | "video";

export const EXPECTED_AGENT_COUNTS: Record<WorkflowType, number> = {
  email: 4, // Normal flow
  social: 4, // Normal flow
  blog: 4, // Normal flow
  combined: 4, // Normal flow
  video: 2, // Video-specific flow
};
```

### 3. Component Implementation Pattern

#### In ngOnInit - Set Workflow Type

```typescript
ngOnInit(): void {
  // Set the workflow type FIRST
  this.socketConnection.setWorkflowType('email'); // or 'video', 'social', etc.

  // Rest of initialization...
}
```

#### In Constructor - Watch Completion

```typescript
constructor(
  public socketConnection: SocketConnectionService,
  // ... other dependencies
) {
  // Reactive effect watches allAgentsCompleted computed signal
  effect(() => {
    const allCompleted = this.socketConnection.allAgentsCompleted();

    if (allCompleted && this.loading) {
      setTimeout(() => {
        this.loading = false;
        this.socketConnection.disconnect();
      }, 500);
    }
  });
}
```

## How It Works

### Message Flow

1. **Socket receives message** → Queued in `messageQueue`
2. **Processing interval** (600ms) → Dequeues and updates `dataSignal`
3. **Signal update triggers** → All computed signals re-evaluate
4. **`allAgentsCompleted` becomes true** when:
   - `receivedAgentCount === expectedAgentCount`
   - `completedAgentCount === expectedAgentCount`
   - Both counts > 0
5. **Effect in component** → Detects completion, hides loader

### Completion Logic

```typescript
allAgentsCompleted = computed(() => {
  const received = this.receivedAgentCount(); // e.g., 4
  const expected = this.expectedAgentCount(); // e.g., 4
  const completed = this.completedAgentCount(); // e.g., 4

  // For email/social/blog/combined: expects 4 agents
  // For video: expects 2 agents

  return (
    received === expected && // All agents arrived
    received > 0 && // Not empty state
    completed === expected && // All completed
    completed > 0
  ); // Not empty state
});
```

## Status Normalization

The service handles various status formats from the backend:

- `"COMPLETED"` → `"COMPLETED"`
- `"completed"` → `"COMPLETED"`
- `"IN_PROGRESS"` → `"INPROGRESS"`
- `"in-progress"` → `"INPROGRESS"`
- `"IN PROGRESS"` → `"INPROGRESS"`

Completion check:

```typescript
const normalized = status?.toUpperCase().replace(/[_\s-]/g, "");
return (
  normalized === "COMPLETED" ||
  normalized === "COMPLETE" ||
  normalized === "DONE"
);
```

## Component Examples

### Email Review (4 agents)

```typescript
ngOnInit(): void {
  this.socketConnection.setWorkflowType('email'); // Expects 4 agents
  // ...
}
```

### Video Review (2 agents)

```typescript
ngOnInit(): void {
  this.socketConnection.setWorkflowType('video'); // Expects 2 agents
  // ...
}
```

## Debugging

Use the built-in status method:

```typescript
const status = this.socketConnection.getCompletionStatus();
console.log(status);

// Output:
// {
//   workflow: 'email',
//   expected: 4,
//   received: 4,
//   completed: 4,
//   allCompleted: true,
//   agents: [
//     { name: 'agent1', status: 'COMPLETED', normalized: 'COMPLETED' },
//     { name: 'agent2', status: 'COMPLETED', normalized: 'COMPLETED' },
//     { name: 'agent3', status: 'COMPLETED', normalized: 'COMPLETED' },
//     { name: 'agent4', status: 'COMPLETED', normalized: 'COMPLETED' }
//   ]
// }
```

## Key Benefits

✅ **Workflow-aware** - Different agent counts for different flows  
✅ **Immutable updates** - Proper signal change detection  
✅ **Type-safe** - TypeScript interfaces and types  
✅ **Reactive** - Computed signals automatically update  
✅ **Reliable** - No race conditions or manual tracking  
✅ **Status normalization** - Handles backend variations  
✅ **Debuggable** - Built-in status inspection

## Best Practices

1. **Always set workflow type** in `ngOnInit()` before any API calls
2. **Use computed signals** instead of manual subscriptions
3. **Don't manually track counts** - let computed signals handle it
4. **Clear agent data** when starting new generation
5. **Disconnect socket** when all agents complete

## Troubleshooting

### Loading screen doesn't hide

- Check workflow type is set correctly
- Verify expected agent count matches backend
- Use `getCompletionStatus()` to inspect current state
- Check console for agent status messages

### Loading screen hides too early

- Ensure all agents are sending completion status
- Check status normalization is working
- Verify no duplicate agent names

### Wrong agent count

- Confirm workflow type is set in ngOnInit
- Check `EXPECTED_AGENT_COUNTS` configuration
- For video workflow, ensure it's set to 'video' not 'email'
