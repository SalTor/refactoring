import { createStatementData } from "./createStatementData";
import type { Invoice, Plays, StatementData } from "./types";

export function statement(invoice: Invoice, plays: Plays) {
  return renderPlaintext(createStatementData(invoice, plays));
}

export function renderPlaintext(data: StatementData) {
  let result = `Statements for ${data.customer}\n`;

  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;

  return result;
}

function usd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function htmStatement(invoice: Invoice, plays: Plays) {
  return renderHtml(createStatementData(invoice, plays));
}

export function renderHtml(data: StatementData) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;

  result += `<table>
<tr><th>play</th><th>seats</th><th>cost</th></tr>
`;
  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<tr><td>${usd(perf.amount)}</td></tr>\n`;
  }

  result += "</table>\n";

  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;

  return result;
}
