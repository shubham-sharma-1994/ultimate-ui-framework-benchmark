use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Item {
    pub id: usize,
    pub title: String,
    pub subtitle: String,
    pub score: u32,
    pub colors: Vec<String>,
    pub body: String,
}

pub fn load_data() -> Vec<Item> {
    serde_json::from_str(include_str!("../../../spec/data.json"))
        .map(|v: serde_json::Value| {
            serde_json::from_value::<Vec<Item>>(v["items"].clone()).unwrap_or_default()
        })
        .unwrap_or_default()
}
