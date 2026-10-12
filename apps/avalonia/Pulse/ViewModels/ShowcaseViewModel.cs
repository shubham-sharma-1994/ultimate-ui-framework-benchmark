using CommunityToolkit.Mvvm.ComponentModel;
using Pulse.Models;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using Avalonia.Threading;

namespace Pulse.ViewModels;

public partial class ShowcaseViewModel : ViewModelBase
{
    private readonly MainViewModel _mainViewModel;

    [ObservableProperty]
    private int _tapsCount;

    [ObservableProperty]
    private bool _isNotificationsEnabled;

    [ObservableProperty]
    private double _intensityValue;

    [ObservableProperty]
    private string _nameInput = string.Empty;

    [ObservableProperty]
    private int _selectedChipIndex = 0; // 0=Low, 1=Medium, 2=High

    public ShowcaseViewModel(MainViewModel mainViewModel)
    {
        _mainViewModel = mainViewModel;
    }

    public ObservableCollection<ItemData> Items => _mainViewModel.Items;

    [RelayCommand]
    public void GoToDetail(ItemData item)
    {
        _mainViewModel.NavigateTo(new DetailViewModel(_mainViewModel, item));
    }

    [RelayCommand]
    public void IncrementTaps()
    {
        TapsCount++;
    }

    [RelayCommand]
    public void ResetTaps()
    {
        TapsCount = 0;
    }

    public void ToggleTheme()
    {
        if (Avalonia.Application.Current != null)
        {
            var currentTheme = Avalonia.Application.Current.RequestedThemeVariant;
            Avalonia.Application.Current.RequestedThemeVariant =
                currentTheme == Avalonia.Styling.ThemeVariant.Light
                ? Avalonia.Styling.ThemeVariant.Dark
                : Avalonia.Styling.ThemeVariant.Light;
        }
    }
}
