using Avalonia.Controls;
using Avalonia.Interactivity;
using Pulse.ViewModels;

namespace Pulse.Views;

public partial class ShowcaseView : UserControl
{
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
}
