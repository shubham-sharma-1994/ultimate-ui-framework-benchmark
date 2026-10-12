namespace Pulse;

public class OrbitDrawable : IDrawable
{
    public float Angle { get; set; } = 0;

    public void Draw(ICanvas canvas, RectF dirtyRect)
    {
        float cx = dirtyRect.Width / 2;
        float cy = dirtyRect.Height / 2;
        float rRing = 40;
        float rDot = 6;

        canvas.StrokeColor = Colors.White.WithAlpha(0.3f);
        canvas.StrokeSize = 2;
        canvas.DrawCircle(cx, cy, rRing);

        canvas.FillColor = Colors.White;

        for (int i = 0; i < 3; i++)
        {
            float offset = (float)(i * Math.PI * 2 / 3.0);
            float currentAngle = Angle + offset;

            float x = cx + rRing * (float)Math.Cos(currentAngle);
            float y = cy + rRing * (float)Math.Sin(currentAngle);

            canvas.DrawCircle(x, y, rDot);
        }
    }
}
