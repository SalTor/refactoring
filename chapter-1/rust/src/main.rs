use std::{cmp, collections::HashMap, error::Error, fs::File, io::BufReader, path::Path};

use rusty_money::{iso, Money};
use serde::{Deserialize, Serialize};

fn main() {
    let invoices = read_invoices_from_file("../invoices.json").unwrap();
    let plays = read_plays_from_file("../plays.json").unwrap();

    println!("{}", statement(invoices.into_iter().next().unwrap(), plays));
}

fn statement(invoice: Invoice, plays: HashMap<String, Play>) -> String {
    let mut total_amount = 0;
    let mut volume_credits = 0;
    let mut result = format!(
        "Statement for {client_name}\n",
        client_name = invoice.customer
    );

    println!("{} {} {}", total_amount, volume_credits, result);

    for perf in invoice.performances.iter() {
        if let Some(play) = plays.get(&perf.play_id) {
            let play_type = play.r#type.to_owned();
            let this_amount = match play_type.as_str() {
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
                _ => continue,
            };

            volume_credits += i32::from(cmp::max(perf.audience - 30, 0));
            if play_type.as_str() == "comedy" {
                volume_credits += i32::from(perf.audience / 5);
            }

            result += &format!(
                " {play_name}: {amount} ({seats} seats)\n",
                play_name = play.name,
                amount = Money::from_major((this_amount / 100).into(), iso::USD),
                seats = perf.audience
            );
            total_amount += this_amount;
        };
    }

    result += &format!("Amount owed is {amount}\n", amount = Money::from_major((total_amount / 100).into(), iso::USD));
    result += &format!("You earned {credits} credits\n", credits = volume_credits);

    result
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

#[derive(Debug, Deserialize, Serialize)]
struct Performance {
    play_id: String,
    audience: i8,
}

#[derive(Debug, Deserialize, Serialize)]
struct Play {
    name: String,
    r#type: String,
}
