import { Injectable, signal } from '@angular/core';
// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketConnectionService {
  socket: any;
  public dataSignal = signal<Record<string, { name: string; status: string; updatedAt: string; message?: string; description?: string; order: number }>>({});
  private messageQueue: { name: string; status: string; message?: string; description?: string }[] = [];
  private processingInterval: any;
  private agentOrderCounter = 0; // Track the order agents are received

  connection = false;
  constructor() { this.connect(); this.startProcessingQueue(); }
  private connect() {
    try {
      this.socket = io("https://campaign-content-creation-backend-392853354701.asia-south1.run.app/", {
        transports: ["websocket"],   // force websocket (skip polling)
        reconnection: true,           // enable auto-reconnection
        reconnectionAttempts: 5,      // limit reconnection attempts
        reconnectionDelay: 1000,      // delay between reconnection attempts
        timeout: 10000,               // connection timeout (10 seconds)
        autoConnect: true,            // connect automatically
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected successfully:', this.socket.id);
        this.connection = true;
      });

      // this.socket.on('connect_error', (error: any) => {
      //   console.error('❌ Socket connection error:', error.message);
      //   this.connection = false;
      // });

      // this.socket.on('connect_timeout', () => {
      //   console.warn('⏱️ Socket connection timeout');
      //   this.connection = false;
      // });

      // this.socket.on('disconnect', (reason: any) => {
      //   console.warn('🔌 Socket disconnected:', reason);
      //   this.connection = false;
      // });

      // this.socket.on('reconnect_attempt', (attemptNumber: number) => {
      //   console.log(`🔄 Attempting to reconnect... (Attempt ${attemptNumber})`);
      // });

      // this.socket.on('reconnect_failed', () => {
      //   console.error('❌ Socket reconnection failed after maximum attempts');
      //   this.connection = false;
      // });

      this.socket.on('status', (message: { name: string; status: string; message?: string; description?: string }) => {
        this.messageQueue.push(message);
      });
    } catch (error) {
      console.error('❌ Failed to initialize socket connection:', error);
      this.connection = false;
    }
  }

  // sendMessage(event: string, payload: any) {
  //   if (this.socket && this.connection) {
  //     this.socket.emit(event, payload);
  //   } else {
  //     console.warn('⚠️ Socket not connected. Message not sent:', event, payload);
  //   }
  // }

  disconnect() {
    if (this.socket && this.connection) {
      this.socket.disconnect();
      this.connection = false;
      console.log('🔌 Socket manually disconnected');
    }
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  reconnect() {
    if (!this.connection) {
      this.connect();
      this.startProcessingQueue();
      console.log('🔄 Socket manually reconnected');
    }
  }

  private startProcessingQueue() {
    this.processingInterval = setInterval(() => {
      if (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();

        const timestamp = new Date().toLocaleTimeString();
        setTimeout(() => {
          this.dataSignal.update((current) => {
            // Assign order number if this is the first time we see this agent
            const existingAgent = current[message!.name];
            const order = existingAgent?.order ?? this.agentOrderCounter++;

            return {
              ...current,
              [message!.name]: {
                ...message!,
                updatedAt: timestamp,
                order
              }
            };
          });
        }, 100);
      }
    }, 600);
  }

  // Method to clear agent data (called when starting new generation)
  clearAgentData() {
    this.dataSignal.set({});
    this.agentOrderCounter = 0;
  }
}
