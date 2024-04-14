import type { Invoice, Performance, Play, Plays } from "./types";

export function statement(invoice: Invoice, plays: Plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statements for ${invoice.customer}\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);

    // add extra credit for every ten comedy attendees
    if ("comedy" === getPlayFor(perf).type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    // print line for this order
    result += `${getPlayFor(perf).name}: ${format(getAmountFor(perf) / 100)} (${perf.audience} seats)\n`;

    totalAmount += getAmountFor(perf);
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;

  return result;

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
