use std::{collections::HashMap, error::Error, fs::File, io::BufReader, path::Path};

use serde::{Serialize, Deserialize};

fn main() {
  let invoices = read_invoices_from_file("../invoices.json").unwrap();
  let plays = read_plays_from_file("../plays.json").unwrap();

  statement(invoices.into_iter().next().unwrap(), plays);
}

fn statement(invoice: Invoice, plays: HashMap<String, Play>) {
  println!("{:?}", invoice);
  println!("{:?}", plays);
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
  performances: Vec<Performance>
}

#[derive(Debug, Deserialize, Serialize)]
struct Performance {
  play_id: String,
  audience: i8,
}

#[derive(Debug, Deserialize, Serialize)]
struct Play {
  name: String,
  r#type: String
}
