using System;
using System.Threading.Tasks;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media.Animation;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Navigation;
using UnoPulse.Services;
using UnoPulse.Models;

namespace UnoPulse.Views;

public sealed partial class Page1 : Page
{
    private int _taps = 0;
    private Storyboard _orbitStoryboard;

    public Page1()
    {
        this.InitializeComponent();
        this.Loaded += Page1_Loaded;
    }

    private async void Page1_Loaded(object sender, RoutedEventArgs e)
    {
        var data = await DataService.LoadDataAsync();
        ItemsList.ItemsSource = data.Items;

        _orbitStoryboard = new Storyboard();
        var animation = new DoubleAnimation
        {
            From = 0,
            To = 360,
            Duration = TimeSpan.FromSeconds(3),
            RepeatBehavior = RepeatBehavior.Forever
        };
        Storyboard.SetTarget(animation, OrbitRotation);
        Storyboard.SetTargetProperty(animation, "Angle");
        _orbitStoryboard.Children.Add(animation);
        _orbitStoryboard.Begin();
    }

    private void OnThemeToggleClicked(object sender, RoutedEventArgs e)
    {
        var isDark = RequestedTheme == ElementTheme.Dark;
        RequestedTheme = isDark ? ElementTheme.Light : ElementTheme.Dark;

        ThemeIcon.Text = isDark ? "\uE706" : "\uE708";

        var sb = new Storyboard();
        var anim = new DoubleAnimation
        {
            From = 0,
            To = 180,
            Duration = TimeSpan.FromMilliseconds(500),
            EasingFunction = new CubicEase { EasingMode = EasingMode.EaseInOut }
        };
        Storyboard.SetTarget(anim, ThemeIconRotation);
        Storyboard.SetTargetProperty(anim, "Angle");
        sb.Children.Add(anim);
        sb.Begin();
    }

    private void OnCounterClicked(object sender, RoutedEventArgs e)
    {
        _taps++;
        AnimateCounter();
    }

    private void OnCounterLongPressed(object sender, HoldingRoutedEventArgs e)
    {
        if (e.HoldingState == Microsoft.UI.Input.HoldingState.Started)
        {
            _taps = 0;
            AnimateCounter();
        }
    }

    private void AnimateCounter()
    {
        CounterText.Text = _taps.ToString();
        var sb = new Storyboard();

        var slideOut = new DoubleAnimation
        {
            From = 0, To = -40, Duration = TimeSpan.FromMilliseconds(150)
        };
        Storyboard.SetTarget(slideOut, CounterTranslate);
        Storyboard.SetTargetProperty(slideOut, "Y");

        var slideIn = new DoubleAnimation
        {
            From = 40, To = 0, Duration = TimeSpan.FromMilliseconds(150),
            BeginTime = TimeSpan.FromMilliseconds(150)
        };
        Storyboard.SetTarget(slideIn, CounterTranslate);
        Storyboard.SetTargetProperty(slideIn, "Y");

        sb.Children.Add(slideOut);
        sb.Children.Add(slideIn);
        sb.Begin();
    }

    private void OnScrollViewChanged(object sender, ScrollViewerViewChangedEventArgs e)
    {
    }

    private void OnChipClicked(object sender, RoutedEventArgs e)
    {
        var clicked = sender as ToggleButton;
        ChipLow.IsChecked = clicked == ChipLow;
        ChipMedium.IsChecked = clicked == ChipMedium;
        ChipHigh.IsChecked = clicked == ChipHigh;
    }

    private void OnNameTextChanged(object sender, TextChangedEventArgs e)
    {
        GreetingText.Text = $"Hello, {NameInput.Text}";
        GreetingText.Opacity = string.IsNullOrEmpty(NameInput.Text) ? 0 : 1;
    }

    private void OnItemTapped(object sender, TappedRoutedEventArgs e)
    {
        if (sender is FrameworkElement element && element.DataContext is ItemData item)
        {
            var thumbnail = element.FindName("Thumbnail") as UIElement;
            if (thumbnail != null)
            {
                ConnectedAnimationService.GetForCurrentView().PrepareToAnimate("ThumbnailAnim", thumbnail);
            }
            Frame.Navigate(typeof(Page2), item, new SlideNavigationTransitionInfo { Effect = SlideNavigationTransitionEffect.FromRight });
        }
    }
}
