export interface State {
  body: Record<string, any>;
}

export type NextFunc = () => Promise<void>;
