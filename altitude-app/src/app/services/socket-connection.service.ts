import { Injectable, signal } from '@angular/core';
// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketConnectionService {
  socket: any;
  public dataSignal = signal<Record<string, { name: string; status: string; updatedAt: string }>>({});
  private messageQueue: { name: string; status: string }[] = [];
  private processingInterval: any;

  connection = false;
  constructor() { this.connect(); this.startProcessingQueue(); }
  private connect() {
    this.socket = io("https://campaign-content-creation-backend-392853354701.asia-south1.run.app/", {
      transports: ["websocket"],   // force websocket (skip polling)
    });  // Replace with your Socket.IO server URL

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket);
      this.connection = true;
    });

    this.socket.on('disconnect', (reason: any) => {
      console.warn('Socket disconnected:', reason);
    });

    this.socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...');
    });
    this.socket.on('status', (message: { name: string; status: string }) => {
      this.messageQueue.push(message);
    });
    // Listen for real-time data event

  }
  sendMessage(event: string, payload: any) {
    this.socket.emit(event, payload);
  }

  private startProcessingQueue() {
    this.processingInterval = setInterval(() => {
      if (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        const timestamp = new Date().toLocaleTimeString();

        this.dataSignal.update((current) => ({
          ...current,
          [message!.name]: {
            ...message!,
            updatedAt: timestamp
          }
        }));
      }
    }, 300);
  }
}
