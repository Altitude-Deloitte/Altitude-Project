import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SocketConnectionService } from '../../services/socket-connection.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  private platformId = inject(PLATFORM_ID);
  public socketConnection = inject(SocketConnectionService);

  ngOnInit() {
    // Only access socket data in browser
    if (isPlatformBrowser(this.platformId)) {
      // Don't clear data here - let the calling component manage when to clear
      // This allows the loader to display existing socket messages during regeneration
      console.log('Loader component initialized, socket connection active');
    }
  }

  ngOnDestroy() {
    // Don't clear data on destroy - keep it for the review screen
    // The review components will clear data before starting new regeneration
    if (isPlatformBrowser(this.platformId)) {
      console.log('Loader component destroyed, keeping socket data');
    }
  }

  getWorkflowAgents(): Array<{ name: string; status: string; updatedAt: string; previousStatus?: string; message?: string; description?: string }> {
    const socketData = this.socketConnection.dataSignal();

    // Get all agent names from socket data dynamically
    const agentNames = Object.keys(socketData);

    // If no agents received yet, return empty array (skeleton will be shown)
    if (agentNames.length === 0) {
      return [];
    }

    // Sort agents by their order field (the order they were first received)
    const agentOrder = agentNames.sort((a, b) => {
      const orderA = socketData[a]?.order ?? 999;
      const orderB = socketData[b]?.order ?? 999;
      return orderA - orderB;
    });

    // Map all agents with their current status from socket data
    const agents = agentOrder.map((agentName, index) => {
      const agentData = socketData[agentName];
      const previousAgentName = index > 0 ? agentOrder[index - 1] : null;
      const previousAgentData = previousAgentName ? socketData[previousAgentName] : null;

      return {
        name: agentName,
        status: agentData?.status || 'PENDING',
        updatedAt: agentData?.updatedAt || '--:--:--',
        previousStatus: previousAgentData?.status || 'PENDING',
        message: agentData?.message,
        description: agentData?.description
      };
    });

    return agents;
  }

  // Calculate dynamic height based on number of agents
  getWorkflowHeight(): number {
    const agentCount = this.getWorkflowAgents().length;
    // Calculate height: top padding (60) + (number of agents * 110) + bottom padding (60)
    return 60 + (agentCount * 110) + 60;
  }

  getLineColor(currentStatus: string, previousStatus: string): string {
    // If previous agent is completed and current is in progress/started, show yellow
    if (previousStatus === 'COMPLETED' && (currentStatus === 'IN_PROGRESS' || currentStatus === 'STARTED')) {
      return '#eab308'; // Yellow
    }
    // If current agent is completed, show green
    if (currentStatus === 'COMPLETED') {
      return '#22c55e'; // Green
    }
    // For pending states, return transparent (no line visible)
    return 'transparent';
  }

  getMarkerUrl(currentStatus: string, previousStatus: string): string {
    // If previous agent is completed and current is in progress/started, show yellow arrow
    if (previousStatus === 'COMPLETED' && (currentStatus === 'IN_PROGRESS' || currentStatus === 'STARTED')) {
      return 'url(#arrowYellow)';
    }
    // If current agent is completed, show green arrow
    if (currentStatus === 'COMPLETED') {
      return 'url(#arrowGreen)';
    }
    // For pending status, no arrow (empty)
    return '';
  }

  shouldShowDashedLine(currentStatus: string, previousStatus: string): boolean {
    // Show dashed animated line when previous is completed and current is in progress/started
    return previousStatus === 'COMPLETED' && (currentStatus === 'IN_PROGRESS' || currentStatus === 'STARTED');
  }

  getNodeColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#1e1e1e'; // Dark background for completed
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#1e1e1e'; // Dark background
      case 'FAILED':
        return '#3a1e1e'; // Dark red
      case 'PENDING':
      default:
        return '#1e1e1e'; // Dark gray
    }
  }

  getStatusIconColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#22c55e'; // Green dot
      case 'IN_PROGRESS':
      case 'STARTED':
        return 'transparent'; // No dot, will have border animation
      case 'FAILED':
        return '#ef4444'; // Red
      case 'PENDING':
      default:
        return '#6b7280'; // Gray
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#86efac'; // Light green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#fde047'; // Light yellow
      case 'FAILED':
        return '#fca5a5'; // Light red
      case 'PENDING':
      default:
        return '#d1d5db'; // Light gray
    }
  }

  getBorderClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'border-completed';
      case 'IN_PROGRESS':
      case 'STARTED':
        return 'border-in-progress';
      default:
        return '';
    }
  }

  showStatusDot(status: string): boolean {
    return status === 'COMPLETED';
  }

  showBorderAnimation(status: string): boolean {
    return status === 'IN_PROGRESS' || status === 'STARTED';
  }

  // Get dynamic message text based on socket data or default descriptions
  getAgentMessage(agent: { name: string; status: string; message?: string; description?: string }): string {
    // If socket provides a message, use it
    if (agent.message) {
      return agent.message;
    }

    // If socket provides a description, use it
    if (agent.description) {
      return agent.description;
    }

    // Default messages based on status and agent name
    switch (agent.status) {
      case 'IN_PROGRESS':
      case 'STARTED':
        return this.getDefaultProgressMessage(agent.name);
      case 'COMPLETED':
        return this.getDefaultCompletedMessage(agent.name);
      case 'FAILED':
        return 'Failed to process';
      case 'PENDING':
      default:
        return 'Waiting to start...';
    }
  }

  private getDefaultProgressMessage(agentName: string): string {
    const lowerName = agentName.toLowerCase();
    if (lowerName.includes('extraction')) {
      return 'Extracting data from inputs...';
    } else if (lowerName.includes('prompt')) {
      return 'Generating optimized prompts...';
    } else if (lowerName.includes('content')) {
      return 'Creating content...';
    } else if (lowerName.includes('review')) {
      return 'Reviewing and validating...';
    }
    return 'Processing...';
  }

  private getDefaultCompletedMessage(agentName: string): string {
    const lowerName = agentName.toLowerCase();
    if (lowerName.includes('extraction')) {
      return 'Data extracted successfully';
    } else if (lowerName.includes('prompt')) {
      return 'Prompts generated';
    } else if (lowerName.includes('content')) {
      return 'Content created';
    } else if (lowerName.includes('review')) {
      return 'Review completed';
    }
    return 'Completed';
  }
}
