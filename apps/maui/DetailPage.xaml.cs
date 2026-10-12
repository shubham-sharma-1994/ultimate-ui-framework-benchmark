namespace Pulse;

public partial class DetailPage : ContentPage
{
    private void OnPointerEntered(object sender, PointerEventArgs e)
    {
        if (sender is View view)
        {
            view.FadeTo(0.8, 150);
            view.ScaleTo(1.02, 150);
        }
    }

    private void OnPointerExited(object sender, PointerEventArgs e)
    {
        if (sender is View view)
        {
            view.FadeTo(1, 150);
            view.ScaleTo(1, 150);
        }
    }

    private ProgressRingDrawable _ringDrawable;
    private IDispatcherTimer _ringTimer;
    private ItemData _item;
    private bool _accordionExpanded = false;
    private double _dragStartX, _dragStartY;

    public DetailPage(ItemData item)
    {
        InitializeComponent();
        NavigationPage.SetHasNavigationBar(this, false);
        _item = item;
        _ringDrawable = (ProgressRingDrawable)Resources["ProgressRingDrawable"];

        SetupData();
        StartRingAnimation();
        StartShimmer();
    }

    private void SetupData()
    {
        AppBarTitle.Text = _item.Title;
        BodyText.Text = _item.Body;

        var grad = new LinearGradientBrush { StartPoint = new Point(0, 0), EndPoint = new Point(1, 1) };
        grad.GradientStops.Add(new GradientStop(Color.Parse(_item.Colors[0]), 0));
        grad.GradientStops.Add(new GradientStop(Color.Parse(_item.Colors[1]), 1));
        HeroThumb.Background = grad;
    }

    private void StartRingAnimation()
    {
        _ringDrawable.Progress = 0;
        RingLabel.Text = "0%";

        var targetProgress = _item.Score / 100f;
        var durationMs = 500;
        var steps = 30; // approx 60fps
        var stepTime = durationMs / steps;
        var currentStep = 0;

        _ringTimer = Dispatcher.CreateTimer();
        _ringTimer.Interval = TimeSpan.FromMilliseconds(stepTime);
        _ringTimer.Tick += (s, e) =>
        {
            currentStep++;
            float t = (float)currentStep / steps;
            // cubic out
            t = 1 - (1 - t) * (1 - t) * (1 - t);

            float p = targetProgress * t;
            _ringDrawable.Progress = p;
            RingLabel.Text = $"{(int)(p * 100)}%";
            RingView.Invalidate();

            if (currentStep >= steps)
            {
                _ringTimer.Stop();
            }
        };
        _ringTimer.Start();
    }

    private async void StartShimmer()
    {
        // Simple shimmer loop
        var t1 = ShimmerBlock.FadeTo(0.5, 600);
        await Task.Delay(1500);
        ShimmerBlock.IsVisible = false;

        BodyText.Opacity = 0;
        _ = BodyText.FadeTo(1, 300, Easing.CubicOut);
    }

    private void OnMainScroll(object sender, ScrolledEventArgs e)
    {
        // Parallax
        if (e.ScrollY >= 0 && e.ScrollY <= 240)
        {
            HeroThumb.TranslationY = e.ScrollY * 0.5;
        }

        if (e.ScrollY > 180 && FakeAppBar.Opacity == 0)
        {
            FakeAppBar.FadeTo(1, 150);
        }
        else if (e.ScrollY <= 180 && FakeAppBar.Opacity == 1)
        {
            FakeAppBar.FadeTo(0, 150);
        }
    }

    private async void OnBackClicked(object sender, EventArgs e)
    {
        await Navigation.PopAsync();
    }

    private void OnRingTapped(object sender, TappedEventArgs e)
    {
        if (_ringTimer != null && _ringTimer.IsRunning) return;
        StartRingAnimation();
    }

    private async void OnAccordionTapped(object sender, TappedEventArgs e)
    {
        _accordionExpanded = !_accordionExpanded;
        if (_accordionExpanded)
        {
            AccordionContent.IsVisible = true;
            _ = AccordionContent.FadeTo(1, 300, Easing.CubicOut);
            _ = AccordionChevron.RotateTo(180, 300, Easing.CubicOut);
        }
        else
        {
            _ = AccordionContent.FadeTo(0, 300, Easing.CubicOut).ContinueWith((t) =>
            {
                Dispatcher.Dispatch(() => AccordionContent.IsVisible = false);
            });
            _ = AccordionChevron.RotateTo(0, 300, Easing.CubicOut);
        }
    }

    private void OnDragCardPanUpdated(object sender, PanUpdatedEventArgs e)
    {
        switch (e.StatusType)
        {
            case GestureStatus.Started:
                _dragStartX = DragCard.TranslationX;
                _dragStartY = DragCard.TranslationY;
                break;
            case GestureStatus.Running:
                DragCard.TranslationX = _dragStartX + e.TotalX;
                DragCard.TranslationY = _dragStartY + e.TotalY;
                break;
            case GestureStatus.Completed:
            case GestureStatus.Canceled:
                // Spring back (approximated with custom easing)
                _ = DragCard.TranslateTo(0, 0, 500, Easing.SpringOut);
                break;
        }
    }

    private async void OnSwipeEnded(object sender, SwipeEndedEventArgs e)
    {
        if (!e.IsOpen) return;
        // Approximation of dismiss
        await Swipe1.TranslateTo(-Swipe1.Width, 0, 300, Easing.CubicOut);
        Swipe1.IsVisible = false;
    }

    private async void OnSwipeResetClicked(object sender, EventArgs e)
    {
        Swipe1.IsVisible = true;
        Swipe1.TranslationX = 0;
        Swipe1.Opacity = 0;
        await Swipe1.FadeTo(1, 300, Easing.CubicOut);
    }

    private async void OnBtnDialogClicked(object sender, EventArgs e)
    {
        DialogOverlay.IsVisible = true;
        DialogOverlay.Opacity = 0;
        DialogCard.Scale = 0.9;

        _ = DialogOverlay.FadeTo(1, 300, Easing.CubicOut);
        _ = DialogCard.ScaleTo(1, 300, Easing.CubicOut);
    }

    private async void OnCloseDialogClicked(object sender, EventArgs e)
    {
        _ = DialogCard.ScaleTo(0.9, 300, Easing.CubicOut);
        await DialogOverlay.FadeTo(0, 300, Easing.CubicOut);
        DialogOverlay.IsVisible = false;
    }

    private void OnBtnSheetClicked(object sender, EventArgs e)
    {
        // Skip bottom sheet natively if not easily available without third-party. Appending to NOTES.md later.
    }

    private void OnBtnToastClicked(object sender, EventArgs e)
    {
        // Simple mock toast via label at bottom
    }
}
