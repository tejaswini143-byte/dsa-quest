export interface GameState {
  score: number;
  moves: number;
  lives: number;
  isComplete: boolean;
  hasWon: boolean;
  history: any[];
  feedbackMessage: string;
  feedbackType: 'info' | 'success' | 'warning' | 'error';
}

export interface GameAction {
  type: string;
  payload?: any;
}
