use egui::{
    Align, Color32, CornerRadius, FontId, Layout, Pos2, Rect, Sense, Stroke, Ui, Vec2,
};
use std::f32::consts::PI;

use crate::components::progress_ring::ProgressRing;
use crate::components::shimmer::render_shimmer_skeleton;
use crate::data::Item;
use crate::motion::{ease_base, Spring2D};
use crate::theme::{ColorTokens, Durations, Radii};

pub struct SwipeItem {
    pub id: usize,
    pub title: &'static str,
    pub offset_x: f32,
    pub dismissed: bool,
    pub dismiss_anim: f32, // 0.0 -> 1.0 (collapse height)
}

pub struct DetailState {
    pub entry_time: f64,
    pub ring_start_time: f64,
    pub accordion_expanded: bool,
    pub spring_drag: Spring2D,
    pub is_dragging_card: bool,
    pub drag_card_offset: Vec2,
    pub swipe_items: Vec<SwipeItem>,
    pub show_dialog: bool,
    pub dialog_open_time: Option<f64>,
    pub show_sheet: bool,
    pub sheet_drag_y: f32,
    pub toast_message: Option<&'static str>,
    pub toast_start_time: Option<f64>,
}

impl Default for DetailState {
    fn default() -> Self {
        Self {
            entry_time: 0.0,
            ring_start_time: 0.0,
            accordion_expanded: false,
            spring_drag: Spring2D::default(),
            is_dragging_card: false,
            drag_card_offset: Vec2::ZERO,
            swipe_items: vec![
                SwipeItem {
                    id: 1,
                    title: "Swipe item 1",
                    offset_x: 0.0,
                    dismissed: false,
                    dismiss_anim: 0.0,
                },
                SwipeItem {
                    id: 2,
                    title: "Swipe item 2",
                    offset_x: 0.0,
                    dismissed: false,
                    dismiss_anim: 0.0,
                },
                SwipeItem {
                    id: 3,
                    title: "Swipe item 3",
                    offset_x: 0.0,
                    dismissed: false,
                    dismiss_anim: 0.0,
                },
            ],
            show_dialog: false,
            dialog_open_time: None,
            show_sheet: false,
            sheet_drag_y: 0.0,
            toast_message: None,
            toast_start_time: None,
        }
    }
}

