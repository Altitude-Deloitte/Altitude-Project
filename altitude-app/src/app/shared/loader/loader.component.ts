import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketConnectionService } from '../../services/socket-connection.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  public socketConnection = inject(SocketConnectionService);

  ngOnInit() {
    // Initialize socket data if needed
    if (!this.socketConnection.dataSignal()) {
      this.socketConnection.dataSignal.set({});
    }
  }

  getWorkflowAgents(): Array<{ name: string; status: string; updatedAt: string }> {
    const socketData = this.socketConnection.dataSignal();

    // Define all agents in the correct order
    const agentOrder = [
      'Extraction Agent',
      'prompt generation agent',
      'content generation agent',
      'reviewer agent'
    ];

    // Map agents with their current status from socket data or default to 'PENDING'
    return agentOrder.map(agentName => {
      const agentData = socketData[agentName];
      return {
        name: agentName,
        status: agentData?.status || 'PENDING',
        updatedAt: agentData?.updatedAt || '--:--:--'
      };
    });
  }

  getLineColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#22c55e'; // Green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#eab308'; // Yellow
      case 'FAILED':
        return '#ef4444'; // Red
      case 'PENDING':
      default:
        return '#6b7280'; // Gray
    }
  }

  getMarkerUrl(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'url(#arrowGreen)';
      case 'IN_PROGRESS':
      case 'STARTED':
        return 'url(#arrowYellow)';
      case 'PENDING':
      default:
        return 'url(#arrowGray)';
    }
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
}
