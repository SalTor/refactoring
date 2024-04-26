use std::{cmp, collections::HashMap, error::Error, fs::File, io::BufReader, path::Path};

use rusty_money::{
    iso::{self, Currency},
    Money,
};
use serde::{Deserialize, Serialize};

fn main() {
    let invoices = read_invoices_from_file("../invoices.json").unwrap();

    println!("{}", statement(invoices.into_iter().next().unwrap()));
}

fn statement(invoice: Invoice) -> String {
    let statement_data = StatementData {
        customer: invoice.customer.clone(),
        performances: invoice.performances.clone(),
    };

    render_plain_text(statement_data)
}

struct StatementData {
    customer: String,
    performances: Vec<Performance>,
}

fn render_plain_text(data: StatementData) -> String {
    let mut result = format!("Statement for {client_name}\n", client_name = data.customer);

    for perf in data.performances.iter() {
        result += &format!(
            "    {play_name}: {amount} ({seats} seats)\n",
            play_name = play_for(perf).name,
            amount = usd(amount_for(perf)),
            seats = perf.audience
        );
    }

    result += &format!(
        "Amount owed is {amount}\n",
        amount = usd(get_total_amount())
    );
    result += &format!(
        "You earned {credits} credits",
        credits = total_volume_credits()
    );

    result
}

fn get_total_amount() -> i32 {
    let invoices = read_invoices_from_file("../invoices.json").unwrap();
    let invoice = invoices.into_iter().next().unwrap();
    let mut result: i32 = 0;
    for perf in invoice.performances.iter() {
        result += amount_for(perf);
    }
    result
}

fn total_volume_credits() -> i32 {
    let invoices = read_invoices_from_file("../invoices.json").unwrap();
    let invoice = invoices.into_iter().next().unwrap();
    let mut volume_credits = 0;
    for perf in invoice.performances.iter() {
        volume_credits += volume_credits_for(perf);
    }
    volume_credits
}

fn volume_credits_for(perf: &Performance) -> i32 {
    let mut result = i32::from(cmp::max(perf.audience - 30, 0));
    if play_for(perf).r#type.as_str() == "comedy" {
        result += i32::from(perf.audience / 5);
    }
    result
}

fn usd<'a>(cents: i32) -> Money<'a, Currency> {
    let result = Money::from_major((cents / 100).into(), iso::USD);

    result
}

fn play_for(perf: &Performance) -> Play {
    let plays = read_plays_from_file("../plays.json").unwrap();

    plays.get(&perf.play_id).unwrap().clone()
}

fn amount_for(perf: &Performance) -> i32 {
    match play_for(perf).r#type.to_owned().as_str() {
        "tragedy" => {
            let mut amount: i32 = 40000;
            if perf.audience > 30 {
                amount += 1000 * i32::from(perf.audience - 30);
            }
            amount
        }
        "comedy" => {
            let mut amount: i32 = 30000;
            if perf.audience > 20 {
                amount += 10000 + 500 * i32::from(perf.audience - 20);
            }
            amount + 300 * i32::from(perf.audience)
        }
        "fantasy" => {
            let mut amount: i32 = 10000;
            if perf.audience > 40 {
                amount += 30000 + 800 * i32::from(perf.audience - 40);
            }
            amount
        }
        _ => 0,
    }
}

fn read_plays_from_file<P: AsRef<Path>>(path: P) -> Result<HashMap<String, Play>, Box<dyn Error>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);

    Ok(serde_json::from_reader(reader)?)
}

fn read_invoices_from_file<P: AsRef<Path>>(path: P) -> Result<Vec<Invoice>, Box<dyn Error>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);

    Ok(serde_json::from_reader(reader)?)
}

#[derive(Debug, Deserialize, Serialize)]
struct Invoice {
    customer: String,
    performances: Vec<Performance>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct Performance {
    play_id: String,
    audience: i8,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct Play {
    name: String,
    r#type: String,
}

#[test]
fn text_statement() {
    let invoices = read_invoices_from_file("../invoices.json").unwrap();

    assert_eq!(
        statement(invoices.into_iter().next().unwrap()),
        "Statement for BigCo
    Hamlet: $650 (55 seats)
    As You Like It: $580 (35 seats)
    Othello: $500 (40 seats)
    Bewitched: $880 (100 seats)
Amount owed is $2,610
You earned 117 credits"
    )
}