pub fn render_detail(
    ui: &mut Ui,
    state: &mut DetailState,
    item: &Item,
    tokens: &ColorTokens,
    now: f64,
    scroll_offset_y: f32,
) -> bool {
    let mut back_clicked = false;

    if state.entry_time == 0.0 {
        state.entry_time = now;
        state.ring_start_time = now;
    }

    let width = ui.available_width();

    // 1. Collapsing Parallax Header (expanded 240, collapsed 56)
    let header_collapse = (scroll_offset_y / (240.0 - 56.0)).clamp(0.0, 1.0);
    let header_height = 240.0 - header_collapse * (240.0 - 56.0);

    let (header_rect, _resp) = ui.allocate_exact_size(Vec2::new(width, header_height), Sense::hover());
    let painter = ui.painter();

    // Parallax background (moves at 0.5x speed)
    let parallax_offset = scroll_offset_y * 0.5;
    let bg_rect = Rect::from_min_size(
        Pos2::new(header_rect.min.x, header_rect.min.y - parallax_offset),
        Vec2::new(width, header_height + parallax_offset),
    );

    let mut mesh = egui::Mesh::default();
    mesh.add_rect_with_uv(bg_rect, Rect::from_min_max(Pos2::ZERO, Pos2::new(1.0, 1.0)), Color32::WHITE);
    mesh.vertices[0].color = item.color1();
    mesh.vertices[1].color = item.color2();
    mesh.vertices[2].color = item.color2();
    mesh.vertices[3].color = item.color1();
    painter.add(egui::Shape::mesh(mesh));

    // Back button (id `back`) top-left 44x44
    let back_btn_rect = Rect::from_min_size(Pos2::new(header_rect.min.x + 8.0, header_rect.min.y + 6.0), Vec2::splat(44.0));
    let back_id = ui.make_persistent_id("back");
    let back_resp = ui.interact(back_btn_rect, back_id, Sense::click());
    painter.circle_filled(back_btn_rect.center(), 18.0, Color32::from_black_alpha(80));

    // Left chevron arrow
    let c = back_btn_rect.center();
    painter.line_segment([Pos2::new(c.x + 3.0, c.y - 6.0), Pos2::new(c.x - 3.0, c.y)], Stroke::new(2.5, Color32::WHITE));
    painter.line_segment([Pos2::new(c.x - 3.0, c.y), Pos2::new(c.x + 3.0, c.y + 6.0)], Stroke::new(2.5, Color32::WHITE));

    if back_resp.clicked() {
        back_clicked = true;
    }

    // Header Title (shrinks 32 -> 20 and moves towards app bar on scroll)
    let title_size = 32.0 - header_collapse * 12.0;
    let title_pos = Pos2::new(
        header_rect.min.x + 60.0 + header_collapse * 10.0,
        header_rect.min.y + (header_height - 30.0) * (1.0 - header_collapse) + header_collapse * 16.0,
    );
    painter.text(
        title_pos,
        egui::Align2::LEFT_TOP,
        &item.title,
        FontId::new(title_size, egui::FontFamily::Proportional),
        Color32::WHITE,
    );

    ui.add_space(24.0);

    // 2. Custom Painter Progress Ring (120 px, stroke 12, round caps)
    let ring_elapsed = (now - state.ring_start_time) as f32;
    let ring_progress = (ring_elapsed / Durations::SLOW).clamp(0.0, 1.0);
    if ring_progress < 1.0 {
        ui.ctx().request_repaint();
    }

    ui.horizontal(|ui| {
        ui.add_space((ui.available_width() - 120.0) * 0.5);
        let mut ring = ProgressRing {
            score: item.score,
            anim_progress: ring_progress,
            primary_color: tokens.primary,
            track_color: tokens.outline,
            text_color: tokens.text,
        };
        if ring.show(ui) {
            // Tap -> replay
            state.ring_start_time = now;
        }
    });

    ui.add_space(24.0);

    // 3. Shimmer Skeleton / Body Text
    render_shimmer_and_body(ui, state, item, tokens, now);
    ui.add_space(20.0);

    // 4. Expandable Panel "Details" (Accordion)
    render_accordion(ui, state, item, tokens);
    ui.add_space(24.0);

    // 5. Draggable Card with Spring Physics (240 px play area, 96 px card)
    render_spring_drag_card(ui, state, tokens, now);
    ui.add_space(24.0);

    // 6. Swipe-to-Dismiss List (3 tiles)
    render_swipe_to_dismiss(ui, state, tokens, now);
    ui.add_space(24.0);

    // 7. Buttons Row ("Show dialog", "Show sheet", "Toast")
    render_buttons_row(ui, state, tokens);
    ui.add_space(32.0);

    // Render Overlays: Dialog / Bottom Sheet / Toast
    render_overlays(ui, state, tokens, now);

    back_clicked
}

fn render_shimmer_and_body(
    ui: &mut Ui,
    state: &DetailState,
    item: &Item,
    tokens: &ColorTokens,
    now: f64,
) {
    let elapsed = (now - state.entry_time) as f32;
    let shimmer_duration = 1.5;

    if elapsed < shimmer_duration {
        ui.ctx().request_repaint();
        // Render loading shimmer block (id `shimmer`, 3 text-lines skeleton, 1.2s sweep)
        render_shimmer_skeleton(
            ui,
            ui.available_width(),
            elapsed,
            tokens.surface_alt,
            tokens.outline,
        );
    } else {
        // Cross-fade to body text over `base`
        let fade_t = ((elapsed - shimmer_duration) / Durations::BASE).clamp(0.0, 1.0);
        let alpha = (ease_base(fade_t) * 255.0) as u8;
        if fade_t < 1.0 {
            ui.ctx().request_repaint();
        }

        let mut body_color = tokens.text;
        body_color = Color32::from_rgba_premultiplied(
            (body_color.r() as u16 * alpha as u16 / 255) as u8,
            (body_color.g() as u16 * alpha as u16 / 255) as u8,
            (body_color.b() as u16 * alpha as u16 / 255) as u8,
            alpha,
        );

        ui.label(
            egui::RichText::new(&item.body)
                .font(FontId::new(16.0, egui::FontFamily::Proportional))
                .color(body_color),
        );
    }
}

