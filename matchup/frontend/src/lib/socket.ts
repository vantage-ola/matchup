import type { GameState, Resolution, Move } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

type EventHandler<T = unknown> = (payload: T) => void;

interface SocketEvents {
  OPPONENT_COMMITTED: EventHandler;
  TURN_RESOLVED: EventHandler<{ resolution: Resolution; state: GameState }>;
  PHASE_TRANSITION: EventHandler<{ state: GameState }>;
  MATCHUP_COMPLETE: EventHandler<{ state: GameState }>;
  OPPONENT_DISCONNECTED: EventHandler<{ reconnectWindowSeconds: number }>;
  BOT_SUBSTITUTED: EventHandler;
  PONG: EventHandler;
}

class SocketClient {
  private ws: WebSocket | null = null;
  private handlers: Partial<{ [K in keyof SocketEvents]: SocketEvents[K] }> = {};
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  connect(sessionId: string, token: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.disconnect();
    }

    const url = `${WS_URL}/matchup?sessionId=${sessionId}&token=${token}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.startPing();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as {
          type: keyof SocketEvents;
          payload: unknown;
        };
        this.handleMessage(message.type, message.payload);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.stopPing();
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  disconnect(): void {
    this.stopPing();
    this.clearReconnectTimer();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(type: string, payload?: unknown): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected');
      return;
    }

    this.ws.send(
      JSON.stringify({
        type,
        payload,
      })
    );
  }

  commitMove(move: Move): void {
    this.send('COMMIT_MOVE', { move });
  }

  on<K extends keyof SocketEvents>(event: K, handler: SocketEvents[K]): void {
    this.handlers[event] = handler;
  }

  off<K extends keyof SocketEvents>(event: K): void {
    delete this.handlers[event];
  }

  private handleMessage<K extends keyof SocketEvents>(
    type: K,
    payload: unknown
  ): void {
    const handler = this.handlers[type];
    if (handler) {
      (handler as (p: unknown) => void)(payload);
    }
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      this.send('PING');
    }, 30000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export const socket = new SocketClient();