import type { Invoice, Performance, Play, Plays } from "./types";

export function statement(invoice: Invoice, plays: Plays) {
  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  };
  return renderPlaintext(statementData);

  function getPlayFor(performance: Performance) {
    return plays[performance.playID];
  }

  function enrichPerformance(performance: Performance): EnrichedPerformance {
    const result = { ...performance } as EnrichedPerformance;

    result.play = getPlayFor(result);
    result.amount = getAmountFor(result);

    return result;
  }

  function getAmountFor(performance: EnrichedPerformance) {
    let result = 0;

    switch (performance.play.type) {
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
        throw new Error(`unknown type: ${performance.play.type}`);
    }

    return result;
  }
}

type EnrichedPerformance = Performance & {
  play: Play;
  amount: number;
};

type StatementData = {
  customer: string;
  performances: Array<EnrichedPerformance>;
};

export function renderPlaintext(data: StatementData) {
  let result = `Statements for ${data.customer}\n`;

  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(getTotalAmount())}\n`;
  result += `You earned ${getTotalVolumeCredits()} credits\n`;

  return result;

  function getTotalAmount() {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }
    return result;
  }

  function getTotalVolumeCredits() {
    let result = 0;
    for (let perf of data.performances) {
      result += getVolumeCreditsFor(perf);
    }
    return result;
  }

  function usd(cents: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(cents / 100);
  }

  function getVolumeCreditsFor(performance: EnrichedPerformance) {
    let result = Math.max(performance.audience - 30, 0);

    if ("comedy" === performance.play.type) {
      result += Math.floor(performance.audience / 5);
    }

    return result;
  }
}
