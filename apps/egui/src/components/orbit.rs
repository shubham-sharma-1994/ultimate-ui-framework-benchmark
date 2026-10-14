use egui::{Color32, Pos2, Rect, Stroke, Ui, Vec2};
use std::f32::consts::PI;

pub fn render_orbit(ui: &mut Ui, center: Pos2, elapsed_sec: f32) {
    let painter = ui.painter();
    let ring_radius = 40.0;
    let dot_radius = 6.0;
    let revolution_period = 3.0; // 3 seconds per revolution

    // Ring stroke
    let ring_stroke = Stroke::new(1.5, Color32::from_white_alpha(100));
    painter.circle_stroke(center, ring_radius, ring_stroke);

    // 3 circling dots
    let base_angle = (elapsed_sec % revolution_period) / revolution_period * 2.0 * PI;
    for i in 0..3 {
        let angle = base_angle + (i as f32) * (2.0 * PI / 3.0);
        let dot_pos = Pos2::new(
            center.x + ring_radius * angle.cos(),
            center.y + ring_radius * angle.sin(),
        );
        painter.circle_filled(dot_pos, dot_radius, Color32::WHITE);
    }
}

pub fn render_hero_card(
    ui: &mut Ui,
    width: f32,
    elapsed_sec: f32,
    primary: Color32,
    accent: Color32,
) {
    let height = 180.0;
    let (rect, _response) = ui.allocate_exact_size(Vec2::new(width, height), egui::Sense::hover());
    let painter = ui.painter();

    // 135-degree linear gradient background
    // Create gradient mesh across rectangle
    let mut mesh = egui::Mesh::default();
    mesh.add_rect_with_uv(
        rect,
        Rect::from_min_max(Pos2::ZERO, Pos2::new(1.0, 1.0)),
        Color32::WHITE,
    );

    // Color vertices: top-left (primary) -> bottom-right (accent)
    mesh.vertices[0].color = primary; // top-left
    mesh.vertices[1].color = crate::theme::lerp_color(primary, accent, 0.5); // top-right
    mesh.vertices[2].color = accent; // bottom-right
    mesh.vertices[3].color = crate::theme::lerp_color(primary, accent, 0.5); // bottom-left

    painter.add(egui::Shape::mesh(mesh));

    // Title text: "Same app. Every framework."
    let text_pos = Pos2::new(rect.min.x + 20.0, rect.min.y + 36.0);
    painter.text(
        text_pos,
        egui::Align2::LEFT_TOP,
        "Same app.\nEvery framework.",
        egui::FontId::new(22.0, egui::FontFamily::Proportional),
        Color32::WHITE,
    );

    // Custom-painted Orbit on the right side
    let orbit_center = Pos2::new(rect.max.x - 72.0, rect.center().y);
    render_orbit(ui, orbit_center, elapsed_sec);
}
