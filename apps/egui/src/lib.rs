use egui::{
    Align2, Color32, FontId, Pos2, Rect, ScrollArea, Sense, Stroke, Ui, Vec2,
};

pub mod components;
pub mod data;
pub mod motion;
pub mod pages;
pub mod theme;

use data::Dataset;
use pages::detail::{render_detail, DetailState};
use pages::showcase::{render_showcase, ShowcaseState};
use theme::{configure_fonts, ColorTokens, Durations, DARK_TOKENS, LIGHT_TOKENS};

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum ActiveUiInterface {
    PulseShowcase,
    PulseDetail,
    EguiDemoWindows,
    EguiColorTest,
    EguiSettings,
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Page {
    Showcase,
    Detail(i32),
}

pub struct PulseApp {
    dataset: Dataset,
    current_page: Page,
    prev_page: Option<Page>,
    page_transition_start: Option<f64>,
    is_navigating_back: bool,

    // Theme state
    is_dark_theme: bool,
    theme_switch_time: Option<f64>,
    current_tokens: ColorTokens,

    // Page states
    showcase_state: ShowcaseState,
    detail_state: DetailState,

    // Scroll offset for app bar elevation
    scroll_offset_y: f32,

    // Android extra navbar / UI interface selection
    active_interface: ActiveUiInterface,
    navbar_open: bool,
    egui_demo: egui_demo_lib::DemoWindows,
    egui_color_test: egui_demo_lib::ColorTest,
}

impl PulseApp {
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        configure_fonts(&cc.egui_ctx);

        Self {
            dataset: Dataset::load(),
            current_page: Page::Showcase,
            prev_page: None,
            page_transition_start: None,
            is_navigating_back: false,

            is_dark_theme: false,
            theme_switch_time: None,
            current_tokens: LIGHT_TOKENS,

            showcase_state: ShowcaseState::default(),
            detail_state: DetailState::default(),

            scroll_offset_y: 0.0,

            active_interface: ActiveUiInterface::PulseShowcase,
            navbar_open: cfg!(target_os = "android"),
            egui_demo: egui_demo_lib::DemoWindows::default(),
            egui_color_test: egui_demo_lib::ColorTest::default(),
        }
    }

    fn update_theme_interpolation(&mut self, now: f64) {
        if let Some(switch_start) = self.theme_switch_time {
            let elapsed = (now - switch_start) as f32;
            let progress = (elapsed / Durations::SLOW).clamp(0.0, 1.0);
            let from_tokens = if self.is_dark_theme { &LIGHT_TOKENS } else { &DARK_TOKENS };
            let to_tokens = if self.is_dark_theme { &DARK_TOKENS } else { &LIGHT_TOKENS };

            self.current_tokens = from_tokens.interpolated(to_tokens, progress);

            if progress >= 1.0 {
                self.theme_switch_time = None;
                self.current_tokens = *to_tokens;
            }
        } else {
            self.current_tokens = if self.is_dark_theme { DARK_TOKENS } else { LIGHT_TOKENS };
        }
    }

    fn render_app_bar(&mut self, ui: &mut Ui, now: f64) {
        let app_bar_height = 56.0;
        let width = ui.available_width();
        let (rect, _resp) = ui.allocate_exact_size(Vec2::new(width, app_bar_height), Sense::hover());
        let painter = ui.painter();

        // Background
        painter.rect_filled(rect, 0.0, self.current_tokens.surface);

        // e1 shadow on scroll: fades in over fast once scroll offset > 0
        let has_scroll = self.scroll_offset_y > 1.0;
        let shadow_anim = ui.ctx().animate_bool_with_time(
            ui.make_persistent_id("app_bar_shadow"),
            has_scroll,
            Durations::FAST,
        );
        if shadow_anim > 0.01 {
            let shadow_color = Color32::from_black_alpha((shadow_anim * 25.0) as u8);
            painter.line_segment(
                [Pos2::new(rect.min.x, rect.max.y), Pos2::new(rect.max.x, rect.max.y)],
                Stroke::new(1.0, shadow_color),
            );
        }

        // Left button: menu / drawer button (especially for Android / UI interfaces)
        let menu_rect = Rect::from_min_size(Pos2::new(rect.min.x + 8.0, rect.min.y + 6.0), Vec2::splat(44.0));
        let menu_id = ui.make_persistent_id("nav_menu_toggle");
        let menu_resp = ui.interact(menu_rect, menu_id, Sense::click());
        if menu_resp.clicked() {
            self.navbar_open = !self.navbar_open;
        }

        // Hamburger icon
        let mc = menu_rect.center();
        for dy in [-6.0, 0.0, 6.0] {
            painter.line_segment(
                [Pos2::new(mc.x - 9.0, mc.y + dy), Pos2::new(mc.x + 9.0, mc.y + dy)],
                Stroke::new(2.0, self.current_tokens.text),
            );
        }

        // App Title "Pulse"
        painter.text(
            Pos2::new(rect.min.x + 60.0, rect.center().y),
            Align2::LEFT_CENTER,
            "Pulse",
            FontId::new(22.0, egui::FontFamily::Proportional),
            self.current_tokens.text,
        );

        // Theme Toggle (id `theme-toggle`): icon button ☀/🌙
        let toggle_rect = Rect::from_min_size(Pos2::new(rect.max.x - 52.0, rect.min.y + 6.0), Vec2::splat(44.0));
        let toggle_id = ui.make_persistent_id("theme-toggle");
        let toggle_resp = ui.interact(toggle_rect, toggle_id, Sense::click());

        if toggle_resp.clicked() {
            self.is_dark_theme = !self.is_dark_theme;
            self.theme_switch_time = Some(now);
        }

        let _icon_rot = ui.ctx().animate_bool_with_time(toggle_id, self.is_dark_theme, Durations::SLOW);
        let center = toggle_rect.center();

        let icon = if self.is_dark_theme { "🌙" } else { "☀" };
        painter.text(
            center,
            Align2::CENTER_CENTER,
            icon,
            FontId::new(20.0, egui::FontFamily::Proportional),
            self.current_tokens.primary,
        );
    }

    fn render_android_navbar(&mut self, ui: &mut Ui) {
        ui.vertical(|ui| {
            ui.add_space(8.0);
            ui.heading(egui::RichText::new("UI Interfaces").color(self.current_tokens.primary));
            ui.add_space(4.0);
            ui.label(
                egui::RichText::new("Select interface to spawn:")
                    .font(FontId::new(12.0, egui::FontFamily::Proportional))
                    .color(self.current_tokens.text_muted),
            );
            ui.add_space(12.0);

            let buttons = [
                (ActiveUiInterface::PulseShowcase, "📱 Pulse Showcase"),
                (ActiveUiInterface::PulseDetail, "🔍 Pulse Detail"),
                (ActiveUiInterface::EguiDemoWindows, "🪟 egui Demo Windows"),
                (ActiveUiInterface::EguiColorTest, "🎨 egui Color Test"),
                (ActiveUiInterface::EguiSettings, "⚙️ egui Settings"),
            ];

            for (interface, label) in buttons {
                let is_active = self.active_interface == interface;
                let btn_text = egui::RichText::new(label)
                    .font(FontId::new(14.0, egui::FontFamily::Proportional))
                    .color(if is_active { self.current_tokens.on_primary } else { self.current_tokens.text });

                let btn = if is_active {
                    egui::Button::new(btn_text).fill(self.current_tokens.primary)
                } else {
                    egui::Button::new(btn_text).fill(self.current_tokens.surface_alt)
                };

                if ui.add_sized(Vec2::new(ui.available_width(), 38.0), btn).clicked() {
                    self.active_interface = interface;
                    match interface {
                        ActiveUiInterface::PulseShowcase => self.current_page = Page::Showcase,
                        ActiveUiInterface::PulseDetail => {
                            if !matches!(self.current_page, Page::Detail(_)) {
                                self.current_page = Page::Detail(1);
                            }
                        }
                        _ => {}
                    }
                    if cfg!(target_os = "android") {
                        self.navbar_open = false; // close drawer on selection for mobile
                    }
                }
                ui.add_space(6.0);
            }

            ui.add_space(16.0);
            ui.separator();
            ui.add_space(8.0);
            ui.label(
                egui::RichText::new("Pulse egui Benchmark\nAndroid + Windows + Web")
                    .font(FontId::new(11.0, egui::FontFamily::Proportional))
                    .color(self.current_tokens.text_muted),
            );
        });
    }
}

