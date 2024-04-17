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

export type EnrichedPerformance = Performance & {
  play: Play;
  amount: number;
  volumeCredits: number;
};

export type StatementData = {
  customer: string;
  performances: Array<EnrichedPerformance>;
  totalAmount: number;
  totalVolumeCredits: number;
};
