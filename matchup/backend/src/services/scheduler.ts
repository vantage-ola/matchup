import { fetchRealResult } from './football-api.js';

type CronJob = () => Promise<void>;

const jobs: Map<string, CronJob> = new Map();
let schedulerInterval: ReturnType<typeof setInterval> | null = null;

export async function openLobbies(): Promise<void> {
  // TODO: Query fixtures opening in next 30 mins where lobby is not yet open
  // TODO: Create lobby in PostgreSQL
  // TODO: Lobby status = 'open'
}

export async function closeLobbies(): Promise<void> {
  // TODO: Query lobbies that should close (kickoff - 5 mins)
  // TODO: Update lobby status = 'closed'
}

export async function fetchResults(): Promise<void> {
  // TODO: Query finished fixtures (FT) where real goals are null
  // TODO: Call football-api.fetchRealResult() for each
  // TODO: Update fixture with real goals
}

export async function runSettlements(): Promise<void> {
  // TODO: Query completed sessions without settlement
  // TODO: Check if real result exists for fixture
  // TODO: Calculate settlement via settlement.ts
  // TODO: Save settlement to PostgreSQL
  // TODO: Update session status = 'settled'
  // TODO: Credit wallets
}

export function startScheduler(): void {
  if (schedulerInterval) return;

  const run = async () => {
    try {
      await openLobbies();
      await closeLobbies();
      await fetchResults();
      await runSettlements();
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  };

  schedulerInterval = setInterval(run, 5 * 60 * 1000);
}

export function stopScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}