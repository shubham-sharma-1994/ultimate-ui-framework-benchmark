namespace Pulse;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("Inter-Regular.otf", "InterRegular");
				fonts.AddFont("Inter-Medium.otf", "InterMedium");
				fonts.AddFont("Inter-SemiBold.otf", "InterSemiBold");
				fonts.AddFont("Inter-Bold.otf", "InterBold");
			});

		return builder.Build();
	}
}
