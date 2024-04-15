export type Invoice = {
  customer: string;
  performances: Array<Performance>;
};

export type Performance = {
  playID: string;
  audience: number;
};

export type Play = {
  name: string;
  type: string | "tragedy" | "comedy";
};

export type Plays = Record<string, Play>;
