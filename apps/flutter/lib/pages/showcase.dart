import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import '../theme.dart';
import '../data_model.dart';


class ShowcasePage extends StatefulWidget {
  final ThemeController themeController;
  const ShowcasePage({super.key, required this.themeController});

  @override
  State<ShowcasePage> createState() => _ShowcasePageState();
}

class _ShowcasePageState extends State<ShowcasePage> with TickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;
  int _counter = 0;
  bool _notificationsEnabled = false;
  double _intensity = 50.0;
  String _selectedChip = 'Low';
  final TextEditingController _nameController = TextEditingController();
  List<ListItemData> _items = [];

  late AnimationController _orbitController;
  late AnimationController _shakeController;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(() {
      final isScrolled = _scrollController.offset > 0;
      if (isScrolled != _isScrolled) {
        setState(() => _isScrolled = isScrolled);
      }
    });

    _orbitController = AnimationController(vsync: this, duration: const Duration(seconds: 3))..repeat();
    _shakeController = AnimationController(vsync: this, duration: const Duration(milliseconds: 300));

    _loadData();
  }

  Future<void> _loadData() async {
    final jsonString = await rootBundle.loadString('assets/data.json');
    final data = json.decode(jsonString);
    setState(() {
      _items = (data['items'] as List).map((i) => ListItemData.fromJson(i)).toList();
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _nameController.dispose();
    _orbitController.dispose();
    _shakeController.dispose();
    super.dispose();
  }

  void _incrementCounter() {
    setState(() => _counter++);
  }

  void _resetCounter() {
    setState(() => _counter = 0);
    _shakeController.forward(from: 0.0);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(56),
        child: AnimatedContainer(
          duration: AppMotion.fast,
          curve: AppMotion.fastCurve,
          decoration: BoxDecoration(
            color: _isScrolled ? theme.colorScheme.surface : Colors.transparent,
            boxShadow: _isScrolled ? AppShadows.e1 : [],
          ),
          child: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            title: const Text('Pulse'),
            actions: [
              IconButton(
                key: const Key('theme-toggle'),
                icon: AnimatedSwitcher(
                  duration: AppMotion.slow,
                  transitionBuilder: (child, anim) => RotationTransition(turns: Tween(begin: 0.5, end: 1.0).animate(anim), child: FadeTransition(opacity: anim, child: child)),
                  child: Icon(
                    widget.themeController.isDark ? Icons.nightlight_round : Icons.wb_sunny,
                    key: ValueKey(widget.themeController.isDark),
                  ),
                ),
                onPressed: widget.themeController.toggle,
              ),
            ],
          ),
        ),
      ),
      body: ListView(
        controller: _scrollController,
        padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top + 56 + 16, left: 16, right: 16, bottom: 32),
        children: [
          _buildHeroCard(theme),
          const SizedBox(height: 16),
          _buildCounterRow(theme),
          const SizedBox(height: 16),
          _buildControlsCard(theme),
          const SizedBox(height: 16),
          _buildTextField(theme),
          const SizedBox(height: 16),
          if (_items.isNotEmpty) _buildList(theme),
        ],
      ),
    );
  }

  Widget _buildHeroCard(ThemeData theme) {
    return Container(
      height: 180,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppRadii.card),
        gradient: LinearGradient(
          colors: [theme.primaryColor, theme.colorScheme.secondary],
          begin: Alignment.topLeft, // roughly 135deg depending on aspect
          end: Alignment.bottomRight,
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            left: 24,
            bottom: 24,
            child: Text('Same app. Every framework.', style: theme.textTheme.titleLarge?.copyWith(color: Colors.white)),
          ),
          Positioned(
            right: 40,
            top: 40,
            child: AnimatedBuilder(
              animation: _orbitController,
              builder: (context, child) {
                return CustomPaint(
                  key: const Key('orbit'),
                  size: const Size(80, 80), // radius 40
                  painter: OrbitPainter(progress: _orbitController.value),
                );
              },
            ),
          )
        ],
      ),
    );
  }

  Widget _buildCounterRow(ThemeData theme) {
    return AnimatedBuilder(
      animation: _shakeController,
      builder: (context, child) {
        // Shake: ±6px, 3 oscillations
        final sineValue = sin(_shakeController.value * 3 * pi * 2);
        final offset = Offset(sineValue * 6, 0);
        return Transform.translate(
          offset: offset,
          child: child,
        );
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Taps', style: theme.textTheme.labelLarge),
              AnimatedSwitcher(
                duration: AppMotion.base,
                transitionBuilder: (child, animation) {
                  return SlideTransition(
                    position: Tween<Offset>(begin: const Offset(0, 1), end: Offset.zero).animate(animation),
                    child: FadeTransition(opacity: animation, child: child),
                  );
                },
                layoutBuilder: (currentChild, previousChildren) => Stack(
                  alignment: Alignment.centerLeft,
                  children: <Widget>[
                    ...previousChildren,
                    if (currentChild != null) currentChild,
                  ],
                ),
                child: Text('$_counter', key: ValueKey(_counter), style: theme.textTheme.displayLarge),
              ),
            ],
          ),
          GestureDetector(
            onLongPress: _resetCounter,
            child: TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 1.0, end: 1.0), // Need a pressed state handle
              duration: AppMotion.fast,
              builder: (context, scale, child) {
                return Transform.scale(scale: scale, child: child);
              },
              child: FloatingActionButton(
                key: const Key('counter-inc'),
                onPressed: _incrementCounter,
                backgroundColor: theme.primaryColor,
                child: Icon(Icons.add, color: theme.colorScheme.onPrimary),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildControlsCard(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(AppRadii.card),
        boxShadow: AppShadows.e1,
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Notifications', style: theme.textTheme.bodyLarge),
              Switch(
                key: const Key('switch'),
                value: _notificationsEnabled,
                onChanged: (v) => setState(() => _notificationsEnabled = v),
                // ignore: deprecated_member_use
                activeColor: theme.primaryColor,
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Intensity', style: theme.textTheme.bodyLarge),
              Text('${_intensity.round()}', style: theme.textTheme.labelLarge),
            ],
          ),
          Slider(
            key: const Key('slider'),
            value: _intensity,
            min: 0,
            max: 100,
            onChanged: (v) => setState(() => _intensity = v),
            // ignore: deprecated_member_use
            activeColor: theme.primaryColor,
          ),
          const SizedBox(height: 16),
          Row(
            children: ['Low', 'Medium', 'High'].map((label) {
              final isSelected = _selectedChip == label;
              return Padding(
                padding: const EdgeInsets.only(right: 8.0),
                child: ChoiceChip(
                  key: Key('chip-${label.toLowerCase()}'),
                  label: Text(label),
                  selected: isSelected,
                  onSelected: (v) => setState(() => _selectedChip = label),
                  selectedColor: theme.primaryColor,
                  labelStyle: TextStyle(color: isSelected ? theme.colorScheme.onPrimary : theme.textTheme.bodyLarge?.color),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadii.chip)),
                  showCheckmark: false,
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          key: const Key('name-input'),
          controller: _nameController,
          onChanged: (v) => setState(() {}),
          decoration: InputDecoration(
            labelText: 'Your name',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppRadii.input)),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadii.input),
              borderSide: BorderSide(color: theme.primaryColor, width: 2),
            ),
          ),
        ),
        const SizedBox(height: 8),
        AnimatedSwitcher(
          duration: AppMotion.fast,
          child: _nameController.text.isNotEmpty
              ? Text('Hello, ${_nameController.text}', key: ValueKey(_nameController.text), style: theme.textTheme.bodyLarge)
              : const SizedBox.shrink(),
        ),
      ],
    );
  }

  Widget _buildList(ThemeData theme) {
    return Column(
      children: List.generate(_items.length, (index) {
        final item = _items[index];
        return _StaggeredListItem(
          index: index,
          item: item,
          onTap: () {
            Navigator.pushNamed(context, '/detail/${item.id}');
          },
        );
      }),
    );
  }
}

