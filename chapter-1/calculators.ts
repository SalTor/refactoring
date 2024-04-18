import { Play, Performance } from "./types";

class PerformanceCalculator {
  performance: Performance;
  play: Play;

  constructor(performance: Performance, play: Play) {
    this.performance = performance;
    this.play = play;
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

export class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30_000;
    if (this.performance.audience > 20) {
      result += 10_000 + 500 * (this.performance.audience - 20);
    }
    return (result += 300 * this.performance.audience);
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

export class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40_000;
    if (this.performance.audience > 30) {
      result += 1_000 * (this.performance.audience - 30);
    }
    return result;
  }
}
