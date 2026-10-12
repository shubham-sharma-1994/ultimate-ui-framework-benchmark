use slint::{ModelRc, VecModel, SharedString, Color, Model};
use std::rc::Rc;
use serde::Deserialize;

slint::include_modules!();

#[derive(Deserialize)]
struct ItemJson {
    id: i32,
    title: String,
    subtitle: String,
    score: i32,
    colors: Vec<String>,
    body: String,
}

#[derive(Deserialize)]
struct DataJson {
    items: Vec<ItemJson>,
}

fn parse_color(hex: &str) -> Color {
    if hex.len() != 7 || !hex.starts_with('#') {
        return Color::from_rgb_u8(0, 0, 0);
    }
    let r = u8::from_str_radix(&hex[1..3], 16).unwrap_or(0);
    let g = u8::from_str_radix(&hex[3..5], 16).unwrap_or(0);
    let b = u8::from_str_radix(&hex[5..7], 16).unwrap_or(0);
    Color::from_rgb_u8(r, g, b)
}

fn main() {
    let app = App::new().unwrap();

    let data_str = include_str!("../assets/data.json");
    let data: DataJson = serde_json::from_str(data_str).expect("Failed to parse data.json");

    let items_model = Rc::new(VecModel::default());
    for item in data.items {
        let color1 = parse_color(&item.colors[0]);
        let color2 = parse_color(&item.colors[1]);
        items_model.push(ItemData {
            id: item.id,
            title: SharedString::from(item.title),
            subtitle: SharedString::from(item.subtitle),
            score: item.score,
            color1,
            color2,
            body: SharedString::from(item.body),
        });
    }
    app.set_items(ModelRc::from(items_model.clone()));

    app.on_theme_toggled({
        let app_weak = app.as_weak();
        move || {
            if let Some(app) = app_weak.upgrade() {
                // Tokens is exposed as a global. We don't necessarily need to toggle it via Rust if we do it in Slint directly!
                // But let's leave this callback for now and do it in Slint UI.
            }
        }
    });

    let app_weak2 = app.as_weak();
    app.on_item_tapped(move |id| {
        if let Some(app) = app_weak2.upgrade() {
            if let Some(item) = items_model.iter().find(|i| i.id == id) {
                app.set_selected_item(item);
                app.set_current_page(2);
            }
        }
    });

    let app_weak3 = app.as_weak();
    app.on_back_tapped(move || {
        if let Some(app) = app_weak3.upgrade() {
            app.set_current_page(1);
        }
    });
}
