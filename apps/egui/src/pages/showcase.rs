use egui::{
    Color32, FontId, Pos2, Rect, Sense, Stroke, Ui, Vec2,
};
use std::f32::consts::PI;

use crate::components::floating_input::FloatingInput;
use crate::components::orbit::render_hero_card;
use crate::data::Item;
use crate::motion::{ease_base, ease_slow};
use crate::theme::{lerp_color, ColorTokens, Durations, Radii};

#[derive(Clone, Debug, PartialEq)]
pub enum IntensityChip {
    Low,
    Medium,
    High,
}

pub struct ShowcaseState {
    pub count: i32,
    pub prev_count: i32,
    pub count_anim_start: f64,
    pub press_start_time: Option<f64>,
    pub shake_start_time: Option<f64>,
    pub notifications_enabled: bool,
    pub intensity: f32,
    pub selected_chip: IntensityChip,
    pub name_input: String,
    pub entrance_start_time: f64,
}

impl Default for ShowcaseState {
    fn default() -> Self {
        Self {
            count: 0,
            prev_count: 0,
            count_anim_start: -10.0,
            press_start_time: None,
            shake_start_time: None,
            notifications_enabled: true,
            intensity: 60.0,
            selected_chip: IntensityChip::Medium,
            name_input: String::new(),
            entrance_start_time: 0.0,
        }
    }
}

pub fn render_showcase(
    ui: &mut Ui,
    state: &mut ShowcaseState,
    items: &[Item],
    tokens: &ColorTokens,
    now: f64,
) -> Option<i32> {
    let mut selected_item_id = None;

    // 16 px gaps between sections
    let gap = 16.0;

    // 1. Hero Card
    render_hero_card(
        ui,
        ui.available_width(),
        now as f32,
        tokens.primary,
        tokens.accent,
    );
    ui.add_space(gap);

    // 2. Counter Row
    render_counter_row(ui, state, tokens, now);
    ui.add_space(gap);

    // 3. Controls Card (Switch, Slider, Chips)
    render_controls_card(ui, state, tokens, now);
    ui.add_space(gap);

    // 4. Text Field + Greeting
    render_name_input_section(ui, state, tokens);
    ui.add_space(gap);

    // 5. Staggered List of 6 items
    let list_selected = render_staggered_list(ui, state, items, tokens, now);
    if list_selected.is_some() {
        selected_item_id = list_selected;
    }

    // Bottom padding 32 px
    ui.add_space(32.0);

    selected_item_id
}

