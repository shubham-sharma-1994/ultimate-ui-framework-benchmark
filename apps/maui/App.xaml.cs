namespace Pulse;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();

        var navPage = new NavigationPage(new MainPage());
        NavigationPage.SetHasNavigationBar(navPage, false);
        MainPage = navPage;
    }
}
