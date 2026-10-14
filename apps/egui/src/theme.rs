use egui::{Color32, FontData, FontDefinitions, FontFamily, TextStyle};

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct ColorTokens {
    pub background: Color32,
    pub surface: Color32,
    pub surface_alt: Color32,
    pub primary: Color32,
    pub on_primary: Color32,
    pub accent: Color32,
    pub text: Color32,
    pub text_muted: Color32,
    pub outline: Color32,
    pub success: Color32,
    pub error: Color32,
}

pub fn hex_to_color(hex: &str) -> Color32 {
    let hex = hex.trim().trim_start_matches('#');
    if hex.len() == 6 {
        let r = u8::from_str_radix(&hex[0..2], 16).unwrap_or(0);
        let g = u8::from_str_radix(&hex[2..4], 16).unwrap_or(0);
        let b = u8::from_str_radix(&hex[4..6], 16).unwrap_or(0);
        Color32::from_rgb(r, g, b)
    } else if hex.len() == 8 {
        let r = u8::from_str_radix(&hex[0..2], 16).unwrap_or(0);
        let g = u8::from_str_radix(&hex[2..4], 16).unwrap_or(0);
        let b = u8::from_str_radix(&hex[4..6], 16).unwrap_or(0);
        let a = u8::from_str_radix(&hex[6..8], 16).unwrap_or(255);
        Color32::from_rgba_premultiplied(r, g, b, a)
    } else {
        Color32::BLACK
    }
}

pub fn lerp_color(a: Color32, b: Color32, t: f32) -> Color32 {
    let t = t.clamp(0.0, 1.0);
    let r = (a.r() as f32 + (b.r() as f32 - a.r() as f32) * t) as u8;
    let g = (a.g() as f32 + (b.g() as f32 - a.g() as f32) * t) as u8;
    let b_val = (a.b() as f32 + (b.b() as f32 - a.b() as f32) * t) as u8;
    let alpha = (a.a() as f32 + (b.a() as f32 - a.a() as f32) * t) as u8;
    Color32::from_rgba_premultiplied(r, g, b_val, alpha)
}

pub const LIGHT_TOKENS: ColorTokens = ColorTokens {
    background: Color32::from_rgb(0xF6, 0xF4, 0xFB),
    surface: Color32::from_rgb(0xFF, 0xFF, 0xFF),
    surface_alt: Color32::from_rgb(0xEE, 0xEA, 0xF7),
    primary: Color32::from_rgb(0x67, 0x50, 0xA4),
    on_primary: Color32::from_rgb(0xFF, 0xFF, 0xFF),
    accent: Color32::from_rgb(0xFF, 0x7A, 0x59),
    text: Color32::from_rgb(0x1D, 0x1B, 0x20),
    text_muted: Color32::from_rgb(0x6B, 0x66, 0x74),
    outline: Color32::from_rgb(0xD9, 0xD3, 0xE6),
    success: Color32::from_rgb(0x2E, 0x9E, 0x6B),
    error: Color32::from_rgb(0xE5, 0x48, 0x4D),
};

pub const DARK_TOKENS: ColorTokens = ColorTokens {
    background: Color32::from_rgb(0x12, 0x10, 0x16),
    surface: Color32::from_rgb(0x1C, 0x1A, 0x22),
    surface_alt: Color32::from_rgb(0x26, 0x23, 0x2E),
    primary: Color32::from_rgb(0xCF, 0xBC, 0xFF),
    on_primary: Color32::from_rgb(0x38, 0x1E, 0x72),
    accent: Color32::from_rgb(0xFF, 0x9E, 0x85),
    text: Color32::from_rgb(0xE6, 0xE0, 0xE9),
    text_muted: Color32::from_rgb(0xA9, 0xA3, 0xB3),
    outline: Color32::from_rgb(0x3A, 0x36, 0x44),
    success: Color32::from_rgb(0x5F, 0xD3, 0x9B),
    error: Color32::from_rgb(0xE5, 0x48, 0x4D),
};

impl ColorTokens {
    pub fn interpolated(&self, target: &ColorTokens, t: f32) -> ColorTokens {
        ColorTokens {
            background: lerp_color(self.background, target.background, t),
            surface: lerp_color(self.surface, target.surface, t),
            surface_alt: lerp_color(self.surface_alt, target.surface_alt, t),
            primary: lerp_color(self.primary, target.primary, t),
            on_primary: lerp_color(self.on_primary, target.on_primary, t),
            accent: lerp_color(self.accent, target.accent, t),
            text: lerp_color(self.text, target.text, t),
            text_muted: lerp_color(self.text_muted, target.text_muted, t),
            outline: lerp_color(self.outline, target.outline, t),
            success: lerp_color(self.success, target.success, t),
            error: lerp_color(self.error, target.error, t),
        }
    }
}

pub struct Radii;
impl Radii {
    pub const CARD: f32 = 20.0;
    pub const BUTTON: f32 = 14.0;
    pub const CHIP: f32 = 999.0;
    pub const INPUT: f32 = 14.0;
    pub const SHEET_TOP: f32 = 28.0;
}

pub struct Durations;
impl Durations {
    pub const FAST: f32 = 0.150;
    pub const BASE: f32 = 0.300;
    pub const SLOW: f32 = 0.500;
}

pub fn configure_fonts(ctx: &egui::Context) {
    let mut fonts = FontDefinitions::default();

    fonts.font_data.insert(
        "Inter-Regular".to_owned(),
        std::sync::Arc::new(FontData::from_static(include_bytes!("../assets/fonts/Inter-Regular.ttf"))),
    );
    fonts.font_data.insert(
        "Inter-Medium".to_owned(),
        std::sync::Arc::new(FontData::from_static(include_bytes!("../assets/fonts/Inter-Medium.ttf"))),
    );
    fonts.font_data.insert(
        "Inter-SemiBold".to_owned(),
        std::sync::Arc::new(FontData::from_static(include_bytes!("../assets/fonts/Inter-SemiBold.ttf"))),
    );
    fonts.font_data.insert(
        "Inter-Bold".to_owned(),
        std::sync::Arc::new(FontData::from_static(include_bytes!("../assets/fonts/Inter-Bold.ttf"))),
    );

    // Primary font family configuration
    fonts
        .families
        .entry(FontFamily::Proportional)
        .or_default()
        .insert(0, "Inter-Regular".to_owned());

    ctx.set_fonts(fonts);

    // Setup style text styles matching the type scale
    let mut style = (*ctx.style_of(egui::Theme::Light)).clone();
    style.text_styles = [
        (
            TextStyle::Heading, // Display 32
            egui::FontId::new(32.0, FontFamily::Proportional),
        ),
        (
            TextStyle::Name("Title".into()), // Title 22
            egui::FontId::new(22.0, FontFamily::Proportional),
        ),
        (
            TextStyle::Body, // Body 16
            egui::FontId::new(16.0, FontFamily::Proportional),
        ),
        (
            TextStyle::Button, // Label 13
            egui::FontId::new(13.0, FontFamily::Proportional),
        ),
        (
            TextStyle::Small, // Caption 12
            egui::FontId::new(12.0, FontFamily::Proportional),
        ),
    ]
    .into();

    ctx.set_style_of(egui::Theme::Light, style.clone());
    ctx.set_style_of(egui::Theme::Dark, style);
}
