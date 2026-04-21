import type { Fixture } from '../types/index.js';

interface FootballAPIFixture {
  fixture: {
    id: number;
    date: string;
    venue: { name: string };
    status: { short: string; long: string };
  };
  league: { id: number; name: string; country: string };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number; away: number };
    fulltime: { home: number; away: number };
    extratime: { home: number; away: number };
    penalty: { home: number; away: number };
  };
}

interface FootballAPIResponse {
  response: FootballAPIFixture[];
}

const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';
const API_HOST = 'api-football-v1.p.rapidapi.com';

async function fetchWithKey<T>(endpoint: string): Promise<T> {
  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    throw new Error('FOOTBALL_API_KEY not configured');
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': API_HOST,
    },
  });

  if (!res.ok) {
    throw new Error(`Football API error: ${res.status}`);
  }

  const data = await res.json();
  return data as T;
}

export async function fetchFixtures(
  leagueId: number,
  date: string
): Promise<Fixture[]> {
  const data = await fetchWithKey<FootballAPIResponse>(
    `/fixtures?league=${leagueId}&date=${date}&status=NS`
  );

  return data.response.map((f) => ({
    id: crypto.randomUUID(),
    externalId: String(f.fixture.id),
    homeTeam: f.teams.home.name,
    awayTeam: f.teams.away.name,
    homeTeamLogo: f.teams.home.logo,
    awayTeamLogo: f.teams.away.logo,
    league: f.league.name,
    kickoffAt: new Date(f.fixture.date),
    status: 'scheduled',
    realHomeGoals: null,
    realAwayGoals: null,
    rawResult: null,
    createdAt: new Date(),
  }));
}

export async function fetchRealResult(
  externalFixtureId: string
): Promise<{ homeGoals: number; awayGoals: number; status: string }> {
  const data = await fetchWithKey<FootballAPIResponse>(
    `/fixtures?id=${externalFixtureId}`
  );

  const fixture = data.response[0];
  if (!fixture) {
    throw new Error('Fixture not found');
  }

  return {
    homeGoals: fixture.goals.home ?? 0,
    awayGoals: fixture.goals.away ?? 0,
    status: fixture.fixture.status.short,
  };
}