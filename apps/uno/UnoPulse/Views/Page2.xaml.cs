using System;
using System.Threading.Tasks;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media.Animation;
using Microsoft.UI.Xaml.Navigation;
using Windows.UI;
using UnoPulse.Models;

namespace UnoPulse.Views;

public sealed partial class Page2 : Page
{
    private ItemData _item;

    public Page2()
    {
        this.InitializeComponent();
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
        base.OnNavigatedTo(e);
        if (e.Parameter is ItemData item)
        {
            _item = item;
            HeaderTitle.Text = item.Title;

            var color1 = FromHex(item.Color1);
            var color2 = FromHex(item.Color2);
            HeroColor1.Color = color1;
            HeroColor2.Color = color2;

            var anim = ConnectedAnimationService.GetForCurrentView().GetAnimation("ThumbnailAnim");
            if (anim != null)
            {
                anim.TryStart(HeroThumbnail);
            }

            AnimateRing();
            RunShimmer();
        }
    }

    private Color FromHex(string hex)
    {
        hex = hex.Replace("#", "");
        byte a = 255;
        byte r = Convert.ToByte(hex.Substring(0, 2), 16);
        byte g = Convert.ToByte(hex.Substring(2, 2), 16);
        byte b = Convert.ToByte(hex.Substring(4, 2), 16);
        return Color.FromArgb(a, r, g, b);
    }

    private void OnBackClicked(object sender, RoutedEventArgs e)
    {
        if (Frame.CanGoBack)
        {
            ConnectedAnimationService.GetForCurrentView().PrepareToAnimate("ThumbnailAnim", HeroThumbnail);
            Frame.GoBack();
        }
    }

    private void OnDetailScrollChanged(object sender, ScrollViewerViewChangedEventArgs e)
    {
        var offset = DetailScroll.VerticalOffset;
        if (offset > 0 && offset < 184)
        {
            HeaderArea.Height = 240 - offset;
            var scale = 1 - (offset / 184) * (1 - 20.0/32.0);
            HeaderTitleTransform.ScaleX = scale;
            HeaderTitleTransform.ScaleY = scale;
        }
    }

    private void AnimateRing()
    {
        var score = _item.Score;
        ScoreText.Text = $"{score}%";
    }

    private void OnRingTapped(object sender, TappedRoutedEventArgs e)
    {
        AnimateRing();
    }

    private void OnCardManipulationDelta(object sender, ManipulationDeltaRoutedEventArgs e)
    {
        DragTransform.X += e.Delta.Translation.X;
        DragTransform.Y += e.Delta.Translation.Y;
    }

    private void OnCardManipulationCompleted(object sender, ManipulationCompletedRoutedEventArgs e)
    {
        var visual = Microsoft.UI.Xaml.Hosting.ElementCompositionPreview.GetElementVisual(DragCard);
        var compositor = visual.Compositor;
        var springAnimation = compositor.CreateSpringVector3Animation();
        springAnimation.Target = "Translation";
        springAnimation.FinalValue = new System.Numerics.Vector3(0, 0, 0);
        springAnimation.DampingRatio = 0.5f;
        springAnimation.Period = TimeSpan.FromMilliseconds(50);

        // Set initial value for the spring animation based on the current drag offset
        springAnimation.InitialValue = new System.Numerics.Vector3((float)DragTransform.X, (float)DragTransform.Y, 0);

        // Reset XAML Transform so we don't double-translate
        DragTransform.X = 0;
        DragTransform.Y = 0;

        visual.StartAnimation("Translation", springAnimation);
    }

    private void OnSwipeInvoked(SwipeItem sender, SwipeItemInvokedEventArgs args)
    {
        if (args.SwipeControl is UIElement control)
        {
            control.Visibility = Visibility.Collapsed;
        }
    }

    private void OnResetSwipes(object sender, RoutedEventArgs e)
    {
        Swipe1.Visibility = Visibility.Visible;
        Swipe2.Visibility = Visibility.Visible;
        Swipe3.Visibility = Visibility.Visible;
    }

    private async void OnDialogClicked(object sender, RoutedEventArgs e)
    {
        var dialog = new ContentDialog
        {
            Title = "Dialog",
            Content = "This is a modal dialog.",
            CloseButtonText = "OK",
            XamlRoot = this.XamlRoot
        };
        await dialog.ShowAsync();
    }

    private void OnSheetClicked(object sender, RoutedEventArgs e)
    {
    }

    private async void OnToastClicked(object sender, RoutedEventArgs e)
    {
        ToastBar.IsOpen = true;
        await Task.Delay(2000);
        ToastBar.IsOpen = false;
    }

    private async void RunShimmer()
    {
        Shimmer.Visibility = Visibility.Visible;
        await Task.Delay(1500);
        Shimmer.Visibility = Visibility.Collapsed;
    }
}
