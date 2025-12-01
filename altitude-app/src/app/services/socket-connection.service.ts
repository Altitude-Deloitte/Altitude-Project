import { Injectable, signal, computed } from '@angular/core';
import { io, Socket } from 'socket.io-client';

// Define agent status type
type AgentStatus = 'started' | 'in-progress' | 'completed' | 'IN_PROGRESS' | 'COMPLETED';

// Define agent interface
interface Agent {
  name: string;
  status: string;
  updatedAt?: string; // Optional since we removed timestamp generation
  message?: string;
  description?: string;
  order: number;
}

// Workflow types with their expected agent counts
export type WorkflowType = 'email' | 'social' | 'blog' | 'combined' | 'video';

export const EXPECTED_AGENT_COUNTS: Record<WorkflowType, number> = {
  email: 4,
  social: 4,
  blog: 4,
  combined: 4,
  video: 2
};

@Injectable({
  providedIn: 'root'
})
export class SocketConnectionService {
  socket: any;

  // Core signals
  public dataSignal = signal<Record<string, Agent>>({});
  public expectedAgentCount = signal<number>(4); // Default to 4 agents
  public currentWorkflowType = signal<WorkflowType>('email');

  // Computed signal: received agent count
  public receivedAgentCount = computed(() => {
    return Object.keys(this.dataSignal()).length;
  });

  // Computed signal: completed agent count
  public completedAgentCount = computed(() => {
    const agents = this.dataSignal();
    const completed = Object.values(agents).filter(agent => {
      const normalizedStatus = agent.status?.toUpperCase().replace(/[_\s-]/g, '');
      const isCompleted = normalizedStatus === 'COMPLETED' || normalizedStatus === 'COMPLETE' || normalizedStatus === 'DONE';

      // Log each agent status for debugging
      if (agent.name) {
        console.log(`🔎 Agent "${agent.name}": status="${agent.status}" → normalized="${normalizedStatus}" → completed=${isCompleted}`);
      }

      return isCompleted;
    });

    return completed.length;
  });

  // Computed signal: all agents completed (core logic)
  public allAgentsCompleted = computed(() => {
    const received = this.receivedAgentCount();
    const expected = this.expectedAgentCount();
    const completed = this.completedAgentCount();
    const agents = this.dataSignal();

    // Must have received all expected agents AND all must be completed
    const hasAllAgents = received === expected && received > 0;
    const allComplete = completed === expected && completed > 0;
    const result = hasAllAgents && allComplete;

    // Log completion status for debugging - show all agent names
    if (received > 0) {
      const agentNames = Object.keys(agents).join(', ');
      console.log(`🔍 Socket Status: ${received}/${expected} received, ${completed}/${expected} completed, All done: ${result}`);
      console.log(`📋 Agents received: [${agentNames}]`);

      // Specifically check for reviewer agent
      const hasReviewerAgent = Object.keys(agents).some(key => key.toLowerCase().includes('reviewer'));
      if (!hasReviewerAgent && expected > 0) {
        console.warn('⚠️ Reviewer agent not yet received!');
      }
    }

    return result;
  });

  // Computed signal: loading should be shown
  public isLoading = computed(() => {
    return !this.allAgentsCompleted();
  });

  private messageQueue: { name: string; status: string; message?: string; description?: string; sessionId?: string }[] = [];
  private processingInterval: any;
  private agentOrderCounter = 0;
  private currentSessionId: string | null = null;

  connection = false;
  constructor() {
    this.startProcessingQueue();
  }

  // Set workflow type and expected agent count
  setWorkflowType(workflowType: WorkflowType): void {
    this.currentWorkflowType.set(workflowType);
    this.expectedAgentCount.set(EXPECTED_AGENT_COUNTS[workflowType]);
    console.log(`🎯 Workflow set to: ${workflowType}, expecting ${EXPECTED_AGENT_COUNTS[workflowType]} agents`);
  }

  // Generate a unique session ID
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  // Set the current session ID for filtering and join the session
  setSessionId(sessionId: string): void {
    this.currentSessionId = sessionId;

    if (!this.socket) {
      this.connect();
    } else if (this.connection) {
      this.socket.emit('join_session', { session_id: sessionId });
    }
  }

  // Get the current session ID
  getSessionId(): string | null {
    return this.currentSessionId;
  }

  connect() {
    if (this.socket) {
      return;
    }

    try {
      this.socket = io("https://campaign-content-creation-backend-392853354701.asia-south1.run.app", {
        transports: ["websocket", "polling"],
        reconnection: false,
        timeout: 20000,
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        this.connection = true;
        if (this.currentSessionId) {
          this.socket.emit('join_session', { session_id: this.currentSessionId });
        }
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('Socket connection error:', error.message);
      });

      this.socket.on('disconnect', (reason: any) => {
        this.connection = false;
      });

      this.socket.on('session_joined', (data: any) => {
        // Session joined successfully
      });

      // Listen for status updates - main message handler
      this.socket.on('status', (message: { name: string; status: string; message?: string; description?: string; sessionId?: string }) => {
        // Only process messages for current session
        if (!message.sessionId || message.sessionId === this.currentSessionId) {
          console.log(`📨 Socket message received: ${message.name} - ${message.status}`);
          this.messageQueue.push(message);
        }
      });
    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
      this.connection = false;
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket && this.connection) {
      this.socket.disconnect();
      this.connection = false;
    }
  }

  // Reconnect socket - creates new connection if needed
  reconnect() {
    console.log('🔄 Reconnecting socket...');

    // If socket exists but is disconnected, destroy it first
    if (this.socket && !this.connection) {
      this.socket.removeAllListeners();
      this.socket = null;
    }

    // Connect (will create new socket if needed)
    this.connect();
  }

  // Process message queue
  private startProcessingQueue() {
    this.processingInterval = setInterval(() => {
      if (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();

        setTimeout(() => {
          this.dataSignal.update((current) => {
            // Immutable update - merge new agent data
            // Normalize agent name to handle case variations (e.g., "Reviewer Agent" vs "reviewer agent")
            const normalizedName = message!.name.toLowerCase();
            const existingKey = Object.keys(current).find(key => key.toLowerCase() === normalizedName);
            const keyToUse = existingKey || message!.name;

            const existingAgent = current[keyToUse];
            const order = existingAgent?.order ?? this.agentOrderCounter++;

            console.log(`✅ Processing agent: "${message!.name}" → normalized: "${normalizedName}" → key: "${keyToUse}" → status: ${message!.status}`);

            // Create new agent object with all fields
            const newAgent: Agent = {
              name: message!.name,
              status: message!.status,
              message: message!.message,
              description: message!.description,
              order
            };

            return {
              ...current,
              [keyToUse]: newAgent
            };
          });
        }, 100);
      }
    }, 600);
  }  // Clear all agent data and reset state
  clearAgentData() {
    this.dataSignal.set({});
    this.agentOrderCounter = 0;
    this.messageQueue = [];
  }

  // Clear session ID
  clearSessionId() {
    this.currentSessionId = null;
  }

  // Get current completion status (for debugging)
  getCompletionStatus() {
    return {
      workflow: this.currentWorkflowType(),
      expected: this.expectedAgentCount(),
      received: this.receivedAgentCount(),
      completed: this.completedAgentCount(),
      allCompleted: this.allAgentsCompleted(),
      agents: Object.entries(this.dataSignal()).map(([name, agent]) => ({
        name,
        status: agent.status,
        normalized: agent.status?.toUpperCase().replace(/[_\s-]/g, '')
      }))
    };
  }
}