fn render_counter_row(ui: &mut Ui, state: &mut ShowcaseState, tokens: &ColorTokens, now: f64) {
    let card_height = 80.0;
    let card_width = ui.available_width();
    let (rect, _response) = ui.allocate_exact_size(Vec2::new(card_width, card_height), Sense::hover());
    let painter = ui.painter();

    // Card background & e1 shadow
    painter.rect_filled(rect, Radii::CARD, tokens.surface);
    let shadow_color = Color32::from_black_alpha(15);
    painter.rect_stroke(
        rect.expand(1.0),
        Radii::CARD,
        Stroke::new(1.0, shadow_color),
        egui::StrokeKind::Outside,
    );

    // Calculate shake offset if shaking
    let mut shake_offset_x = 0.0;
    if let Some(shake_start) = state.shake_start_time {
        let shake_elapsed = (now - shake_start) as f32;
        if shake_elapsed < 0.3 {
            let progress = shake_elapsed / 0.3;
            // 3 oscillations over 300 ms, amplitude +- 6px
            let decay = 1.0 - progress;
            shake_offset_x = (progress * 6.0 * PI).sin() * 6.0 * decay;
            ui.ctx().request_repaint();
        } else {
            state.shake_start_time = None;
        }
    }

    // Label "Taps"
    painter.text(
        Pos2::new(rect.min.x + 20.0, rect.min.y + 18.0),
        egui::Align2::LEFT_TOP,
        "Taps",
        FontId::new(13.0, egui::FontFamily::Proportional),
        tokens.text_muted,
    );

    // Big Number with slide+fade animation
    let count_elapsed = (now - state.count_anim_start) as f32;
    let anim_t = (count_elapsed / Durations::BASE).clamp(0.0, 1.0);
    let eased_t = ease_base(anim_t);

    let number_center_y = rect.min.y + 48.0;
    let number_x = rect.min.x + 20.0 + shake_offset_x;

    if anim_t < 1.0 && state.prev_count != state.count {
        ui.ctx().request_repaint();
        // Old number slides up and fades out
        let old_y = number_center_y - eased_t * 24.0;
        let old_alpha = ((1.0 - eased_t) * 255.0) as u8;
        let mut old_color = tokens.text;
        old_color = Color32::from_rgba_premultiplied(
            (old_color.r() as u16 * old_alpha as u16 / 255) as u8,
            (old_color.g() as u16 * old_alpha as u16 / 255) as u8,
            (old_color.b() as u16 * old_alpha as u16 / 255) as u8,
            old_alpha,
        );
        painter.text(
            Pos2::new(number_x, old_y),
            egui::Align2::LEFT_CENTER,
            state.prev_count.to_string(),
            FontId::new(32.0, egui::FontFamily::Proportional),
            old_color,
        );

        // New number slides in from below
        let new_y = number_center_y + (1.0 - eased_t) * 24.0;
        let new_alpha = (eased_t * 255.0) as u8;
        let mut new_color = tokens.text;
        new_color = Color32::from_rgba_premultiplied(
            (new_color.r() as u16 * new_alpha as u16 / 255) as u8,
            (new_color.g() as u16 * new_alpha as u16 / 255) as u8,
            (new_color.b() as u16 * new_alpha as u16 / 255) as u8,
            new_alpha,
        );
        painter.text(
            Pos2::new(number_x, new_y),
            egui::Align2::LEFT_CENTER,
            state.count.to_string(),
            FontId::new(32.0, egui::FontFamily::Proportional),
            new_color,
        );
    } else {
        painter.text(
            Pos2::new(number_x, number_center_y),
            egui::Align2::LEFT_CENTER,
            state.count.to_string(),
            FontId::new(32.0, egui::FontFamily::Proportional),
            tokens.text,
        );
    }

    // FAB Button "+" (radius button 14)
    let fab_size = 48.0;
    let fab_rect = Rect::from_center_size(
        Pos2::new(rect.max.x - 36.0, rect.center().y),
        Vec2::splat(fab_size),
    );

    let fab_id = ui.make_persistent_id("counter-inc");
    let fab_resp = ui.interact(fab_rect, fab_id, Sense::click_and_drag());

    // Scale feedback 0.96 when pressed
    let is_down = fab_resp.is_pointer_button_down_on();
    let scale_anim = ui.ctx().animate_value_with_time(
        fab_id.with("scale"),
        if is_down { 0.96 } else { 1.0 },
        Durations::FAST,
    );

    let drawn_fab_rect = Rect::from_center_size(fab_rect.center(), Vec2::splat(fab_size * scale_anim));
    painter.rect_filled(drawn_fab_rect, Radii::BUTTON, tokens.primary);

    // "+" Icon
    let plus_center = drawn_fab_rect.center();
    painter.line_segment(
        [
            Pos2::new(plus_center.x - 8.0, plus_center.y),
            Pos2::new(plus_center.x + 8.0, plus_center.y),
        ],
        Stroke::new(2.5, tokens.on_primary),
    );
    painter.line_segment(
        [
            Pos2::new(plus_center.x, plus_center.y - 8.0),
            Pos2::new(plus_center.x, plus_center.y + 8.0),
        ],
        Stroke::new(2.5, tokens.on_primary),
    );

    // Track press duration for long-press reset (>= 0.5s)
    if is_down {
        if state.press_start_time.is_none() {
            state.press_start_time = Some(now);
        } else if let Some(start) = state.press_start_time {
            if now - start >= 0.5 {
                // Long-press triggered!
                state.prev_count = state.count;
                state.count = 0;
                state.count_anim_start = now;
                state.shake_start_time = Some(now);
                state.press_start_time = None;
            }
        }
    } else {
        if let Some(start) = state.press_start_time {
            if now - start < 0.5 && fab_resp.clicked() {
                // Regular tap
                state.prev_count = state.count;
                state.count += 1;
                state.count_anim_start = now;
            }
            state.press_start_time = None;
        }
    }
}

