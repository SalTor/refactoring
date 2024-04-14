import { statement } from "./statement";
import invoices from "./invoices.json";
import plays from "./plays.json";

test("Render as text", () => {
  expect(statement(invoices[0], plays)).toBe(`Statements for BigCo
Hamlet: $650.00 (55 seats)
As You Like It: $580.00 (35 seats)
Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`);
});

test.todo("Render as html");

describe("Support additional kinds of plays", () => {
  test.todo("placeholder");
});
