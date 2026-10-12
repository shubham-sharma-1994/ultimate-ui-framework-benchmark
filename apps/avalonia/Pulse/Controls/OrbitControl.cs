using System;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Media;
using Avalonia.Rendering;
using Avalonia.Threading;

namespace Pulse.Controls;

public class OrbitControl : Control
{
    private double _angle;
    private DispatcherTimer? _timer;

    protected override void OnAttachedToVisualTree(VisualTreeAttachmentEventArgs e)
    {
        base.OnAttachedToVisualTree(e);
        _timer = new DispatcherTimer
        {
            Interval = TimeSpan.FromMilliseconds(16) // ~60fps
        };
        _timer.Tick += (s, args) =>
        {
            // 3 seconds per revolution = 3000 ms
            // 360 degrees / (3000 / 16) = 1.92 degrees per frame
            _angle += 1.92;
            if (_angle >= 360) _angle -= 360;
            InvalidateVisual();
        };
        _timer.Start();
    }

    protected override void OnDetachedFromVisualTree(VisualTreeAttachmentEventArgs e)
    {
        base.OnDetachedFromVisualTree(e);
        _timer?.Stop();
    }

    public override void Render(DrawingContext context)
    {
        base.Render(context);

        var center = new Point(Bounds.Width / 2, Bounds.Height / 2);
        var ringRadius = 40.0;
        var dotRadius = 6.0;

        // Draw ring
        var ringPen = new Pen(new SolidColorBrush(Colors.White) { Opacity = 0.3 }, 2);
        context.DrawEllipse(null, ringPen, center, ringRadius, ringRadius);

        // Draw 3 dots
        var dotBrush = new SolidColorBrush(Colors.White);
        for (int i = 0; i < 3; i++)
        {
            var offsetAngle = _angle + (i * 120);
            var rad = offsetAngle * Math.PI / 180.0;
            var x = center.X + ringRadius * Math.Cos(rad);
            var y = center.Y + ringRadius * Math.Sin(rad);
            context.DrawEllipse(dotBrush, null, new Point(x, y), dotRadius, dotRadius);
        }
    }
}