fn render_controls_card(
    ui: &mut Ui,
    state: &mut ShowcaseState,
    tokens: &ColorTokens,
    _now: f64,
) {
    let width = ui.available_width();
    let card_height = 200.0;
    let (rect, _resp) = ui.allocate_exact_size(Vec2::new(width, card_height), Sense::hover());
    let painter = ui.painter();

    // Background & e1 shadow
    painter.rect_filled(rect, Radii::CARD, tokens.surface);
    painter.rect_stroke(
        rect.expand(1.0),
        Radii::CARD,
        Stroke::new(1.0, Color32::from_black_alpha(15)),
        egui::StrokeKind::Outside,
    );

    let inner_rect = rect.shrink(16.0);
    let mut cur_y = inner_rect.min.y;

    // --- Switch "Notifications" ---
    let switch_row_rect = Rect::from_min_size(Pos2::new(inner_rect.min.x, cur_y), Vec2::new(inner_rect.width(), 36.0));
    painter.text(
        Pos2::new(switch_row_rect.min.x, switch_row_rect.center().y),
        egui::Align2::LEFT_CENTER,
        "Notifications",
        FontId::new(16.0, egui::FontFamily::Proportional),
        tokens.text,
    );

    // Switch widget
    let switch_width = 48.0;
    let switch_height = 28.0;
    let switch_rect = Rect::from_min_size(
        Pos2::new(switch_row_rect.max.x - switch_width, switch_row_rect.center().y - switch_height / 2.0),
        Vec2::new(switch_width, switch_height),
    );
    let switch_id = ui.make_persistent_id("switch");
    let switch_resp = ui.interact(switch_rect, switch_id, Sense::click());
    if switch_resp.clicked() {
        state.notifications_enabled = !state.notifications_enabled;
    }

    let switch_t = ui.ctx().animate_bool_with_time(switch_id, state.notifications_enabled, Durations::FAST);
    let switch_bg = lerp_color(tokens.outline, tokens.primary, switch_t);
    painter.rect_filled(switch_rect, Radii::CHIP, switch_bg);

    let knob_radius = 10.0;
    let knob_min_x = switch_rect.min.x + 4.0 + knob_radius;
    let knob_max_x = switch_rect.max.x - 4.0 - knob_radius;
    let knob_x = knob_min_x + (knob_max_x - knob_min_x) * switch_t;
    let knob_color = if switch_t > 0.5 { tokens.on_primary } else { Color32::WHITE };
    painter.circle_filled(Pos2::new(knob_x, switch_rect.center().y), knob_radius, knob_color);

    cur_y += 48.0;

    // --- Slider 0-100 "Intensity" with live value label above thumb ---
    let slider_row_rect = Rect::from_min_size(Pos2::new(inner_rect.min.x, cur_y), Vec2::new(inner_rect.width(), 48.0));
    painter.text(
        Pos2::new(slider_row_rect.min.x, slider_row_rect.min.y + 4.0),
        egui::Align2::LEFT_TOP,
        "Intensity",
        FontId::new(13.0, egui::FontFamily::Proportional),
        tokens.text_muted,
    );

    let track_y = slider_row_rect.min.y + 32.0;
    let track_left = slider_row_rect.min.x;
    let track_right = slider_row_rect.max.x;
    let track_w = track_right - track_left;

    let slider_id = ui.make_persistent_id("slider");
    let slider_interact_rect = Rect::from_min_max(
        Pos2::new(track_left, track_y - 12.0),
        Pos2::new(track_right, track_y + 12.0),
    );
    let slider_resp = ui.interact(slider_interact_rect, slider_id, Sense::click_and_drag());
    if let Some(pos) = slider_resp.interact_pointer_pos() {
        let val = ((pos.x - track_left) / track_w * 100.0).clamp(0.0, 100.0);
        state.intensity = val;
    }

    // Inactive track
    painter.line_segment(
        [Pos2::new(track_left, track_y), Pos2::new(track_right, track_y)],
        Stroke::new(4.0, tokens.outline),
    );

    // Active track
    let thumb_x = track_left + (state.intensity / 100.0) * track_w;
    painter.line_segment(
        [Pos2::new(track_left, track_y), Pos2::new(thumb_x, track_y)],
        Stroke::new(4.0, tokens.primary),
    );

    // Thumb circle
    painter.circle_filled(Pos2::new(thumb_x, track_y), 9.0, tokens.primary);
    painter.circle_filled(Pos2::new(thumb_x, track_y), 4.0, Color32::WHITE);

    // Live value label above thumb
    let val_text = format!("{:.0}", state.intensity);
    painter.text(
        Pos2::new(thumb_x, track_y - 18.0),
        egui::Align2::CENTER_CENTER,
        val_text,
        FontId::new(12.0, egui::FontFamily::Proportional),
        tokens.primary,
    );

    cur_y += 62.0;

    // --- 3 Chips: Low / Medium / High (single select) ---
    let chips = [
        ("Low", IntensityChip::Low, "chip-low"),
        ("Medium", IntensityChip::Medium, "chip-medium"),
        ("High", IntensityChip::High, "chip-high"),
    ];

    let chip_w = (inner_rect.width() - 16.0) / 3.0;
    let chip_h = 32.0;

    for (idx, (label, chip_val, id_str)) in chips.into_iter().enumerate() {
        let chip_x = inner_rect.min.x + idx as f32 * (chip_w + 8.0);
        let chip_rect = Rect::from_min_size(Pos2::new(chip_x, cur_y), Vec2::new(chip_w, chip_h));
        let chip_id = ui.make_persistent_id(id_str);
        let is_selected = state.selected_chip == chip_val;

        let chip_resp = ui.interact(chip_rect, chip_id, Sense::click());
        if chip_resp.clicked() {
            state.selected_chip = chip_val;
        }

        let select_anim = ui.ctx().animate_bool_with_time(chip_id, is_selected, Durations::FAST);
        let bg_color = lerp_color(tokens.surface_alt, tokens.primary, select_anim);
        let text_color = lerp_color(tokens.text, tokens.on_primary, select_anim);

        painter.rect_filled(chip_rect, Radii::CHIP, bg_color);
        painter.text(
            chip_rect.center(),
            egui::Align2::CENTER_CENTER,
            label,
            FontId::new(13.0, egui::FontFamily::Proportional),
            text_color,
        );
    }
}

