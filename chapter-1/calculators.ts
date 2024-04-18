import { Play, Performance } from "./types";

export function createPerformanceCalculator(
  performance: Performance,
  play: Play,
) {
  switch (play.type) {
    case "tragedy":
      return new TragedyCalculator(performance, play);
    case "comedy":
      return new ComedyCalculator(performance, play);
    case "fantasy":
      return new FantasyCalculator(performance, play);
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
}

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

  get amount() {
    if (this.play.type) {
      throw new Error("Subclass responsibility");
    }
    return 0;
  }
}

class ComedyCalculator extends PerformanceCalculator {
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

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40_000;
    if (this.performance.audience > 30) {
      result += 1_000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class FantasyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 10_000;
    if (this.performance.audience > 40) {
      result += 30_000 + 800 * (this.performance.audience - 40);
    }
    return result;
  }
}
