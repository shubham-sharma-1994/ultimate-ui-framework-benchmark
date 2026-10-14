use egui::{Color32, Pos2, Rect, Stroke, Ui, Vec2};
use crate::theme::{lerp_color, Durations, Radii};

pub struct FloatingInput<'a> {
    pub label: &'a str,
    pub text: &'a mut String,
    pub outline_color: Color32,
    pub primary_color: Color32,
    pub surface_color: Color32,
    pub text_color: Color32,
    pub text_muted: Color32,
}

impl<'a> FloatingInput<'a> {
    pub fn show(self, ui: &mut Ui) -> bool {
        let height = 56.0;
        let width = ui.available_width();
        let (rect, _response) = ui.allocate_exact_size(Vec2::new(width, height), egui::Sense::hover());

        let id = ui.make_persistent_id("floating_name_input");
        let has_text = !self.text.is_empty();

        // Check if focused
        let edit_id = id.with("text_edit");
        let is_focused = ui.memory(|mem| mem.has_focus(edit_id));

        // Animate floating progress: 0.0 (idle empty) -> 1.0 (focused or non-empty)
        let target_float = if is_focused || has_text { 1.0 } else { 0.0 };
        let float_anim = ui.ctx().animate_value_with_time(id.with("float"), target_float, Durations::FAST);

        // Animate border focus: 0.0 (idle) -> 1.0 (focused)
        let border_anim = ui.ctx().animate_value_with_time(id.with("border"), if is_focused { 1.0 } else { 0.0 }, Durations::FAST);

        let painter = ui.painter();

        // Draw background
        painter.rect_filled(rect, Radii::INPUT, self.surface_color);

        // Draw animated border
        let stroke_color = lerp_color(self.outline_color, self.primary_color, border_anim);
        let stroke_width = 1.0 + border_anim * 1.0; // 1px -> 2px
        painter.rect_stroke(rect, Radii::INPUT, Stroke::new(stroke_width, stroke_color), egui::StrokeKind::Outside);

        // Animated label position and size
        let label_color = lerp_color(self.text_muted, self.primary_color, border_anim);
        let label_y = rect.min.y + 18.0 - float_anim * 10.0;
        let label_size = 14.0 - float_anim * 3.0; // 14 -> 11
        painter.text(
            Pos2::new(rect.min.x + 14.0, label_y),
            egui::Align2::LEFT_CENTER,
            self.label,
            egui::FontId::new(label_size, egui::FontFamily::Proportional),
            label_color,
        );

        // Put TextEdit widget inside the lower portion of the box
        let edit_rect = Rect::from_min_max(
            Pos2::new(rect.min.x + 14.0, rect.min.y + 20.0),
            Pos2::new(rect.max.x - 14.0, rect.max.y - 6.0),
        );

        let mut child_ui = ui.new_child(egui::UiBuilder::new().max_rect(edit_rect));
        let edit_response = egui::TextEdit::singleline(self.text)
            .id(edit_id)
            .font(egui::FontId::new(16.0, egui::FontFamily::Proportional))
            .text_color(self.text_color)
            .frame(egui::Frame::NONE)
            .show(&mut child_ui);

        edit_response.response.changed()
    }
}
