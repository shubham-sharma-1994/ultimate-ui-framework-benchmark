namespace Pulse;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();
        AppThemeHelper.InitializeTheme();
    }

    protected override Window CreateWindow(IActivationState activationState)
    {
        var navPage = new NavigationPage(new MainPage());
        NavigationPage.SetHasNavigationBar(navPage, false);
        return new Window(navPage);
    }
}
