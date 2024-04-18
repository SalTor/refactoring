import { htmStatement, statement } from "./statement";
import invoices from "./invoices.json";
import plays from "./plays.json";

test("Render as text", () => {
  expect(statement(invoices[0], plays)).toBe(`Statements for BigCo
Hamlet: $650.00 (55 seats)
As You Like It: $580.00 (35 seats)
Othello: $500.00 (40 seats)
Bewitched: $880.00 (100 seats)
Amount owed is $2,610.00
You earned 117 credits
`);
});

test("Render as html", () => {
  expect(htmStatement(invoices[0], plays)).toBe(`<h1>Statement for BigCo</h1>
<table>
<tr><th>play</th><th>seats</th><th>cost</th></tr>
<tr><td>Hamlet</td><td>55</td><tr><td>$650.00</td></tr>
<tr><td>As You Like It</td><td>35</td><tr><td>$580.00</td></tr>
<tr><td>Othello</td><td>40</td><tr><td>$500.00</td></tr>
<tr><td>Bewitched</td><td>100</td><tr><td>$880.00</td></tr>
</table>
<p>Amount owed is <em>$2,610.00</em></p>
<p>You earned <em>117</em> credits</p>
`);
});
