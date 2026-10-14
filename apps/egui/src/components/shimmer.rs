use egui::{Color32, Pos2, Rect, Ui, Vec2};
use crate::theme::lerp_color;

pub fn render_shimmer_skeleton(
    ui: &mut Ui,
    width: f32,
    elapsed_sec: f32,
    base_color: Color32,
    highlight_color: Color32,
) {
    let sweep_period = 1.2; // 1.2s sweep loop
    let progress = (elapsed_sec % sweep_period) / sweep_period; // 0.0 to 1.0

    let line_heights = [16.0, 16.0, 16.0];
    let line_widths = [width * 0.95, width * 0.85, width * 0.60];
    let gap = 12.0;

    let mut bar_rects = Vec::with_capacity(3);
    for (&h, &w) in line_heights.iter().zip(line_widths.iter()) {
        let (rect, _resp) = ui.allocate_exact_size(Vec2::new(width, h), egui::Sense::hover());
        bar_rects.push(Rect::from_min_size(rect.min, Vec2::new(w, h)));
        ui.add_space(gap);
    }

    let painter = ui.painter();
    for bar_rect in bar_rects {
        let w = bar_rect.width();
        let segments = 24;
        let seg_w = w / segments as f32;
        let highlight_center = progress * (w + 100.0) - 50.0;
        let highlight_width = 80.0;

        for s in 0..segments {
            let seg_min_x = bar_rect.min.x + s as f32 * seg_w;
            let seg_max_x = seg_min_x + seg_w;
            let seg_center_x = (seg_min_x + seg_max_x) * 0.5 - bar_rect.min.x;

            let dist = (seg_center_x - highlight_center).abs();
            let intensity = (1.0 - (dist / highlight_width)).clamp(0.0, 1.0);
            let color = lerp_color(base_color, highlight_color, intensity);

            let seg_rect = Rect::from_min_max(
                Pos2::new(seg_min_x, bar_rect.min.y),
                Pos2::new(seg_max_x, bar_rect.max.y),
            );
            painter.rect_filled(seg_rect, 4.0, color);
        }
    }
}
