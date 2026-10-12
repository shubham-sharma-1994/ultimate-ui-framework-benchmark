using Avalonia;
using Avalonia.Animation;
using Avalonia.Animation.Easings;
using Avalonia.Controls;
using Avalonia.Interactivity;
using Avalonia.Input;
using Avalonia.Media;
using Avalonia.Styling;
using Pulse.ViewModels;
using System;
using System.Threading.Tasks;

namespace Pulse.Views;

public partial class DetailView : UserControl
{
    private bool _isDragging = false;
    private Point _dragStartPoint;
    private TranslateTransform _dragTransform = new TranslateTransform();

    public DetailView()
    {
        InitializeComponent();
    }

    private void OnLoaded(object? sender, RoutedEventArgs e)
    {
        if (DataContext is DetailViewModel vm)
        {
            _ = vm.ReplayProgress();
        }

        var dragCard = this.FindControl<Border>("DragCard");
        if (dragCard != null)
        {
            dragCard.RenderTransform = _dragTransform;
        }
    }

    public void OnScrollChanged(object? sender, ScrollChangedEventArgs e)
    {
        var headerBorder = this.FindControl<Border>("HeaderBorder");
        var mainScroll = this.FindControl<ScrollViewer>("MainScroll");

        if (headerBorder != null && mainScroll != null)
        {
            double offset = mainScroll.Offset.Y;
            if (offset < 0) offset = 0;
            headerBorder.RenderTransform = new TranslateTransform(0, -offset * 0.5);
        }
    }

    public void OnDragCardPointerPressed(object? sender, PointerPressedEventArgs e)
    {
        _isDragging = true;
        _dragStartPoint = e.GetPosition(this);
        var dragCard = this.FindControl<Border>("DragCard");
        if (dragCard != null)
        {
            e.Pointer.Capture(dragCard);
        }
    }

    public void OnDragCardPointerMoved(object? sender, PointerEventArgs e)
    {
        if (_isDragging)
        {
            var currentPoint = e.GetPosition(this);
            var delta = currentPoint - _dragStartPoint;
            _dragTransform.X = delta.X;
            _dragTransform.Y = delta.Y;
        }
    }

    public void OnDragCardPointerReleased(object? sender, PointerReleasedEventArgs e)
    {
        if (_isDragging)
        {
            _isDragging = false;
            e.Pointer.Capture(null);

            var dragCard = this.FindControl<Border>("DragCard");
            if (dragCard != null)
            {
                var animation = new Animation
                {
                    Duration = TimeSpan.FromMilliseconds(500),
                    Easing = new ElasticEaseOut(),
                    FillMode = FillMode.Forward,
                    Children =
                    {
                        new KeyFrame
                        {
                            Cue = new Cue(1d),
                            Setters =
                            {
                                new Setter(TranslateTransform.XProperty, 0d),
                                new Setter(TranslateTransform.YProperty, 0d)
                            }
                        }
                    }
                };
                animation.RunAsync(dragCard);
            }
        }
    }

    private void OnRingTapped(object? sender, PointerPressedEventArgs e)
    {
        if (DataContext is DetailViewModel vm)
        {
            _ = vm.ReplayProgress();
        }
    }

    private void OnDismissClicked(object? sender, RoutedEventArgs e)
    {
        if (sender is Button btn && btn.DataContext is string item && DataContext is DetailViewModel vm)
        {
            vm.SwipeItems.Remove(item);
        }
    }

    private void OnShowDialog(object? sender, RoutedEventArgs e)
    {
        OverlayScrim.IsVisible = true;
        DialogOverlay.IsVisible = true;
    }

    private void OnShowSheet(object? sender, RoutedEventArgs e)
    {
        OverlayScrim.IsVisible = true;
        SheetOverlay.IsVisible = true;
    }

    private async void OnShowToast(object? sender, RoutedEventArgs e)
    {
        ToastOverlay.IsVisible = true;
        await Task.Delay(2000);
        ToastOverlay.IsVisible = false;
    }

    private void OnCloseOverlays(object? sender, RoutedEventArgs e)
    {
        OverlayScrim.IsVisible = false;
        DialogOverlay.IsVisible = false;
        SheetOverlay.IsVisible = false;
    }

    private void OnScrimTapped(object? sender, PointerPressedEventArgs e)
    {
        OnCloseOverlays(null, new RoutedEventArgs());
    }
}
