import { Injectable, signal } from '@angular/core';
// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketConnectionService {
  socket: any;
  public dataSignal = signal<any>(null);
  connection = false;
  constructor() { this.connect(); }
  private connect() {
    this.socket = io("https://campaign-management-392853354701.asia-south1.run.app", {
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

    // Listen for real-time data event

    this.socket.on('heartbeat', (message: any) => {
      // console.log('status', message)
      this.dataSignal.set(message);
    });

  }

  sendMessage(event: string, payload: any) {
    this.socket.emit(event, payload);
  }
}
