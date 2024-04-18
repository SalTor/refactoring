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
    const play = getPlayFor(performance);

    const calculator = new PerformanceCalculator(
      performance,
      getPlayFor(performance),
    );

    return Object.assign(performance, {
      play,
      amount: getAmountFor(performance, play),
      volumeCredits: getVolumeCreditsFor(performance, play),
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

  function getVolumeCreditsFor(performance: Performance, play: Play) {
    let result = Math.max(performance.audience - 30, 0);

    if ("comedy" === play.type) {
      result += Math.floor(performance.audience / 5);
    }

    return result;
  }

  function getAmountFor(performance: Performance, play: Play) {
    let result = 0;

    switch (play.type) {
      case "tragedy":
        result = 40_000;
        if (performance.audience > 30) {
          result += 1_000 * (performance.audience - 30);
        }
        break;

      case "comedy":
        result = 30_000;
        if (performance.audience > 20) {
          result += 10_000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;

      default:
        throw new Error(`unknown type: ${play.type}`);
    }

    return result;
  }
}
