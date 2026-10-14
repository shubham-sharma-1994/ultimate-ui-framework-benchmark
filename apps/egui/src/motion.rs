use egui::Vec2;

/// Evaluates a 1D cubic bezier curve with endpoints (0,0) and (1,1).
pub fn cubic_bezier(p1x: f32, p1y: f32, p2x: f32, p2y: f32, t: f32) -> f32 {
    let t = t.clamp(0.0, 1.0);
    // Approximate x(s) -> s with Newton-Raphson or binary search
    let mut s = t;
    for _ in 0..6 {
        let one_minus_s = 1.0 - s;
        let x = 3.0 * one_minus_s * one_minus_s * s * p1x
            + 3.0 * one_minus_s * s * s * p2x
            + s * s * s;
        let dx = 3.0 * one_minus_s * one_minus_s * p1x
            + 6.0 * one_minus_s * s * (p2x - p1x)
            + 3.0 * s * s * (1.0 - p2x);
        if dx.abs() < 1e-5 {
            break;
        }
        s -= (x - t) / dx;
        s = s.clamp(0.0, 1.0);
    }
    let one_minus_s = 1.0 - s;
    3.0 * one_minus_s * one_minus_s * s * p1y
        + 3.0 * one_minus_s * s * s * p2y
        + s * s * s
}

pub fn ease_fast(t: f32) -> f32 {
    cubic_bezier(0.2, 0.0, 0.0, 1.0, t)
}

pub fn ease_base(t: f32) -> f32 {
    cubic_bezier(0.65, 0.0, 0.35, 1.0, t)
}

pub fn ease_slow(t: f32) -> f32 {
    cubic_bezier(0.05, 0.7, 0.1, 1.0, t)
}

/// A 2D Spring physics simulation matching spec:
/// stiffness: 300, damping: 20, mass: 1
#[derive(Clone, Copy, Debug)]
pub struct Spring2D {
    pub pos: Vec2,
    pub vel: Vec2,
    pub target: Vec2,
    pub stiffness: f32,
    pub damping: f32,
    pub mass: f32,
}

impl Default for Spring2D {
    fn default() -> Self {
        Self {
            pos: Vec2::ZERO,
            vel: Vec2::ZERO,
            target: Vec2::ZERO,
            stiffness: 300.0,
            damping: 20.0,
            mass: 1.0,
        }
    }
}

impl Spring2D {
    pub fn new(initial_pos: Vec2) -> Self {
        Self {
            pos: initial_pos,
            target: initial_pos,
            ..Default::default()
        }
    }

    /// Step simulation using semi-implicit Euler integration with substeps for stability
    pub fn update(&mut self, dt: f32) -> bool {
        let dt = dt.clamp(0.0, 0.05); // prevent explosion on frame drops
        if dt <= 0.0 {
            return false;
        }

        // 4 substeps for high numerical accuracy and stability
        let substeps = 4;
        let sub_dt = dt / (substeps as f32);

        for _ in 0..substeps {
            let displacement = self.pos - self.target;
            let spring_force = -self.stiffness * displacement;
            let damping_force = -self.damping * self.vel;
            let total_force = spring_force + damping_force;
            let accel = total_force / self.mass;

            self.vel += accel * sub_dt;
            self.pos += self.vel * sub_dt;
        }

        // Check if resting near target
        let dist = (self.pos - self.target).length();
        let speed = self.vel.length();
        if dist < 0.2 && speed < 1.0 {
            self.pos = self.target;
            self.vel = Vec2::ZERO;
            false // at rest
        } else {
            true // still moving
        }
    }

    pub fn is_at_rest(&self) -> bool {
        (self.pos - self.target).length() < 0.2 && self.vel.length() < 1.0
    }
}
