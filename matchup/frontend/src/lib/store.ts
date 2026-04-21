import { create } from 'zustand';
import type { GameState, Move, PlayerNumber } from '../types';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    walletBalance: number;
  } | null;
  setToken: (token: string | null) => void;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, user: null }),
}));

interface GameStoreState {
  gameState: GameState | null;
  playerSide: PlayerNumber | null;
  selectedMove: Move | null;
  opponentCommitted: boolean;
  sessionStarted: boolean;

  setGameState: (state: GameState | null) => void;
  setPlayerSide: (side: PlayerNumber | null) => void;
  setSelectedMove: (move: Move | null) => void;
  setOpponentCommitted: (committed: boolean) => void;
  setSessionStarted: (started: boolean) => void;
  reset: () => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  gameState: null,
  playerSide: null,
  selectedMove: null,
  opponentCommitted: false,
  sessionStarted: false,

  setGameState: (gameState) => set({ gameState }),
  setPlayerSide: (playerSide) => set({ playerSide }),
  setSelectedMove: (selectedMove) => set({ selectedMove }),
  setOpponentCommitted: (opponentCommitted) => set({ opponentCommitted }),
  setSessionStarted: (sessionStarted) => set({ sessionStarted }),
  reset: () =>
    set({
      gameState: null,
      playerSide: null,
      selectedMove: null,
      opponentCommitted: false,
      sessionStarted: false,
    }),
}));

interface WalletState {
  balance: number;
  canClaim: boolean;
  transactions: Array<{
    id: string;
    type: 'debit' | 'credit';
    amount: number;
    description: string;
    createdAt: string;
  }>;

  setBalance: (balance: number) => void;
  setCanClaim: (canClaim: boolean) => void;
  setTransactions: (transactions: WalletState['transactions']) => void;
  addTransaction: (transaction: WalletState['transactions'][0]) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  canClaim: false,
  transactions: [],

  setBalance: (balance) => set({ balance }),
  setCanClaim: (canClaim) => set({ canClaim }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
}));