fn render_name_input_section(ui: &mut Ui, state: &mut ShowcaseState, tokens: &ColorTokens) {
    let input = FloatingInput {
        label: "Your name",
        text: &mut state.name_input,
        outline_color: tokens.outline,
        primary_color: tokens.primary,
        surface_color: tokens.surface,
        text_color: tokens.text,
        text_muted: tokens.text_muted,
    };
    input.show(ui);

    // Cross-fading greeting "Hello, {name}"
    let has_name = !state.name_input.trim().is_empty();
    let greeting_id = ui.make_persistent_id("greeting_crossfade");
    let greeting_anim = ui.ctx().animate_bool_with_time(greeting_id, has_name, Durations::FAST);

    if greeting_anim > 0.01 {
        ui.add_space(8.0);
        let alpha = (greeting_anim * 255.0) as u8;
        let mut color = tokens.primary;
        color = Color32::from_rgba_premultiplied(
            (color.r() as u16 * alpha as u16 / 255) as u8,
            (color.g() as u16 * alpha as u16 / 255) as u8,
            (color.b() as u16 * alpha as u16 / 255) as u8,
            alpha,
        );
        let greeting = format!("Hello, {}", state.name_input.trim());
        ui.label(
            egui::RichText::new(greeting)
                .font(FontId::new(16.0, egui::FontFamily::Proportional))
                .color(color),
        );
    }
}

