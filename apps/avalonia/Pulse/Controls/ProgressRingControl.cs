using System;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Media;
using Avalonia.Animation;
using Avalonia.Styling;

namespace Pulse.Controls;

public class ProgressRingControl : Control
{
    public static readonly StyledProperty<double> ValueProperty =
        AvaloniaProperty.Register<ProgressRingControl, double>(nameof(Value));

    public double Value
    {
        get => GetValue(ValueProperty);
        set => SetValue(ValueProperty, value);
    }

    public static readonly StyledProperty<IBrush> RingBrushProperty =
        AvaloniaProperty.Register<ProgressRingControl, IBrush>(nameof(RingBrush), new SolidColorBrush(Colors.Blue));

    public IBrush RingBrush
    {
        get => GetValue(RingBrushProperty);
        set => SetValue(RingBrushProperty, value);
    }

    static ProgressRingControl()
    {
        AffectsRender<ProgressRingControl>(ValueProperty);
        AffectsRender<ProgressRingControl>(RingBrushProperty);
    }

    public override void Render(DrawingContext context)
    {
        base.Render(context);

        var radius = Math.Min(Bounds.Width, Bounds.Height) / 2.0 - 6; // stroke 12 -> half is 6
        if (radius <= 0) return;

        var center = new Point(Bounds.Width / 2, Bounds.Height / 2);

        // Background ring
        var bgPen = new Pen(new SolidColorBrush(Colors.Gray) { Opacity = 0.2 }, 12, lineCap: PenLineCap.Round);
        context.DrawEllipse(null, bgPen, center, radius, radius);

        if (Value <= 0) return;

        // Foreground ring
        var angle = Value / 100.0 * 360.0;
        var startAngle = -90.0;

        var fgPen = new Pen(RingBrush, 12, lineCap: PenLineCap.Round);

        // Draw arc approximation or geometry
        var pathGeometry = new StreamGeometry();
        using (var ctx = pathGeometry.Open())
        {
            var startRad = startAngle * Math.PI / 180.0;
            var endRad = (startAngle + angle) * Math.PI / 180.0;

            var startPoint = new Point(
                center.X + radius * Math.Cos(startRad),
                center.Y + radius * Math.Sin(startRad));

            var endPoint = new Point(
                center.X + radius * Math.Cos(endRad),
                center.Y + radius * Math.Sin(endRad));

            ctx.BeginFigure(startPoint, false);
            ctx.ArcTo(endPoint, new Size(radius, radius), 0, angle > 180, SweepDirection.Clockwise);
            ctx.EndFigure(false);
        }

        context.DrawGeometry(null, fgPen, pathGeometry);
    }
}