fn render_accordion(ui: &mut Ui, state: &mut DetailState, item: &Item, tokens: &ColorTokens) {
    let width = ui.available_width();
    let id = ui.make_persistent_id("accordion");

    // Header bar (48 px)
    let (header_rect, _resp) = ui.allocate_exact_size(Vec2::new(width, 48.0), Sense::hover());
    let painter = ui.painter();

    painter.rect_filled(header_rect, 14.0, tokens.surface_alt);

    painter.text(
        Pos2::new(header_rect.min.x + 16.0, header_rect.center().y),
        egui::Align2::LEFT_CENTER,
        "Details",
        FontId::new(16.0, egui::FontFamily::Proportional),
        tokens.text,
    );

    // Chevron rotation over base curve
    let expand_anim = ui.ctx().animate_bool_with_time(id, state.accordion_expanded, Durations::BASE);
    let chevron_angle = expand_anim * PI; // 0 to 180 degrees

    let chevron_center = Pos2::new(header_rect.max.x - 24.0, header_rect.center().y);
    let rot = |dx: f32, dy: f32| -> Pos2 {
        let rx = dx * chevron_angle.cos() - dy * chevron_angle.sin();
        let ry = dx * chevron_angle.sin() + dy * chevron_angle.cos();
        Pos2::new(chevron_center.x + rx, chevron_center.y + ry)
    };

    painter.line_segment([rot(-5.0, -3.0), rot(0.0, 3.0)], Stroke::new(2.0, tokens.text_muted));
    painter.line_segment([rot(0.0, 3.0), rot(5.0, -3.0)], Stroke::new(2.0, tokens.text_muted));

    let header_click = ui.interact(header_rect, id, Sense::click());
    if header_click.clicked() {
        state.accordion_expanded = !state.accordion_expanded;
    }

    // Expandable content height animation
    if expand_anim > 0.01 {
        let max_content_h = 70.0;
        let content_h = expand_anim * max_content_h;
        let (content_rect, _c_resp) = ui.allocate_exact_size(Vec2::new(width, content_h), Sense::hover());

        // Content fades in last 50%
        let fade_in = ((expand_anim - 0.5) / 0.5).clamp(0.0, 1.0);
        let alpha = (fade_in * 255.0) as u8;

        if alpha > 0 {
            let mut text_col = tokens.text_muted;
            text_col = Color32::from_rgba_premultiplied(
                (text_col.r() as u16 * alpha as u16 / 255) as u8,
                (text_col.g() as u16 * alpha as u16 / 255) as u8,
                (text_col.b() as u16 * alpha as u16 / 255) as u8,
                alpha,
            );
            ui.painter().text(
                Pos2::new(content_rect.min.x + 16.0, content_rect.min.y + 12.0),
                egui::Align2::LEFT_TOP,
                &format!("Benchmark Score: {} / 100\nEngine: {}", item.score, item.subtitle),
                FontId::new(14.0, egui::FontFamily::Proportional),
                text_col,
            );
        }
    }
}

