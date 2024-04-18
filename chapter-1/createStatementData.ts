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
        result = 30_000;
        if (this.performance.audience > 20) {
          result += 10_000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;

      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }

    return result;
  }

  get volumeCredits() {
    let result = Math.max(this.performance.audience - 30, 0);

    if ("comedy" === this.play.type) {
      result += Math.floor(this.performance.audience / 5);
    }

    return result;
  }
}

export function createStatementData(invoice: Invoice, plays: Plays) {
  const performances = invoice.performances.map(enrichPerformance);

  return {
    customer: invoice.customer,
    performances,
    totalAmount: getTotalAmount(performances),
    totalVolumeCredits: getTotalVolumeCredits(performances),
  };

  function enrichPerformance(performance: Performance): EnrichedPerformance {
    const calculator = new PerformanceCalculator(
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
