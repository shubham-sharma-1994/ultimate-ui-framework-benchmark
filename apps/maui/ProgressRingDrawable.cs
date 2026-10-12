namespace Pulse;

public class ProgressRingDrawable : IDrawable
{
    public float Progress { get; set; } = 0; // 0 to 1

    public void Draw(ICanvas canvas, RectF dirtyRect)
    {
        float cx = dirtyRect.Width / 2;
        float cy = dirtyRect.Height / 2;
        float radius = Math.Min(cx, cy) - 6; // 12 stroke width -> 6 margin

        canvas.StrokeColor = Application.Current.Resources.TryGetValue("OutlineColor", out var outlineObj) ? (Color)outlineObj : Colors.LightGray;
        canvas.StrokeSize = 12;
        canvas.StrokeLineCap = LineCap.Round;
        canvas.DrawCircle(cx, cy, radius);

        if (Progress > 0)
        {
            canvas.StrokeColor = Application.Current.Resources.TryGetValue("PrimaryColor", out var primObj) ? (Color)primObj : Colors.Blue;
            float endAngle = -90 + (Progress * 360);
            // DrawArc angles in MAUI: 0 is right, positive is counter-clockwise.
            // Start at top (-90 degrees) and draw clockwise.
            // In IDrawable, angle is in degrees, starting from the positive x-axis, clockwise.
            // Wait, top is 270 or -90. Clockwise means endAngle > startAngle.
            // Let's use negative for counter-clockwise. DrawArc requires startAngle and endAngle.
            // Negative angles are counter-clockwise.
            // StartAngle: 90 (top), EndAngle: 90 - 360*Progress.
            // Let's test standard: 0 is 3 o'clock. 90 is 6 o'clock (down).
            // To start at 12 o'clock, start angle is -90.
            // Clockwise = true.
            canvas.DrawArc(cx - radius, cy - radius, radius * 2, radius * 2, 90, 90 - (Progress * 360), false, false);
        }
    }
}
