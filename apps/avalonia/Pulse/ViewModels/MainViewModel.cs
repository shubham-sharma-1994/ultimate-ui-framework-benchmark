using System.Collections.ObjectModel;
using System.IO;
using Avalonia.Platform;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Newtonsoft.Json;
using Pulse.Models;
using System;

namespace Pulse.ViewModels;

public partial class MainViewModel : ViewModelBase
{
    [ObservableProperty]
    private ViewModelBase _currentPage;

    [ObservableProperty]
    private ObservableCollection<ItemData> _items = new();

    public MainViewModel()
    {
        LoadData();
        CurrentPage = new ShowcaseViewModel(this);
    }

    private void LoadData()
    {
        try
        {
            using var stream = AssetLoader.Open(new Uri("avares://Pulse/Assets/data.json"));
            using var reader = new StreamReader(stream);
            var json = reader.ReadToEnd();
            var root = JsonConvert.DeserializeObject<DataRoot>(json);
            if (root?.Items != null)
            {
                foreach (var item in root.Items)
                {
                    Items.Add(item);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading data.json: {ex.Message}");
        }
    }

    public void NavigateTo(ViewModelBase page)
    {
        CurrentPage = page;
    }
}
