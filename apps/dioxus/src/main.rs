#![allow(non_snake_case)]
use dioxus::document::eval;
use dioxus::prelude::*;
use std::time::Duration;

mod data;
use data::load_data;

#[cfg(target_arch = "wasm32")]
async fn sleep_ms(ms: u64) {
    gloo_timers::future::sleep(std::time::Duration::from_millis(ms)).await;
}

#[cfg(not(target_arch = "wasm32"))]
async fn sleep_ms(ms: u64) {
    tokio::time::sleep(std::time::Duration::from_millis(ms)).await;
}

#[derive(Clone, Routable, Debug, PartialEq)]
enum Route {
    #[route("/")]
    Home {},
    #[route("/detail/:id")]
    Detail { id: usize },
}

const ORBIT_SVG: &str = r##"
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF7A59" />
      <stop offset="100%" stop-color="#6750A4" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#grad)" stroke-width="2" stroke-dasharray="10 5" />
  <circle cx="50" cy="5" r="4" fill="#FF7A59" />
  <circle cx="5" cy="50" r="3" fill="#6750A4" />
</svg>
"##;

fn main() {
    launch(App);
}

#[component]
fn App() -> Element {
    let theme = use_signal(|| "light".to_string());

    // Manage document theme class
    use_effect(move || {
        let t = theme();
        // Since dx handles html via eval in web, we inject global theme via standard JS script
        let eval_str = format!(
            "document.documentElement.setAttribute('data-theme', '{}')",
            t
        );
        let _ = eval(&eval_str);
    });

    // Provide data as global context
    use_context_provider(|| load_data());
    use_context_provider(|| theme);

    rsx! {
        document::Link { rel: "stylesheet", href: "/assets/index.css" }
        Router::<Route> {}
    }
}