class _StaggeredListItem extends StatefulWidget {
  final int index;
  final ListItemData item;
  final VoidCallback onTap;

  const _StaggeredListItem({required this.index, required this.item, required this.onTap});

  @override
  State<_StaggeredListItem> createState() => _StaggeredListItemState();
}

class _StaggeredListItemState extends State<_StaggeredListItem> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fade;
  late Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: AppMotion.slow);
    _fade = Tween<double>(begin: 0.0, end: 1.0).animate(CurvedAnimation(parent: _controller, curve: AppMotion.slowCurve));
    // slide up 24px (assuming row height is roughly 72px, 24px is 1/3 of it. Using absolute pixels in SlideTransition requires custom transform, or relative offset. Offset(0, 0.5) is half height.)
    _slide = Tween<Offset>(begin: const Offset(0, 0.5), end: Offset.zero).animate(CurvedAnimation(parent: _controller, curve: AppMotion.slowCurve));

    Future.delayed(Duration(milliseconds: widget.index * 50), () {
      if (mounted) _controller.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final c1 = Color(int.parse(widget.item.colors[0].replaceFirst('#', '0xFF')));
    final c2 = Color(int.parse(widget.item.colors[1].replaceFirst('#', '0xFF')));

    return SlideTransition(
      position: _slide,
      child: FadeTransition(
        opacity: _fade,
        child: ListTile(
          key: Key('item-${widget.item.id}'),
          contentPadding: EdgeInsets.zero,
          leading: Hero(
            tag: 'hero-${widget.item.id}',
            flightShuttleBuilder: (flightContext, animation, flightDirection, fromHeroContext, toHeroContext) {
              return AnimatedBuilder(
                animation: animation,
                builder: (context, child) {
                  return Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      gradient: LinearGradient(colors: [c1, c2]),
                    ),
                  );
                },
              );
            },
            child: Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: LinearGradient(colors: [c1, c2]),
              ),
            ),
          ),
          title: Text(widget.item.title, style: theme.textTheme.titleLarge?.copyWith(fontSize: 16)), // using roughly bodyLarge size for title
          subtitle: Text(widget.item.subtitle, style: theme.textTheme.bodySmall),
          trailing: const Icon(Icons.chevron_right),
          onTap: widget.onTap,
        ),
      ),
    );
  }
}

class OrbitPainter extends CustomPainter {
  final double progress;

  OrbitPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final ringPaint = Paint()
      ..color = Colors.white.withValues(alpha:(0.3))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    canvas.drawCircle(center, 40, ringPaint);

    final dotPaint = Paint()..color = Colors.white;
    for (int i = 0; i < 3; i++) {
      final angle = (progress * 2 * pi) + (i * 2 * pi / 3);
      final dx = center.dx + 40 * cos(angle);
      final dy = center.dy + 40 * sin(angle);
      canvas.drawCircle(Offset(dx, dy), 6, dotPaint);
    }
  }

  @override
  bool shouldRepaint(OrbitPainter oldDelegate) => oldDelegate.progress != progress;
}
