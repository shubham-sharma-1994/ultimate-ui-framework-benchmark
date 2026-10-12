using Avalonia.Controls;
using Avalonia.Interactivity;
using Avalonia.Input;
using Pulse.ViewModels;
using System.Threading.Tasks;

namespace Pulse.Views;

public partial class DetailView : UserControl
{
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
