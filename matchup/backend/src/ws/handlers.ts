import type { WSClient } from './server.js';
import type { Move, PlayerNumber, WSEvent } from '../types/index.js';
import { commitMove } from '../engine/matchup.js';
import { sendToClient } from './server.js';

interface CommitMovePayload {
  move: Move;
}

interface WSMessage {
  type: string;
  payload?: unknown;
}

function parseMessage(data: Buffer.Binary): WSMessage | null {
  try {
    return JSON.parse(data.toString()) as WSMessage;
  } catch {
    return null;
  }
}

export async function handleConnection(ws: WSClient): Promise<void> {
  console.log(`Client connected: ${ws.userId} to session ${ws.sessionId}`);

  // TODO: Fetch current game state
  // TODO: Send initial state to client
  // TODO: Check if session status -> notify client
}

export async function handleMessage(ws: WSClient, data: Buffer.Binary): Promise<void> {
  const message = parseMessage(data);
  if (!message) return;

  const { type, payload } = message;

  switch (type) {
    case 'COMMIT_MOVE': {
      const { move } = payload as CommitMovePayload;
      const player = (ws.userId === 'p1' ? 'p1' : 'p2') as PlayerNumber;

      // TODO: Verify player belongs to session and is their turn
      // TODO: Call engine.commitMove()
      // TODO: Check if both moves committed -> resolve turn

      await commitMove(ws.sessionId!, player, move);
      break;
    }

    case 'PING': {
      sendToClient(ws, 'PONG', {});
      break;
    }

    default: {
      console.warn(`Unknown WebSocket message type: ${type}`);
    }
  }
}

export async function handleDisconnect(ws: WSClient): Promise<void> {
  const { userId, sessionId } = ws;

  if (sessionId) {
    console.log(`Client disconnected: ${userId} from session ${sessionId}`);

    // TODO: Mark player as disconnected
    // TODO: Notify opponent
    // TODO: Start 30s reconnect timer
    // TODO: If timer expires -> replace with bot
  }
}

export async function notifyOpponentCommitted(
  ws: WSClient,
  opponent: string
): Promise<void> {
  const event = 'OPPONENT_COMMITTED';
  sendToClient(ws, event, { opponent });
}

export async function notifyOpponentDisconnected(
  ws: WSClient,
  reconnectWindowSeconds: number
): Promise<void> {
  sendToClient(ws, 'OPPONENT_DISCONNECTED', {
    reconnectWindowSeconds,
  });
}

export async function notifyBotSubstituted(ws: WSClient): Promise<void> {
  sendToClient(ws, 'BOT_SUBSTITUTED', {});
}