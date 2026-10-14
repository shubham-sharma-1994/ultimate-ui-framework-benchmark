#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(not(target_arch = "wasm32"))]
fn main() -> eframe::Result {
    let native_options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_inner_size([480.0, 900.0])
            .with_min_inner_size([360.0, 640.0])
            .with_title("Pulse egui"),
        ..Default::default()
    };

    eframe::run_native(
        "Pulse egui",
        native_options,
        Box::new(|cc| Ok(Box::new(pulse_egui::PulseApp::new(cc)))),
    )
}

#[cfg(target_arch = "wasm32")]
fn main() {
    // On wasm32, trunk / wasm-bindgen uses the library entrypoint
}
