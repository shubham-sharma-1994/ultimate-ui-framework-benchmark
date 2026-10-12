namespace Pulse;

public static class AppThemeHelper
{
    public static void InitializeTheme()
    {
        ApplyTheme(Application.Current.RequestedTheme);
        Application.Current.RequestedThemeChanged += (s, a) => ApplyTheme(a.RequestedTheme);
    }

    public static void ApplyTheme(AppTheme theme)
    {
        var resources = Application.Current.Resources;
        bool isDark = theme == AppTheme.Dark;

        void Map(string key, string lightKey, string darkKey)
        {
            if (resources.TryGetValue(isDark ? darkKey : lightKey, out var val))
            {
                resources[key] = val;
            }
        }

        Map("BackgroundColor", "LightBackground", "DarkBackground");
        Map("SurfaceColor", "LightSurface", "DarkSurface");
        Map("SurfaceAltColor", "LightSurfaceAlt", "DarkSurfaceAlt");
        Map("PrimaryColor", "LightPrimary", "DarkPrimary");
        Map("OnPrimaryColor", "LightOnPrimary", "DarkOnPrimary");
        Map("AccentColor", "LightAccent", "DarkAccent");
        Map("TextColor", "LightText", "DarkText");
        Map("TextMutedColor", "LightTextMuted", "DarkTextMuted");
        Map("OutlineColor", "LightOutline", "DarkOutline");
        Map("SuccessColor", "LightSuccess", "DarkSuccess");
    }
}
