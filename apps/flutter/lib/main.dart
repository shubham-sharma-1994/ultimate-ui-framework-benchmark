import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/physics.dart'; // Add physics import
import 'dart:convert';
import 'theme.dart';
import 'pages/showcase.dart';
import 'pages/detail.dart';

void main() {
  runApp(const PulseApp());
}

class PulseApp extends StatefulWidget {
  const PulseApp({super.key});

  @override
  State<PulseApp> createState() => _PulseAppState();
}

class _PulseAppState extends State<PulseApp> with SingleTickerProviderStateMixin {
  final ThemeController _themeController = ThemeController();

  @override
  void initState() {
    super.initState();
    _themeController.addListener(_onThemeChanged);
  }

  @override
  void dispose() {
    _themeController.removeListener(_onThemeChanged);
    _themeController.dispose();
    super.dispose();
  }

  void _onThemeChanged() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedTheme(
      data: buildTheme(_themeController.isDark),
      duration: AppMotion.slow,
      curve: AppMotion.slowCurve,
      child: Builder(
        builder: (context) {
          return MaterialApp(
            title: 'Pulse',
            theme: buildTheme(_themeController.isDark), // Inherit animated theme indirectly
            // The router config for deep linking
            onGenerateRoute: (settings) {
              if (settings.name == '/') {
                return _createRoute(ShowcasePage(themeController: _themeController));
              }
              final uri = Uri.parse(settings.name ?? '');
              if (uri.pathSegments.length == 2 && uri.pathSegments.first == 'detail') {
                final id = int.tryParse(uri.pathSegments[1]) ?? 1;
                return _createRoute(DetailPage(id: id));
              }
              return null;
            },
            builder: (context, child) {
              // Apply max-width 480 and center it for wide screens
              return AnimatedTheme(
                data: buildTheme(_themeController.isDark),
                duration: AppMotion.slow,
                curve: AppMotion.slowCurve,
                child: Container(
                  color: Theme.of(context).scaffoldBackgroundColor, // Ensure full window bg
                  alignment: Alignment.topCenter,
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 480),
                    child: child,
                  ),
                ),
              );
            },
          );
        }
      ),
    );
  }

  Route _createRoute(Widget page) {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        // C05: Page transition (slide + fade, reversible)
        // Forward: Page 2 slides in from right 30 % width + fade 0->1, base
        // Page 1 slides left 10 % + fades to 0.6

        final isForward = animation.status == AnimationStatus.forward || animation.status == AnimationStatus.completed;
        final curve = CurvedAnimation(parent: animation, curve: AppMotion.baseCurve, reverseCurve: AppMotion.baseCurve.flipped);

        return AnimatedBuilder(
          animation: animation,
          builder: (context, child) {
            // we are either the new page entering, or the old page exiting
            // PageRouteBuilder gives us `animation` for our entry/exit, and `secondaryAnimation` for the next page over us.
            return Stack(
              children: [
                // If we are pushing a new page, `secondaryAnimation` handles our exit
                if (secondaryAnimation.status != AnimationStatus.dismissed)
                  SlideTransition(
                    position: Tween<Offset>(begin: Offset.zero, end: const Offset(-0.1, 0)).animate(CurvedAnimation(parent: secondaryAnimation, curve: AppMotion.baseCurve, reverseCurve: AppMotion.baseCurve.flipped)),
                    child: FadeTransition(
                      opacity: Tween<double>(begin: 1.0, end: 0.6).animate(CurvedAnimation(parent: secondaryAnimation, curve: AppMotion.baseCurve, reverseCurve: AppMotion.baseCurve.flipped)),
                      child: child,
                    ),
                  )
                else
                  // We are entering/exiting
                  SlideTransition(
                    position: Tween<Offset>(begin: const Offset(0.3, 0), end: Offset.zero).animate(curve),
                    child: FadeTransition(
                      opacity: curve,
                      child: child,
                    ),
                  ),
              ],
            );
          },
          child: child,
        );
      },
      transitionDuration: AppMotion.base,
      reverseTransitionDuration: AppMotion.base,
    );
  }
}
