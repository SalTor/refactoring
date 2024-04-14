import type { Invoice, Performance, Plays } from "./types";

export function statement(invoice: Invoice, plays: Plays) {
  let result = `Statements for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    // print line for this order
    result += `${getPlayFor(perf).name}: ${usd(getAmountFor(perf))} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(getTotalAmount())}\n`;
  result += `You earned ${getTotalVolumeCredits()} credits\n`;

  return result;

  function getTotalAmount() {
    let totalAmount = 0;
    for (let perf of invoice.performances) {
      totalAmount += getAmountFor(perf);
    }
    return totalAmount;
  }

  function getTotalVolumeCredits() {
    let result = 0;
    for (let perf of invoice.performances) {
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

  function getVolumeCreditsFor(performance: Performance) {
    let result = Math.max(performance.audience - 30, 0);

    if ("comedy" === getPlayFor(performance).type) {
      result += Math.floor(performance.audience / 5);
    }

    return result;
  }

  function getAmountFor(performance: Performance) {
    let result = 0;

    switch (getPlayFor(performance).type) {
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
        throw new Error(`unknown type: ${getPlayFor(performance).type}`);
    }

    return result;
  }

  function getPlayFor(performance: Performance) {
    return plays[performance.playID];
  }
}
