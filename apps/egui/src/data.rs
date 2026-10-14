use serde::Deserialize;
use egui::Color32;
use crate::theme::hex_to_color;

#[derive(Clone, Debug, Deserialize)]
pub struct Item {
    pub id: i32,
    pub title: String,
    pub subtitle: String,
    pub score: i32,
    pub colors: Vec<String>,
    pub body: String,
}

impl Item {
    pub fn color1(&self) -> Color32 {
        if !self.colors.is_empty() {
            hex_to_color(&self.colors[0])
        } else {
            Color32::from_rgb(0x67, 0x50, 0xA4)
        }
    }

    pub fn color2(&self) -> Color32 {
        if self.colors.len() > 1 {
            hex_to_color(&self.colors[1])
        } else {
            Color32::from_rgb(0xFF, 0x7A, 0x59)
        }
    }
}

#[derive(Clone, Debug, Deserialize)]
pub struct Dataset {
    pub items: Vec<Item>,
}

impl Dataset {
    pub fn load() -> Self {
        let raw = include_str!("../assets/data.json");
        serde_json::from_str(raw).expect("Valid data.json spec")
    }
}
