using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Pulse.Models;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using Avalonia.Threading;

namespace Pulse.ViewModels;

public partial class DetailViewModel : ViewModelBase
{
    private readonly MainViewModel _mainViewModel;

    [ObservableProperty]
    private ItemData _item;

    [ObservableProperty]
    private double _animatedScore;

    [ObservableProperty]
    private bool _isShimmerVisible = true;

    [ObservableProperty]
    private bool _isContentVisible = false;

    public ObservableCollection<string> SwipeItems { get; } = new()
    {
        "Swipe me 1",
        "Swipe me 2",
        "Swipe me 3"
    };

    public DetailViewModel(MainViewModel mainViewModel, ItemData item)
    {
        _mainViewModel = mainViewModel;
        Item = item;

        // Start shimmer and score animation
        _ = StartAnimationsAsync();
    }

    private async Task StartAnimationsAsync()
    {
        await Task.Delay(1500); // 1.5s shimmer
        IsShimmerVisible = false;
        IsContentVisible = true;
    }

    public async Task ReplayProgress()
    {
        AnimatedScore = 0;
        await Task.Delay(50);
        AnimateScore(Item.Score);
    }

    private void AnimateScore(int targetScore)
    {
        // Simple manual animation loop since Avalonia animations on bindings can be tricky without behaviors
        var steps = 30; // 500ms slow token / ~16ms = 30 steps
        var stepValue = (double)targetScore / steps;
        var currentStep = 0;

        var timer = new DispatcherTimer { Interval = System.TimeSpan.FromMilliseconds(16) };
        timer.Tick += (s, e) =>
        {
            currentStep++;
            AnimatedScore = stepValue * currentStep;
            if (currentStep >= steps)
            {
                AnimatedScore = targetScore;
                timer.Stop();
            }
        };
        timer.Start();
    }

    [RelayCommand]
    public void GoBack()
    {
        _mainViewModel.NavigateTo(new ShowcaseViewModel(_mainViewModel));
    }

    [RelayCommand]
    public void ShowDialog()
    {
        // TODO: implement dialog via view overlay or window
    }

    [RelayCommand]
    public void ShowSheet()
    {
        // TODO: implement sheet
    }

    [RelayCommand]
    public void ShowToast()
    {
        // TODO: implement toast
    }

    [RelayCommand]
    public void ResetSwipe()
    {
        SwipeItems.Clear();
        SwipeItems.Add("Swipe me 1");
        SwipeItems.Add("Swipe me 2");
        SwipeItems.Add("Swipe me 3");
    }
}
