use std::{error::Error, fs::File, io::BufReader, path::Path};

use serde::{Serialize, Deserialize};

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

fn main() {
  let json = read_invoices_from_file("../invoices.json").unwrap();

  println!("{:?}", json);
}

fn read_invoices_from_file<P: AsRef<Path>>(path: P) -> Result<Vec<Invoice>, Box<dyn Error>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);

    Ok(serde_json::from_reader(reader)?)
}
