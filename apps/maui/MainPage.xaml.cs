using System.Text.Json;
using Microsoft.Maui.Controls.Shapes;

namespace Pulse;

public partial class MainPage : ContentPage
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

    private OrbitDrawable _orbitDrawable;
    private IDispatcherTimer _orbitTimer;
    private int _taps = 0;
    private bool _isDarkTheme = false;

    public MainPage()
    {
        InitializeComponent();
        NavigationPage.SetHasNavigationBar(this, false);

        _orbitDrawable = (OrbitDrawable)Resources["OrbitDrawable"];
        _orbitTimer = Dispatcher.CreateTimer();
        _orbitTimer.Interval = TimeSpan.FromMilliseconds(16); // ~60fps
        _orbitTimer.Tick += (s, e) =>
        {
            // 3s per revolution = 3000ms. 2PI / (3000 / 16) = ~0.0335 radians per tick
            _orbitDrawable.Angle += 0.0335f;
            OrbitView.Invalidate();
        };
        _orbitTimer.Start();

        LoadData();
    }

    private async void LoadData()
    {
        using var stream = await FileSystem.OpenAppPackageFileAsync("data.json");
        using var reader = new StreamReader(stream);
        var json = await reader.ReadToEndAsync();
        var data = JsonSerializer.Deserialize<RootData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (data?.Items != null)
        {
            foreach (var item in data.Items)
            {
                var row = CreateItemRow(item);
                row.Opacity = 0;
                row.TranslationY = 24;
                ItemsList.Children.Add(row);
            }
            AnimateListEntrance();
        }
    }

    private async void AnimateListEntrance()
    {
        for (int i = 0; i < ItemsList.Children.Count; i++)
        {
            var view = (View)ItemsList.Children[i];
            _ = view.FadeTo(1, 500, Easing.CubicOut);
            _ = view.TranslateTo(0, 0, 500, Easing.CubicOut);
            await Task.Delay(50);
        }
    }

    private View CreateItemRow(ItemData item)
    {
        var grid = new Grid
        {
            ColumnDefinitions = new ColumnDefinitionCollection { new ColumnDefinition { Width = GridLength.Auto }, new ColumnDefinition { Width = GridLength.Star }, new ColumnDefinition { Width = GridLength.Auto } },
            ColumnSpacing = 16,
            AutomationId = $"item-{item.Id}"
        };

        var grad = new LinearGradientBrush
        {
            StartPoint = new Point(0, 0),
            EndPoint = new Point(1, 1)
        };
        grad.GradientStops.Add(new GradientStop(Color.Parse(item.Colors[0]), 0));
        grad.GradientStops.Add(new GradientStop(Color.Parse(item.Colors[1]), 1));

        var thumb = new Border
        {
            StrokeShape = new RoundRectangle { CornerRadius = new CornerRadius(16) },
            Background = grad,
            WidthRequest = 56,
            HeightRequest = 56,
            StrokeThickness = 0
        };

        var textStack = new VerticalStackLayout { VerticalOptions = LayoutOptions.Center, Spacing = 4 };
        var title = new Label { Text = item.Title, Style = (Style)Application.Current.Resources["Body"], FontAttributes = FontAttributes.Bold, TextColor = (Color)Application.Current.Resources["TextColor"] };
        var sub = new Label { Text = item.Subtitle, Style = (Style)Application.Current.Resources["Caption"], TextColor = (Color)Application.Current.Resources["TextMutedColor"] };
        textStack.Children.Add(title);
        textStack.Children.Add(sub);

        // Approximation of chevron
        var chev = new Label { Text = ">", VerticalOptions = LayoutOptions.Center, Style = (Style)Application.Current.Resources["Title"], TextColor = (Color)Application.Current.Resources["TextMutedColor"] };

        grid.Children.Add(thumb);
        Grid.SetColumn(thumb, 0);
        grid.Children.Add(textStack);
        Grid.SetColumn(textStack, 1);
        grid.Children.Add(chev);
        Grid.SetColumn(chev, 2);

        var tap = new TapGestureRecognizer();
        tap.Tapped += async (s, e) =>
        {
            await Navigation.PushAsync(new DetailPage(item));
        };
        grid.GestureRecognizers.Add(tap);

        return grid;
    }

    private void OnMainScroll(object sender, ScrolledEventArgs e)
    {
        if (e.ScrollY > 0 && AppBarShadow.Opacity == 0)
        {
            AppBarShadow.Opacity = 1; // Simplified fade
        }
        else if (e.ScrollY <= 0 && AppBarShadow.Opacity == 1)
        {
            AppBarShadow.Opacity = 0;
        }
    }

    private async void OnCounterIncClicked(object sender, EventArgs e)
    {
        await CounterInc.ScaleTo(0.96, 150, Easing.CubicOut);
        _ = CounterInc.ScaleTo(1, 150, Easing.CubicOut);

        _taps++;

        TapsLabelOld.Text = (_taps - 1).ToString();
        TapsLabelOld.Opacity = 1;
        TapsLabelOld.TranslationY = 0;

        TapsLabel.Text = _taps.ToString();
        TapsLabel.Opacity = 0;
        TapsLabel.TranslationY = 24;

        _ = TapsLabelOld.TranslateTo(0, -24, 300, Easing.CubicOut);
        _ = TapsLabelOld.FadeTo(0, 300, Easing.CubicOut);

        _ = TapsLabel.TranslateTo(0, 0, 300, Easing.CubicOut);
        _ = TapsLabel.FadeTo(1, 300, Easing.CubicOut);
    }

    private void OnSliderValueChanged(object sender, ValueChangedEventArgs e)
    {
        SliderLabel.Text = $"Intensity: {Math.Round(e.NewValue)}";
    }

    private void OnChipClicked(object sender, TappedEventArgs e)
    {
        var primary = (Color)Application.Current.Resources["PrimaryColor"];
        var alt = (Color)Application.Current.Resources["SurfaceAltColor"];
        var onPrimary = (Color)Application.Current.Resources["OnPrimaryColor"];
        var textCol = (Color)Application.Current.Resources["TextColor"];

        void SetChip(Border chip, bool selected)
        {
            chip.BackgroundColor = selected ? primary : alt;
            ((Label)chip.Content).TextColor = selected ? onPrimary : textCol;
        }

        var param = e.Parameter?.ToString();
        SetChip(ChipLow, param == "Low");
        SetChip(ChipMedium, param == "Medium");
        SetChip(ChipHigh, param == "High");
    }

    private void OnNameInputFocused(object sender, FocusEventArgs e)
    {
        NameInputLabel.TranslateTo(0, -20, 150, Easing.CubicOut);
        NameInputLabel.ScaleTo(0.8, 150, Easing.CubicOut);
        NameInputBorder.Stroke = (Color)Application.Current.Resources["PrimaryColor"];
        NameInputBorder.StrokeThickness = 2;
    }

    private void OnNameInputUnfocused(object sender, FocusEventArgs e)
    {
        if (string.IsNullOrEmpty(NameInput.Text))
        {
            NameInputLabel.TranslateTo(0, 0, 150, Easing.CubicOut);
            NameInputLabel.ScaleTo(1, 150, Easing.CubicOut);
        }
        NameInputBorder.Stroke = (Color)Application.Current.Resources["OutlineColor"];
        NameInputBorder.StrokeThickness = 1;
    }

    private async void OnNameInputTextChanged(object sender, TextChangedEventArgs e)
    {
        if (string.IsNullOrEmpty(e.NewTextValue))
        {
            await GreetingLabel.FadeTo(0, 150);
            GreetingLabel.Text = "";
        }
        else
        {
            GreetingLabel.Text = $"Hello, {e.NewTextValue}";
            await GreetingLabel.FadeTo(1, 150);
        }
    }

    private async void OnThemeToggleClicked(object sender, EventArgs e)
    {
        _isDarkTheme = !_isDarkTheme;
        Application.Current.UserAppTheme = _isDarkTheme ? AppTheme.Dark : AppTheme.Light;
        AppThemeHelper.ApplyTheme(Application.Current.UserAppTheme);

        // Rotate and crossfade icon
        await ThemeToggle.FadeTo(0, 150);
        ThemeToggle.Source = _isDarkTheme ? "sun.png" : "moon.png";
        ThemeToggle.Rotation = 0;
        _ = ThemeToggle.RotateTo(180, 150);
        _ = ThemeToggle.FadeTo(1, 150);
    }
}