fn render_spring_drag_card(ui: &mut Ui, state: &mut DetailState, tokens: &ColorTokens, _now: f64) {
    let play_area_h = 240.0;
    let width = ui.available_width();
    let (area_rect, _resp) = ui.allocate_exact_size(Vec2::new(width, play_area_h), Sense::hover());
    let painter = ui.painter();

    // Play area dashed border
    painter.rect_filled(area_rect, Radii::CARD, tokens.surface_alt);
    painter.rect_stroke(
        area_rect,
        Radii::CARD,
        Stroke::new(1.0, tokens.outline),
        egui::StrokeKind::Outside,
    );

    let center = area_rect.center();
    let card_size = 96.0;

    // Draggable card
    let card_pos = center + state.spring_drag.pos;
    let card_rect = Rect::from_center_size(card_pos, Vec2::splat(card_size));

    let card_id = ui.make_persistent_id("drag-card");
    let card_resp = ui.interact(card_rect, card_id, Sense::drag());

    if card_resp.drag_started() {
        state.is_dragging_card = true;
        state.spring_drag.vel = Vec2::ZERO;
    }

    if card_resp.dragged() {
        state.spring_drag.pos += card_resp.drag_delta();
        // Constrain to play area
        let max_x = (area_rect.width() - card_size) * 0.5;
        let max_y = (play_area_h - card_size) * 0.5;
        state.spring_drag.pos.x = state.spring_drag.pos.x.clamp(-max_x, max_x);
        state.spring_drag.pos.y = state.spring_drag.pos.y.clamp(-max_y, max_y);
    }

    if card_resp.drag_stopped() {
        state.is_dragging_card = false;
        state.spring_drag.target = Vec2::ZERO; // springs back to center
    }

    if !state.is_dragging_card && !state.spring_drag.is_at_rest() {
        let dt = ui.input(|i| i.stable_dt);
        let moving = state.spring_drag.update(dt);
        if moving {
            ui.ctx().request_repaint();
        }
    }

    // Draw the draggable card
    let draw_card_rect = Rect::from_center_size(center + state.spring_drag.pos, Vec2::splat(card_size));
    painter.rect_filled(draw_card_rect, Radii::CARD, tokens.primary);
    painter.rect_stroke(
        draw_card_rect.expand(1.0),
        Radii::CARD,
        Stroke::new(1.0, Color32::from_black_alpha(20)),
        egui::StrokeKind::Outside,
    );

    painter.text(
        draw_card_rect.center(),
        egui::Align2::CENTER_CENTER,
        "Drag me",
        FontId::new(14.0, egui::FontFamily::Proportional),
        tokens.on_primary,
    );
}

fn render_swipe_to_dismiss(
    ui: &mut Ui,
    state: &mut DetailState,
    tokens: &ColorTokens,
    _now: f64,
) {
    let width = ui.available_width();
    let row_h = 56.0;

    ui.horizontal(|ui| {
        ui.label(
            egui::RichText::new("Swipe to dismiss")
                .font(FontId::new(14.0, egui::FontFamily::Proportional))
                .color(tokens.text_muted),
        );
        ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
            let _reset_id = ui.make_persistent_id("swipe-reset");
            if ui.button(egui::RichText::new("Reset").color(tokens.primary)).clicked() {
                for item in &mut state.swipe_items {
                    item.dismissed = false;
                    item.offset_x = 0.0;
                    item.dismiss_anim = 0.0;
                }
            }
        });
    });

    ui.add_space(8.0);

    for i in 0..state.swipe_items.len() {
        let item = &mut state.swipe_items[i];
        if item.dismiss_anim >= 1.0 && item.dismissed {
            continue; // fully collapsed
        }

        let collapse_factor = 1.0 - item.dismiss_anim;
        let drawn_h = row_h * collapse_factor;
        let (rect, _resp) = ui.allocate_exact_size(Vec2::new(width, drawn_h), Sense::hover());
        let painter = ui.painter();

        let swipe_id = ui.make_persistent_id(format!("swipe-{}", item.id));

        // Red delete background beneath
        painter.rect_filled(rect, 14.0, tokens.error);
        painter.text(
            Pos2::new(rect.min.x + 20.0, rect.center().y),
            egui::Align2::LEFT_CENTER,
            "Delete",
            FontId::new(13.0, egui::FontFamily::Proportional),
            Color32::WHITE,
        );

        // Foreground tile
        let tile_rect = rect.translate(Vec2::new(item.offset_x, 0.0));
        let tile_resp = ui.interact(tile_rect, swipe_id, Sense::drag());

        if tile_resp.dragged() {
            item.offset_x += tile_resp.drag_delta().x;
        }

        if tile_resp.drag_stopped() {
            if item.offset_x.abs() > width * 0.4 {
                // Dismiss!
                item.dismissed = true;
            } else {
                item.offset_x = 0.0; // snap back
            }
        }

        if item.dismissed {
            ui.ctx().request_repaint();
            item.dismiss_anim = (item.dismiss_anim + 0.06).min(1.0);
            item.offset_x += if item.offset_x < 0.0 { -20.0 } else { 20.0 };
        }

        painter.rect_filled(tile_rect, 14.0, tokens.surface);
        painter.rect_stroke(
            tile_rect,
            14.0,
            Stroke::new(1.0, tokens.outline),
            egui::StrokeKind::Outside,
        );

        painter.text(
            Pos2::new(tile_rect.min.x + 16.0, tile_rect.center().y),
            egui::Align2::LEFT_CENTER,
            item.title,
            FontId::new(15.0, egui::FontFamily::Proportional),
            tokens.text,
        );

        ui.add_space(6.0);
    }
}