#[component]
fn Home() -> Element {
    let items = use_context::<Vec<data::Item>>();
    let mut theme = use_context::<Signal<String>>();
    let mut counter = use_signal(|| 0);
    let mut showing_dialog = use_signal(|| false);
    let mut showing_sheet = use_signal(|| false);
    let mut showing_toast = use_signal(|| false);
    let mut is_loading = use_signal(|| true);

    let mut drag_offset_x = use_signal(|| 0.0);
    let mut drag_offset_y = use_signal(|| 0.0);
    let mut is_dragging = use_signal(|| false);

    let mut swipe_dismissed = use_signal(|| vec![false, false, false]);

    // Simulated network load
    use_effect(move || {
        spawn(async move {
            sleep_ms(1500).await;
            is_loading.set(false);
        });
    });

    // Toggle theme
    let toggle_theme = move |_| {
        let current = theme();
        theme.set(if current == "light" {
            "dark".to_string()
        } else {
            "light".to_string()
        });
    };

    let show_toast = move |_| {
        showing_toast.set(true);
        spawn(async move {
            sleep_ms(2000).await;
            showing_toast.set(false);
        });
    };

    rsx! {
        div { class: "page fade-in", id: "page-home",
            // App Bar
            div { class: "app-bar e1", id: "header",
                div { class: "title", "Pulse" }
                button {
                    class: "icon-btn",
                    id: "theme-toggle",
                    onclick: toggle_theme,
                    "☾" // Note: rotating logic handled by standard transition
                }
            }

            // Hero Card
            div { class: "hero-card e2", id: "hero",
                div { class: "orbit-svg", dangerous_inner_html: ORBIT_SVG }
                div { class: "display title", "Welcome" }
            }

            // Counter Row
            div { class: "counter-row",
                div { class: "counter-label",
                    span { class: "title", "Counter" }
                    span { class: "caption", "Tap to increment" }
                }
                div {
                    class: "title",
                    id: "counter-val",
                    style: "font-variant-numeric: tabular-nums; position: relative; overflow: hidden; height: 32px; display: inline-flex; align-items: center;",
                    span {
                        style: "transition: transform 300ms cubic-bezier(0.65, 0, 0.35, 1);",
                        // Force DOM recreation to trigger transition
                        key: "{counter}",
                        "{counter}"
                    }
                }
                button {
                    class: "fab e2",
                    id: "btn-counter",
                    onclick: move |_| {
                        counter += 1;
                        // Shake animation logic
                        spawn(async move {
                            let _ = eval("
                                let btn = document.getElementById('btn-counter');
                                btn.classList.add('shake');
                                setTimeout(() => btn.classList.remove('shake'), 300);
                            ");
                        });
                    },
                    "+"
                }
            }

            // Controls Card
            div { class: "controls-card e1",
                div { class: "control-row",
                    span { class: "body", "Enable feature" }
                    label { class: "switch", id: "switch",
                        input { "type": "checkbox" }
                        span { class: "slider-toggle" }
                    }
                }
                div { class: "chip-row",
                    button { class: "chip selected", id: "chip-1", "Option 1" }
                    button { class: "chip", id: "chip-2", "Option 2" }
                }
                div { class: "input-container",
                    input { id: "text-input", "type": "text", placeholder: " " }
                    label { class: "input-label", "Enter text" }
                }
                div {
                    id: "shimmer",
                    if is_loading() {
                        div { class: "shimmer-block", style: "height: 60px; border-radius: 8px;" } // Approximated shimmer
                    } else {
                        div { class: "body fade-in", "Content loaded successfully." }
                    }
                }
            }

            // Draggable Card
            div {
                id: "drag-area",
                style: "width: 240px; height: 240px; border: 2px dashed var(--outline); position: relative; border-radius: 16px; margin: 0 auto; overflow: hidden;",
                div {
                    id: "drag-card",
                    class: "e2",
                    style: format!("width: 96px; height: 96px; background-color: var(--primary); border-radius: 16px; position: absolute; left: 72px; top: 72px; transform: translate({}px, {}px); transition: {}", drag_offset_x(), drag_offset_y(), if is_dragging() { "none" } else { "transform 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)" }),
                    onpointerdown: move |_| is_dragging.set(true),
                    onpointermove: move |e| {
                        if is_dragging() {
                            // Rough pointer delta logic approximation
                            // Note: real implementation needs document level listeners or pointer capture
                            drag_offset_x.set(e.page_coordinates().x - 48.0);
                            drag_offset_y.set(e.page_coordinates().y - 48.0);
                        }
                    },
                    onpointerup: move |_| {
                        is_dragging.set(false);
                        drag_offset_x.set(0.0);
                        drag_offset_y.set(0.0);
                    },
                    onpointerleave: move |_| {
                         if is_dragging() {
                            is_dragging.set(false);
                            drag_offset_x.set(0.0);
                            drag_offset_y.set(0.0);
                         }
                    }
                }
            }

            // Buttons Row
            div { class: "counter-row",
                button { class: "chip", id: "btn-dialog", onclick: move |_| showing_dialog.set(true), "Dialog" }
                button { class: "chip", id: "btn-sheet", onclick: move |_| showing_sheet.set(true), "Sheet" }
                button { class: "chip", id: "btn-toast", onclick: show_toast, "Toast" }
            }

            // Swipe List
            div { class: "swipe-list",
                for (idx, item) in items.iter().take(3).enumerate() {
                    div {
                        class: format!("swipe-item-container {}", if swipe_dismissed()[idx] { "dismissed" } else { "" }),
                        id: format!("swipe-{}", idx + 1),
                        div { class: "swipe-bg", "Delete" }
                        div { class: "swipe-item",
                            div { class: "title", "{item.title}" }
                            div { class: "caption", "Swipe to dismiss" }
                        }
                    }
                }
                button {
                    class: "chip",
                    id: "swipe-reset",
                    onclick: move |_| swipe_dismissed.set(vec![false, false, false]),
                    "Reset List"
                }
            }

            // Staggered List
            div {
                class: "swipe-list",
                for (idx, item) in items.iter().enumerate() {
                    Link {
                        to: Route::Detail { id: item.id },
                        class: "list-item stagger-item",
                        style: format!("animation-delay: {}ms", idx * 50),
                        id: format!("list-item-{}", item.id),
                        div {
                            class: "item-thumb",
                            style: format!("background-color: {}", item.colors[0]),
                        }
                        div { class: "item-content",
                            div { class: "title", "{item.title}" }
                            div { class: "caption", "{item.subtitle}" }
                        }
                    }
                }
            }
        }

        // Modal Overlays
        if showing_dialog() {
            div {
                class: "sheet-overlay open",
                onclick: move |_| showing_dialog.set(false),
                div {
                    style: "margin: auto;",
                    onclick: move |e| e.stop_propagation(),
                    dialog {
                        open: true,
                        div { class: "dialog-content",
                            div { class: "title", "Dialog Title" }
                            div { class: "body", "This is a simple dialog." }
                            div { class: "dialog-actions",
                                button { class: "btn-text", onclick: move |_| showing_dialog.set(false), "Close" }
                            }
                        }
                    }
                }
            }
        }

        if showing_sheet() {
            div {
                class: "sheet-overlay open",
                onclick: move |_| showing_sheet.set(false),
                div {
                    class: "sheet-content",
                    onclick: move |e| e.stop_propagation(),
                    div { class: "sheet-handle" }
                    div { class: "title", "Bottom Sheet" }
                    div { class: "body", style: "margin-top: 16px", "Swipe down to dismiss" }
                }
            }
        }

        div {
            class: format!("toast-container {}", if showing_toast() { "show" } else { "" }),
            "Action completed"
        }
    }
}

#[component]
fn Detail(id: usize) -> Element {
    let items = use_context::<Vec<data::Item>>();
    let item = items
        .iter()
        .find(|i| i.id == id)
        .cloned()
        .unwrap_or_else(|| items[0].clone());
    let mut is_expanded = use_signal(|| false);

    // Parallax logic injected via eval
    use_effect(move || {
        let _ = eval(
            r#"
            const container = document.getElementById('page-detail');
            const hero = document.getElementById('detail-hero');
            if (container && hero) {
                container.addEventListener('scroll', () => {
                    const scrollY = container.scrollTop;
                    hero.style.transform = `translateY(${scrollY * 0.5}px)`;
                });
            }
        "#,
        );
    });

    rsx! {
        div { class: "page fade-in", style: "padding: 0; overflow-y: auto; height: 100vh;", id: "page-detail",
            div {
                class: "e2",
                style: format!("height: 300px; background-color: {}; position: relative; border-radius: 0 0 24px 24px; z-index: -1;", item.colors[0]),
                id: "detail-hero",
                Link {
                    to: Route::Home {},
                    class: "icon-btn e2",
                    id: "btn-back",
                    style: "position: absolute; top: 16px; left: 16px; background-color: var(--surface); z-index: 10;",
                    "←"
                }
            }
            div { style: "padding: 24px; background-color: var(--background); position: relative; z-index: 1;",
                div { class: "display", id: "detail-title", "{item.title}" }
                div { class: "title", style: "color: var(--textMuted)", "{item.subtitle}" }

                div { style: "margin-top: 24px; position: relative;", id: "progress-ring",
                    svg { width: "100", height: "100", view_box: "0 0 100 100",
                        circle { cx: "50", cy: "50", r: "40", fill: "none", stroke: "var(--outline)", stroke_width: "8" }
                        circle {
                            cx: "50", cy: "50", r: "40", fill: "none", stroke: "var(--success)", stroke_width: "8",
                            stroke_dasharray: "251.2",
                            stroke_dashoffset: format!("{}", 251.2 - (251.2 * item.score as f32 / 100.0)),
                            style: "transition: stroke-dashoffset 1s ease-out; transform: rotate(-90deg); transform-origin: 50% 50%;"
                        }
                    }
                    div {
                        class: "title",
                        style: "position: absolute; top: 50%; left: 50px; transform: translate(-50%, -50%);",
                        "{item.score}"
                    }
                }

                div {
                    class: "controls-card e1", style: "margin-top: 24px;", id: "accordion",
                    div {
                        class: "control-row",
                        style: "cursor: pointer;",
                        onclick: move |_| is_expanded.set(!is_expanded()),
                        span { class: "title", "Details" }
                        span { style: format!("transition: transform 300ms; transform: rotate({}deg);", if is_expanded() { "180" } else { "0" }), "▼" }
                    }
                    if is_expanded() {
                        div { class: "body fade-in", style: "margin-top: 16px;", "{item.body}" }
                    }
                }

                // Add some dummy content for scrolling
                div { style: "height: 600px; margin-top: 24px;" }
            }
        }
    }
}
