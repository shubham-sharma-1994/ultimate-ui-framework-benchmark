import 'package:flutter/material.dart';

// DESIGN.md §2: Tokens
class AppColors {
  // Light Theme
  static const Color backgroundLight = Color(0xFFF6F4FB);
  static const Color surfaceLight = Color(0xFFFFFFFF);
  static const Color surfaceAltLight = Color(0xFFEEEAF7);
  static const Color primaryLight = Color(0xFF6750A4);
  static const Color onPrimaryLight = Color(0xFFFFFFFF);
  static const Color accentLight = Color(0xFFFF7A59);
  static const Color textLight = Color(0xFF1D1B20);
  static const Color textMutedLight = Color(0xFF6B6674);
  static const Color outlineLight = Color(0xFFD9D3E6);
  static const Color successLight = Color(0xFF2E9E6B);

  // Dark Theme
  static const Color backgroundDark = Color(0xFF121016);
  static const Color surfaceDark = Color(0xFF1C1A22);
  static const Color surfaceAltDark = Color(0xFF26232E);
  static const Color primaryDark = Color(0xFFCFBCFF);
  static const Color onPrimaryDark = Color(0xFF381E72);
  static const Color accentDark = Color(0xFFFF9E85);
  static const Color textDark = Color(0xFFE6E0E9);
  static const Color textMutedDark = Color(0xFFA9A3B3);
  static const Color outlineDark = Color(0xFF3A3644);
  static const Color successDark = Color(0xFF5FD39B);
}

// DESIGN.md §3: Motion tokens
class AppMotion {
  static const Duration fast = Duration(milliseconds: 150);
  static const Duration base = Duration(milliseconds: 300);
  static const Duration slow = Duration(milliseconds: 500);

  static const Curve fastCurve = Cubic(0.2, 0.0, 0.0, 1.0);
  static const Curve baseCurve = Cubic(0.65, 0.0, 0.35, 1.0);
  static const Curve slowCurve = Cubic(0.05, 0.7, 0.1, 1.0);

  // Spring: stiffness 300, damping 20, mass 1
  static final SpringDescription spring = SpringDescription(mass: 1, stiffness: 300, damping: 20);
}

// DESIGN.md §1: Radii & Elevation
class AppRadii {
  static const double card = 20.0;
  static const double button = 14.0;
  static const double chip = 999.0;
  static const double input = 14.0;
  static const double sheetTop = 28.0;
}

class AppShadows {
  static const List<BoxShadow> e1 = [
    BoxShadow(color: Color(0x14000000), offset: Offset(0, 2), blurRadius: 8) // rgba(0,0,0,.08) -> 0x14
  ];
  static const List<BoxShadow> e2 = [
    BoxShadow(color: Color(0x29000000), offset: Offset(0, 8), blurRadius: 24) // rgba(0,0,0,.16) -> 0x29
  ];
}

ThemeData buildTheme(bool isDark) {
  final Color background = isDark ? AppColors.backgroundDark : AppColors.backgroundLight;
  final Color surface = isDark ? AppColors.surfaceDark : AppColors.surfaceLight;
  final Color surfaceAlt = isDark ? AppColors.surfaceAltDark : AppColors.surfaceAltLight;
  final Color primary = isDark ? AppColors.primaryDark : AppColors.primaryLight;
  final Color onPrimary = isDark ? AppColors.onPrimaryDark : AppColors.onPrimaryLight;
  final Color accent = isDark ? AppColors.accentDark : AppColors.accentLight;
  final Color text = isDark ? AppColors.textDark : AppColors.textLight;
  final Color textMuted = isDark ? AppColors.textMutedDark : AppColors.textMutedLight;
  final Color outline = isDark ? AppColors.outlineDark : AppColors.outlineLight;
  final Color success = isDark ? AppColors.successDark : AppColors.successLight;

  final TextTheme textTheme = TextTheme(
    displayLarge: TextStyle(fontFamily: 'Inter', fontSize: 32, height: 40/32, fontWeight: FontWeight.w700, color: text),
    titleLarge: TextStyle(fontFamily: 'Inter', fontSize: 22, height: 28/22, fontWeight: FontWeight.w600, color: text),
    bodyLarge: TextStyle(fontFamily: 'Inter', fontSize: 16, height: 24/16, fontWeight: FontWeight.w400, color: text),
    labelLarge: TextStyle(fontFamily: 'Inter', fontSize: 13, height: 16/13, fontWeight: FontWeight.w500, color: text),
    bodySmall: TextStyle(fontFamily: 'Inter', fontSize: 12, height: 16/12, fontWeight: FontWeight.w400, color: textMuted),
  );

  return ThemeData(
    brightness: isDark ? Brightness.dark : Brightness.light,
    scaffoldBackgroundColor: background,
    primaryColor: primary,
    colorScheme: ColorScheme(
      brightness: isDark ? Brightness.dark : Brightness.light,
      primary: primary,
      onPrimary: onPrimary,
      secondary: accent,
      onSecondary: Colors.white,
      error: Colors.red,
      onError: Colors.white,
      surface: surface,
      onSurface: text,
      outline: outline,
      surfaceContainerHighest: surfaceAlt, // used for hover/alt states
    ),
    textTheme: textTheme,
    fontFamily: 'Inter',
    extensions: <ThemeExtension<dynamic>>[
      CustomColors(success: success, textMuted: textMuted, surfaceAlt: surfaceAlt),
    ],
    appBarTheme: AppBarTheme(
      backgroundColor: background, // Note: Spec says app bar is surface on scroll, background otherwise. We will manage this manually or use scrolledUnderElevation.
      foregroundColor: text,
      elevation: 0,
    ),
    useMaterial3: true,
  );
}

class CustomColors extends ThemeExtension<CustomColors> {
  final Color? success;
  final Color? textMuted;
  final Color? surfaceAlt;

  CustomColors({this.success, this.textMuted, this.surfaceAlt});

  @override
  CustomColors copyWith({Color? success, Color? textMuted, Color? surfaceAlt}) {
    return CustomColors(
      success: success ?? this.success,
      textMuted: textMuted ?? this.textMuted,
      surfaceAlt: surfaceAlt ?? this.surfaceAlt,
    );
  }

  @override
  CustomColors lerp(ThemeExtension<CustomColors>? other, double t) {
    if (other is! CustomColors) {
      return this;
    }
    return CustomColors(
      success: Color.lerp(success, other.success, t),
      textMuted: Color.lerp(textMuted, other.textMuted, t),
      surfaceAlt: Color.lerp(surfaceAlt, other.surfaceAlt, t),
    );
  }
}

class ThemeController extends ChangeNotifier {
  bool _isDark = false;
  bool get isDark => _isDark;

  void toggle() {
    _isDark = !_isDark;
    notifyListeners();
  }
}