fn render_buttons_row(ui: &mut Ui, state: &mut DetailState, tokens: &ColorTokens) {
    ui.horizontal(|ui| {
        let _btn_dialog_id = ui.make_persistent_id("btn-dialog");
        if ui.button(egui::RichText::new("Show dialog").color(tokens.on_primary)).clicked() {
            state.show_dialog = true;
        }

        let _btn_sheet_id = ui.make_persistent_id("btn-sheet");
        if ui.button(egui::RichText::new("Show sheet").color(tokens.on_primary)).clicked() {
            state.show_sheet = true;
            state.sheet_drag_y = 0.0;
        }

        let _btn_toast_id = ui.make_persistent_id("btn-toast");
        if ui.button(egui::RichText::new("Toast").color(tokens.on_primary)).clicked() {
            state.toast_message = Some("Action completed successfully!");
            state.toast_start_time = Some(ui.input(|i| i.time));
        }
    });
}

fn render_overlays(ui: &mut Ui, state: &mut DetailState, tokens: &ColorTokens, now: f64) {
    let screen_rect = ui.ctx().input(|i| i.content_rect());
    let painter = ui.painter();

    // --- Modal Dialog ---
    if state.show_dialog {
        // Scrim 40% black
        painter.rect_filled(screen_rect, 0.0, Color32::from_black_alpha(102));

        let dialog_w = 320.0;
        let dialog_h = 180.0;
        let dialog_rect = Rect::from_center_size(screen_rect.center(), Vec2::new(dialog_w, dialog_h));

        painter.rect_filled(dialog_rect, Radii::CARD, tokens.surface);
        painter.rect_stroke(dialog_rect, Radii::CARD, Stroke::new(1.0, tokens.outline), egui::StrokeKind::Outside);

        painter.text(
            Pos2::new(dialog_rect.min.x + 24.0, dialog_rect.min.y + 24.0),
            egui::Align2::LEFT_TOP,
            "Modal Dialog",
            FontId::new(20.0, egui::FontFamily::Proportional),
            tokens.text,
        );

        painter.text(
            Pos2::new(dialog_rect.min.x + 24.0, dialog_rect.min.y + 60.0),
            egui::Align2::LEFT_TOP,
            "This is a spec-compliant modal dialog with 40% scrim.",
            FontId::new(14.0, egui::FontFamily::Proportional),
            tokens.text_muted,
        );

        let ok_rect = Rect::from_min_size(
            Pos2::new(dialog_rect.max.x - 90.0, dialog_rect.max.y - 48.0),
            Vec2::new(70.0, 36.0),
        );
        let ok_resp = ui.interact(ok_rect, ui.make_persistent_id("dialog_ok"), Sense::click());
        painter.rect_filled(ok_rect, Radii::BUTTON, tokens.primary);
        painter.text(
            ok_rect.center(),
            egui::Align2::CENTER_CENTER,
            "OK",
            FontId::new(14.0, egui::FontFamily::Proportional),
            tokens.on_primary,
        );

        if ok_resp.clicked() {
            state.show_dialog = false;
        }
    }

    // --- Bottom Sheet ---
    if state.show_sheet {
        painter.rect_filled(screen_rect, 0.0, Color32::from_black_alpha(80));

        let sheet_h = 300.0;
        let sheet_w = screen_rect.width().min(480.0);
        let sheet_top = screen_rect.max.y - sheet_h + state.sheet_drag_y;
        let sheet_rect = Rect::from_min_size(
            Pos2::new((screen_rect.width() - sheet_w) * 0.5, sheet_top),
            Vec2::new(sheet_w, sheet_h),
        );

        let corner_radius = CornerRadius {
            nw: Radii::SHEET_TOP as u8,
            ne: Radii::SHEET_TOP as u8,
            sw: 0,
            se: 0,
        };
        painter.rect_filled(sheet_rect, corner_radius, tokens.surface);

        // Draggable handle
        let handle_rect = Rect::from_center_size(Pos2::new(sheet_rect.center().x, sheet_rect.min.y + 12.0), Vec2::new(40.0, 4.0));
        painter.rect_filled(handle_rect, 2.0, tokens.outline);

        let drag_handle_rect = Rect::from_center_size(handle_rect.center(), Vec2::new(sheet_w, 36.0));
        let handle_resp = ui.interact(drag_handle_rect, ui.make_persistent_id("sheet_handle"), Sense::drag());
        if handle_resp.dragged() {
            state.sheet_drag_y = (state.sheet_drag_y + handle_resp.drag_delta().y).max(0.0);
        }
        if handle_resp.drag_stopped() {
            if state.sheet_drag_y > 80.0 {
                state.show_sheet = false;
                state.sheet_drag_y = 0.0;
            } else {
                state.sheet_drag_y = 0.0;
            }
        }

        painter.text(
            Pos2::new(sheet_rect.min.x + 24.0, sheet_rect.min.y + 40.0),
            egui::Align2::LEFT_TOP,
            "Bottom Sheet",
            FontId::new(20.0, egui::FontFamily::Proportional),
            tokens.text,
        );

        painter.text(
            Pos2::new(sheet_rect.min.x + 24.0, sheet_rect.min.y + 80.0),
            egui::Align2::LEFT_TOP,
            "Drag down by the handle to dismiss.",
            FontId::new(14.0, egui::FontFamily::Proportional),
            tokens.text_muted,
        );
    }

    // --- Toast / Snackbar ---
    if let (Some(msg), Some(start_t)) = (state.toast_message, state.toast_start_time) {
        let elapsed = (now - start_t) as f32;
        let total_duration = 2.6; // 0.3s up + 2.0s stay + 0.3s down
        if elapsed < total_duration {
            ui.ctx().request_repaint();
            let slide_y = if elapsed < 0.3 {
                (1.0 - ease_base(elapsed / 0.3)) * 60.0
            } else if elapsed > 2.3 {
                ease_base((elapsed - 2.3) / 0.3) * 60.0
            } else {
                0.0
            };

            let toast_w = 320.0;
            let toast_h = 48.0;
            let toast_rect = Rect::from_center_size(
                Pos2::new(screen_rect.center().x, screen_rect.max.y - 48.0 + slide_y),
                Vec2::new(toast_w, toast_h),
            );

            painter.rect_filled(toast_rect, Radii::BUTTON, tokens.surface_alt);
            painter.rect_stroke(toast_rect, Radii::BUTTON, Stroke::new(1.0, tokens.outline), egui::StrokeKind::Outside);
            painter.text(
                toast_rect.center(),
                egui::Align2::CENTER_CENTER,
                msg,
                FontId::new(14.0, egui::FontFamily::Proportional),
                tokens.text,
            );
        } else {
            state.toast_message = None;
            state.toast_start_time = None;
        }
    }
}
