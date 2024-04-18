import {
  EnrichedPerformance,
  Performance,
  Invoice,
  Play,
  Plays,
} from "./types";

class PerformanceCalculator {
  performance: Performance;
  play: Play;

  constructor(performance: Performance, play: Play) {
    this.performance = performance;
    this.play = play;
  }

  get amount() {
    let result = 0;

    switch (this.play.type) {
      case "tragedy":
        result = 40_000;
        if (this.performance.audience > 30) {
          result += 1_000 * (this.performance.audience - 30);
        }
        break;

      case "comedy":
        throw new Error("oops");

      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }

    return result;
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
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
    return (
      Math.max(this.performance.audience - 30, 0) +
      Math.floor(this.performance.audience / 5)
    );
  }
}
class TragedyCalculator extends PerformanceCalculator {}

export function createStatementData(invoice: Invoice, plays: Plays) {
  const performances = invoice.performances.map(enrichPerformance);

  return {
    customer: invoice.customer,
    performances,
    totalAmount: getTotalAmount(performances),
    totalVolumeCredits: getTotalVolumeCredits(performances),
  };

  function createPerformanceCalculator(performance: Performance, play: Play) {
    switch (play.type) {
      case "tragedy":
        return new TragedyCalculator(performance, play);
      case "comedy":
        return new ComedyCalculator(performance, play);
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
  }

  function enrichPerformance(performance: Performance): EnrichedPerformance {
    const calculator = createPerformanceCalculator(
      performance,
      getPlayFor(performance),
    );

    return Object.assign(performance, {
      play: calculator.play,
      amount: calculator.amount,
      volumeCredits: calculator.volumeCredits,
    });
  }

  function getTotalAmount(performances: Array<EnrichedPerformance>) {
    return performances.reduce((sum, perf) => sum + perf.amount, 0);
  }

  function getTotalVolumeCredits(performances: Array<EnrichedPerformance>) {
    return performances.reduce((sum, perf) => sum + perf.volumeCredits, 0);
  }

  function getPlayFor(performance: Performance) {
    return plays[performance.playID];
  }
}
