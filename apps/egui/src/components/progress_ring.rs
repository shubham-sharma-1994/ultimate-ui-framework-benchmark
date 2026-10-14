use egui::{Color32, Pos2, Sense, Stroke, Ui, Vec2};
use std::f32::consts::PI;
use crate::motion::ease_slow;

pub struct ProgressRing {
    pub score: i32,
    pub anim_progress: f32, // 0.0 to 1.0
    pub primary_color: Color32,
    pub track_color: Color32,
    pub text_color: Color32,
}

impl ProgressRing {
    pub fn show(&mut self, ui: &mut Ui) -> bool {
        let size = 120.0;
        let stroke_width = 12.0;
        let radius = (size - stroke_width) / 2.0;

        let (rect, response) = ui.allocate_exact_size(Vec2::splat(size), Sense::click());
        let clicked = response.clicked();
        let painter = ui.painter();
        let center = rect.center();

        // Background track circle
        painter.circle_stroke(
            center,
            radius,
            Stroke::new(stroke_width, self.track_color),
        );

        // Animated progress arc
        let eased_t = ease_slow(self.anim_progress);
        let current_score = (self.score as f32 * eased_t).round() as i32;
        let fraction = (current_score as f32) / 100.0;

        if fraction > 0.005 {
            let start_angle = -PI / 2.0;
            let sweep_angle = 2.0 * PI * fraction.min(1.0);
            let segments = ((sweep_angle * 30.0).ceil() as usize).max(4);

            let mut points = Vec::with_capacity(segments + 1);
            for i in 0..=segments {
                let angle = start_angle + (i as f32 / segments as f32) * sweep_angle;
                points.push(Pos2::new(
                    center.x + radius * angle.cos(),
                    center.y + radius * angle.sin(),
                ));
            }

            for window in points.windows(2) {
                painter.line_segment([window[0], window[1]], Stroke::new(stroke_width, self.primary_color));
            }

            // Round caps at start and end
            if let Some(&first) = points.first() {
                painter.circle_filled(first, stroke_width / 2.0, self.primary_color);
            }
            if let Some(&last) = points.last() {
                painter.circle_filled(last, stroke_width / 2.0, self.primary_color);
            }
        }

        // Center percentage text counting up
        let text = format!("{}%", current_score);
        painter.text(
            center,
            egui::Align2::CENTER_CENTER,
            text,
            egui::FontId::new(24.0, egui::FontFamily::Proportional),
            self.text_color,
        );

        clicked
    }
}