impl eframe::App for PulseApp {
    fn ui(&mut self, ui: &mut egui::Ui, _frame: &mut eframe::Frame) {
        let now = ui.ctx().input(|i| i.time);
        self.update_theme_interpolation(now);

        // Continuous redraw request when animations are running
        if self.theme_switch_time.is_some() || self.page_transition_start.is_some() {
            ui.ctx().request_repaint();
        }

        // Draw side panel navbar if opened
        if self.navbar_open {
            egui::Panel::left("android_nav_panel")
                .frame(egui::Frame::NONE.fill(self.current_tokens.surface).inner_margin(12.0))
                .show(ui, |ui| {
                    self.render_android_navbar(ui);
                });
        }

        // Handle additional egui demo interfaces if selected
        match self.active_interface {
            ActiveUiInterface::EguiDemoWindows => {
                self.egui_demo.ui(ui);
            }
            ActiveUiInterface::EguiColorTest => {
                egui::Window::new("Color Test")
                    .open(&mut true)
                    .show(ui.ctx(), |ui| {
                        self.egui_color_test.ui(ui);
                    });
            }
            ActiveUiInterface::EguiSettings => {
                egui::Window::new("Settings & Style")
                    .open(&mut true)
                    .show(ui.ctx(), |ui| {
                        ui.ctx().clone().settings_ui(ui);
                    });
            }
            _ => {}
        }

        // Central Panel for Benchmark App
        egui::CentralPanel::default()
            .frame(egui::Frame::NONE.fill(self.current_tokens.background))
            .show(ui, |ui| {
                // Single column max-width 480 horizontally centered
                let max_w = 480.0;
                let avail_w = ui.available_width();
                let margin_x = ((avail_w - max_w) * 0.5).max(0.0);

                let column_rect = Rect::from_min_max(
                    Pos2::new(ui.min_rect().min.x + margin_x, ui.min_rect().min.y),
                    Pos2::new(ui.min_rect().max.x - margin_x, ui.min_rect().max.y),
                );

                let mut child_ui = ui.new_child(egui::UiBuilder::new().max_rect(column_rect));

                // App Bar
                self.render_app_bar(&mut child_ui, now);

                // Body scroll area
                ScrollArea::vertical()
                    .auto_shrink([false; 2])
                    .show(&mut child_ui, |scroll_ui| {
                        scroll_ui.add_space(16.0);
                        self.scroll_offset_y = scroll_ui.clip_rect().top();

                        match self.current_page {
                            Page::Showcase => {
                                let items = self.dataset.items.clone();
                                if let Some(selected_id) = render_showcase(
                                    scroll_ui,
                                    &mut self.showcase_state,
                                    &items,
                                    &self.current_tokens,
                                    now,
                                ) {
                                    self.prev_page = Some(Page::Showcase);
                                    self.current_page = Page::Detail(selected_id);
                                    self.page_transition_start = Some(now);
                                    self.is_navigating_back = false;
                                    self.detail_state = DetailState::default();
                                }
                            }
                            Page::Detail(id) => {
                                let item = self
                                    .dataset
                                    .items
                                    .iter()
                                    .find(|i| i.id == id)
                                    .cloned()
                                    .unwrap_or_else(|| self.dataset.items[0].clone());

                                let back_clicked = render_detail(
                                    scroll_ui,
                                    &mut self.detail_state,
                                    &item,
                                    &self.current_tokens,
                                    now,
                                    self.scroll_offset_y,
                                );

                                if back_clicked {
                                    self.prev_page = Some(Page::Detail(id));
                                    self.current_page = Page::Showcase;
                                    self.page_transition_start = Some(now);
                                    self.is_navigating_back = true;
                                }
                            }
                        }
                    });
            });
    }
}

// Android Entrypoint
#[cfg(target_os = "android")]
#[unsafe(no_mangle)]
fn android_main(app: winit::platform::android::activity::AndroidApp) {
    android_logger::init_once(
        android_logger::Config::default().with_max_level(log::LevelFilter::Info),
    );

    let options = eframe::NativeOptions {
        android_app: Some(app),
        ..Default::default()
    };
    eframe::run_native(
        "Pulse egui",
        options,
        Box::new(|cc| Ok(Box::new(PulseApp::new(cc)))),
    )
    .unwrap();
}

// Web Entrypoint
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub struct WebHandle {
    runner: eframe::WebRunner,
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
impl WebHandle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            runner: eframe::WebRunner::new(),
        }
    }

    #[wasm_bindgen]
    pub async fn start(&self, canvas: web_sys::HtmlCanvasElement) -> Result<(), JsValue> {
        self.runner
            .start(
                canvas,
                eframe::WebOptions::default(),
                Box::new(|cc| Ok(Box::new(PulseApp::new(cc)))),
            )
            .await
    }
}
