export interface Schema {
  name: string;
  columns: string[];
  types: string[];
}

export interface MainUIProps {
  initialOutput: string;
  initialSchemas: Schema[];
  theme: string;
  concepts: string[];
  concept: string;
  randomChoice: number;
}

export type HistoryEntry = {
  userQuery: string;
  dbResultString: string;
};

/** Tracks each task's correctness, name, concept, and narrative. */
export type TaskStatus = {
  taskName: string;
  correct: boolean;
  concept: string;
  narrative: string;
};