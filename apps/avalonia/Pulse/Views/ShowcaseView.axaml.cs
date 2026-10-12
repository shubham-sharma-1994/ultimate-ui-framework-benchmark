using Avalonia.Controls;
using Avalonia.Interactivity;
using Avalonia;
using Avalonia.Animation;
using Avalonia.Animation.Easings;
using Avalonia.Media;
using Avalonia.Styling;
using Pulse.ViewModels;
using System;
using System.Threading.Tasks;

namespace Pulse.Views;

public partial class ShowcaseView : UserControl
{
    private int _itemAttachCount = 0;

    public ShowcaseView()
    {
        InitializeComponent();
    }

    private void OnThemeToggleClicked(object? sender, RoutedEventArgs e)
    {
        if (DataContext is ShowcaseViewModel vm)
        {
            vm.ToggleTheme();
        }
    }

    private void OnItemAttachedToVisualTree(object? sender, VisualTreeAttachmentEventArgs e)
    {
        if (sender is Control control)
        {
            _itemAttachCount++;
            int delayMs = _itemAttachCount * 100;

            control.Opacity = 0;
            control.RenderTransform = new TranslateTransform(0, 50);

            var animation = new Animation
            {
                Duration = TimeSpan.FromMilliseconds(400),
                Delay = TimeSpan.FromMilliseconds(delayMs),
                Easing = new CubicEaseOut(),
                FillMode = FillMode.Forward,
                Children =
                {
                    new KeyFrame
                    {
                        Cue = new Cue(1d),
                        Setters =
                        {
                            new Setter(Control.OpacityProperty, 1d),
                            new Setter(TranslateTransform.YProperty, 0d)
                        }
                    }
                }
            };

            animation.RunAsync(control);
        }
    }
}
