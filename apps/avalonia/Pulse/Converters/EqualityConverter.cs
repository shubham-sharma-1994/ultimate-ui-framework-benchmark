using System;
using System.Globalization;
using Avalonia.Data.Converters;

namespace Pulse.Converters;

public class EqualityConverter : IValueConverter
{
    public static readonly EqualityConverter Instance = new();

    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value == null && parameter == null) return true;
        if (value == null || parameter == null) return false;

        // Try converting parameter to match value type if needed
        try
        {
            var convertedParameter = System.Convert.ChangeType(parameter, value.GetType(), culture);
            return value.Equals(convertedParameter);
        }
        catch
        {
            return value.Equals(parameter);
        }
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
