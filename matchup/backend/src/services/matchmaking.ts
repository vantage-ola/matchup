import type { PlayerSide, GameMode, MatchupSession, GameState } from '../types/index.js';
import { initSession } from '../engine/matchup.js';

interface QueueEntry {
  userId: string;
  fixtureId: string;
  side: PlayerSide;
  stake: number;
  gameMode: GameMode;
  joinedAt: Date;
}

const queues: Map<string, { home: QueueEntry[]; away: QueueEntry[] }> = new Map();

export async function joinQueue(
  userId: string,
  fixtureId: string,
  side: PlayerSide,
  stake: number,
  gameMode: GameMode
): Promise<{ position: number; session?: MatchupSession }> {
  if (!queues.has(fixtureId)) {
    queues.set(fixtureId, { home: [], away: [] });
  }

  const queue = queues.get(fixtureId)!;
  queue[side].push({
    userId,
    fixtureId,
    side,
    stake,
    gameMode,
    joinedAt: new Date(),
  });

  const position = queue[side].length;

  const opponentQueue = side === 'home' ? queue.away : queue.home;
  if (opponentQueue.length > 0) {
    const match = await createSession(fixtureId, side, stake, gameMode);
    return { position, session: match };
  }

  return { position };
}

export async function leaveQueue(
  userId: string,
  fixtureId: string,
  side: PlayerSide
): Promise<void> {
  const queue = queues.get(fixtureId);
  if (!queue) return;

  queue[side] = queue[side].filter((entry) => entry.userId !== userId);
}

export async function findMatch(
  fixtureId: string,
  side: PlayerSide
): Promise<QueueEntry | null> {
  const queue = queues.get(fixtureId);
  if (!queue) return null;

  const opponentQueue = side === 'home' ? queue.away : queue.home;
  return opponentQueue.length > 0 ? opponentQueue.shift()! : null;
}

export async function createSession(
  fixtureId: string,
  joiningSide: PlayerSide,
  stake: number,
  gameMode: GameMode
): Promise<MatchupSession> {
  const homeEntry = await findMatch(fixtureId, 'home');
  const awayEntry = await findMatch(fixtureId, 'away');

  const player1 = homeEntry || awayEntry;
  const player2 = (homeEntry && awayEntry) || null;

  if (!player1) {
    throw new Error('No players in queue');
  }

  const sessionId = crypto.randomUUID();
  const player1Side: PlayerSide = joiningSide === 'home' ? 'home' : 'away';
  const player2Side: PlayerSide = player1Side === 'home' ? 'away' : 'home';

  const session: MatchupSession = {
    id: sessionId,
    lobbyId: null,
    fixtureId,
    player1Id: player1.userId,
    player2Id: player2?.userId ?? null,
    player1Side,
    player2Side,
    stakePerPlayer: stake,
    pot: stake * 2,
    gameMode,
    status: 'pending',
    startedAt: null,
    endedAt: null,
    createdAt: new Date(),
  };

  const player2SideVal = player2 ? player2Side : 'away';
  const gameState = initSession(
    player1.userId,
    player2?.userId ?? 'bot',
    fixtureId,
    sessionId
  );

  // TODO: Save session to PostgreSQL
  // TODO: Save game state to Redis
  // TODO: Check if both ready -> start matchup

  return session;
}

export async function getQueueStatus(fixtureId: string): Promise<{
  homeCount: number;
  awayCount: number;
}> {
  const queue = queues.get(fixtureId);
  if (!queue) {
    return { homeCount: 0, awayCount: 0 };
  }

  return {
    homeCount: queue.home.length,
    awayCount: queue.away.length,
  };
}