import { createPerformanceCalculator } from "./calculators";
import { EnrichedPerformance, Performance, Invoice, Plays } from "./types";

export function createStatementData(invoice: Invoice, plays: Plays) {
  const performances = invoice.performances.map(enrichPerformance);

  return {
    customer: invoice.customer,
    performances,
    totalAmount: getTotalAmount(performances),
    totalVolumeCredits: getTotalVolumeCredits(performances),
  };

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
