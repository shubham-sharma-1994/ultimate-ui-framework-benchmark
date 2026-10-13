//! Headless render of the app with Slint's software renderer; prints a coarse picture.
//! `cargo run --release --example snapshot`
use slint::platform::software_renderer::{MinimalSoftwareWindow, RepaintBufferType};
use slint::platform::{Platform, WindowAdapter};
use slint::{ComponentHandle, PhysicalSize, Rgb8Pixel};
use std::collections::HashMap;
use std::rc::Rc;

struct P(Rc<MinimalSoftwareWindow>);
impl Platform for P {
    fn create_window_adapter(&self) -> Result<Rc<dyn WindowAdapter>, slint::PlatformError> {
        Ok(self.0.clone())
    }
}

fn main() {
    let (w, h) = (390u32, 844u32);
    let window = MinimalSoftwareWindow::new(RepaintBufferType::NewBuffer);
    slint::platform::set_platform(Box::new(P(window.clone()))).unwrap();
    let app = pulse_slint::build_app();
    if std::env::var("PAGE").as_deref() == Ok("2") {
        use slint::Model;
        app.set_selected_item(app.get_items().row_data(0).unwrap());
        app.set_current_page(2);
    }
    window.set_size(PhysicalSize::new(w, h));
    app.show().unwrap();
    slint::platform::update_timers_and_animations();
    let mut buf = vec![Rgb8Pixel { r: 0, g: 0, b: 0 }; (w * h) as usize];
    let drawn = window.draw_if_needed(|r| {
        r.render(&mut buf, w as usize);
    });
    println!("drawn: {drawn}");
    let mut counts: HashMap<(u8, u8, u8), usize> = HashMap::new();
    for p in &buf {
        *counts.entry((p.r, p.g, p.b)).or_default() += 1;
    }
    let mut v: Vec<_> = counts.into_iter().collect();
    v.sort_by(|a, b| b.1.cmp(&a.1));
    println!("distinct colors {}", v.len());
    for (c, n) in v.iter().take(8) {
        println!("  {:5.1}%  #{:02x}{:02x}{:02x}", *n as f64 * 100.0 / (w * h) as f64, c.0, c.1, c.2);
    }
    let bucket = |p: &Rgb8Pixel| -> char {
        let (r, g, b) = (p.r as i32, p.g as i32, p.b as i32);
        if (r - 0xF6).abs() < 8 && (g - 0xF4).abs() < 8 && (b - 0xFB).abs() < 8 { '.' }
        else if r > 245 && g > 245 && b > 245 { 'W' }
        else if (r - 0x67).abs() < 20 && (g - 0x50).abs() < 20 && (b - 0xA4).abs() < 25 { 'P' }
        else if r < 60 && g < 60 && b < 60 { '#' }
        else { 'o' }
    };
    let (cols, rows) = (39usize, 56usize);
    let (bw, bh) = (w as usize / cols, h as usize / rows);
    for ry in 0..rows {
        let mut line = String::new();
        for cx in 0..cols {
            let mut c: HashMap<char, usize> = HashMap::new();
            for y in (ry * bh..ry * bh + bh).step_by(3) {
                for x in (cx * bw..cx * bw + bw).step_by(3) {
                    *c.entry(bucket(&buf[y * w as usize + x])).or_default() += 1;
                }
            }
            line.push(c.into_iter().max_by_key(|x| x.1).unwrap().0);
        }
        println!("{line}");
    }
}