fn render_staggered_list(
    ui: &mut Ui,
    state: &mut ShowcaseState,
    items: &[Item],
    tokens: &ColorTokens,
    now: f64,
) -> Option<i32> {
    let mut selected_id = None;

    if state.entrance_start_time == 0.0 {
        state.entrance_start_time = now;
    }

    let base_t = state.entrance_start_time;

    for (i, item) in items.iter().enumerate() {
        let delay = i as f64 * 0.050; // 50 ms stagger step
        let elapsed = ((now - base_t - delay) / (Durations::SLOW as f64)).clamp(0.0, 1.0) as f32;
        let eased = ease_slow(elapsed);

        if elapsed < 1.0 {
            ui.ctx().request_repaint();
        }

        let slide_y = (1.0 - eased) * 24.0;

        let row_height = 72.0;
        let (rect, _response) = ui.allocate_exact_size(Vec2::new(ui.available_width(), row_height), Sense::hover());

        // Offset row rect according to staggered slide
        let drawn_rect = rect.translate(Vec2::new(0.0, slide_y));

        let painter = ui.painter();
        let item_id = ui.make_persistent_id(format!("item-{}", item.id));
        let row_resp = ui.interact(drawn_rect, item_id, Sense::click());

        // Hover effect: surface -> surfaceAlt in fast
        let hover_anim = ui.ctx().animate_bool_with_time(item_id.with("hover"), row_resp.hovered(), Durations::FAST);
        let row_bg = lerp_color(tokens.surface, tokens.surface_alt, hover_anim);

        painter.rect_filled(drawn_rect, 16.0, row_bg);

        // 56x56 rounded-16 gradient thumbnail
        let thumb_rect = Rect::from_min_size(
            Pos2::new(drawn_rect.min.x + 8.0, drawn_rect.center().y - 28.0),
            Vec2::splat(56.0),
        );

        let mut mesh = egui::Mesh::default();
        mesh.add_rect_with_uv(thumb_rect, Rect::from_min_max(Pos2::ZERO, Pos2::new(1.0, 1.0)), Color32::WHITE);
        mesh.vertices[0].color = item.color1();
        mesh.vertices[1].color = item.color2();
        mesh.vertices[2].color = item.color2();
        mesh.vertices[3].color = item.color1();
        painter.add(egui::Shape::mesh(mesh));

        // Outline for thumbnail
        painter.rect_stroke(thumb_rect, 16.0, Stroke::new(1.0, tokens.outline), egui::StrokeKind::Outside);

        // Text titles
        let text_left = thumb_rect.max.x + 16.0;
        painter.text(
            Pos2::new(text_left, drawn_rect.min.y + 18.0),
            egui::Align2::LEFT_TOP,
            &item.title,
            FontId::new(16.0, egui::FontFamily::Proportional),
            tokens.text,
        );
        painter.text(
            Pos2::new(text_left, drawn_rect.min.y + 40.0),
            egui::Align2::LEFT_TOP,
            &item.subtitle,
            FontId::new(12.0, egui::FontFamily::Proportional),
            tokens.text_muted,
        );

        // Chevron on right
        let chevron_center = Pos2::new(drawn_rect.max.x - 20.0, drawn_rect.center().y);
        painter.line_segment(
            [
                Pos2::new(chevron_center.x - 4.0, chevron_center.y - 6.0),
                Pos2::new(chevron_center.x + 2.0, chevron_center.y),
            ],
            Stroke::new(2.0, tokens.text_muted),
        );
        painter.line_segment(
            [
                Pos2::new(chevron_center.x + 2.0, chevron_center.y),
                Pos2::new(chevron_center.x - 4.0, chevron_center.y + 6.0),
            ],
            Stroke::new(2.0, tokens.text_muted),
        );

        if row_resp.clicked() {
            selected_id = Some(item.id);
        }

        ui.add_space(8.0);
    }

    selected_id
}
