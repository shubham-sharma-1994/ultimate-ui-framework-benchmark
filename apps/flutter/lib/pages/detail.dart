import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/physics.dart';
import 'dart:math';
import '../theme.dart';
import '../data_model.dart';

class DetailPage extends StatefulWidget {
  final int id;
  const DetailPage({super.key, required this.id});

  @override
  State<DetailPage> createState() => _DetailPageState();
}

class _DetailPageState extends State<DetailPage> with TickerProviderStateMixin {
  ListItemData? _item;
  final ScrollController _scrollController = ScrollController();

  late AnimationController _ringController;
  late AnimationController _shimmerController;
  late AnimationController _accordionController;
  late Animation<double> _accordionHeight;
  late Animation<double> _accordionIconRotation;

  bool _accordionExpanded = false;
  bool _showText = false;

  final List<int> _swipeItems = [1, 2, 3];

  // Draggable physics
  Offset _dragPosition = Offset.zero;

  @override
  void initState() {
    super.initState();
    _loadData();

    _ringController = AnimationController(vsync: this, duration: AppMotion.slow);
    _shimmerController = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))..repeat();

    _accordionController = AnimationController(vsync: this, duration: AppMotion.base);
    _accordionHeight = CurvedAnimation(parent: _accordionController, curve: AppMotion.baseCurve);
    _accordionIconRotation = Tween<double>(begin: 0, end: 0.5).animate(CurvedAnimation(parent: _accordionController, curve: AppMotion.baseCurve));

    Future.delayed(const Duration(milliseconds: 1500), () {
      if (mounted) setState(() => _showText = true);
    });
  }

  Future<void> _loadData() async {
    final jsonString = await rootBundle.loadString('assets/data.json');
    final data = json.decode(jsonString);
    final items = (data['items'] as List).map((i) => ListItemData.fromJson(i)).toList();
    setState(() {
      _item = items.firstWhere((e) => e.id == widget.id, orElse: () => items.first);
    });
    _ringController.forward();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _ringController.dispose();
    _shimmerController.dispose();
    _accordionController.dispose();
    super.dispose();
  }

  void _onPanUpdate(DragUpdateDetails details) {
    setState(() {
      _dragPosition += details.delta;
    });
  }

  void _onPanEnd(DragEndDetails details) {
    // Spring physics back to center
    // We create a Simulation for x and y
    final spring = AppMotion.spring;

    final xSimulation = SpringSimulation(spring, _dragPosition.dx, 0, details.velocity.pixelsPerSecond.dx);
    final ySimulation = SpringSimulation(spring, _dragPosition.dy, 0, details.velocity.pixelsPerSecond.dy);

    final xController = AnimationController(vsync: this, lowerBound: double.negativeInfinity, upperBound: double.infinity);
    final yController = AnimationController(vsync: this, lowerBound: double.negativeInfinity, upperBound: double.infinity);

    xController.addListener(() {
      if (mounted) setState(() => _dragPosition = Offset(xController.value, _dragPosition.dy));
    });
    yController.addListener(() {
      if (mounted) setState(() => _dragPosition = Offset(_dragPosition.dx, yController.value));
    });

    xController.animateWith(xSimulation).then((_) => xController.dispose());
    yController.animateWith(ySimulation).then((_) => yController.dispose());
  }

  void _showDialog() {
    showDialog(
      context: context,
      barrierColor: Colors.black.withValues(alpha: 0.4),
      builder: (context) {
        return TweenAnimationBuilder<double>(
          tween: Tween<double>(begin: 0.0, end: 1.0),
          duration: AppMotion.base,
          curve: AppMotion.baseCurve,
          builder: (context, val, child) {
            return Transform.scale(
              scale: 0.9 + 0.1 * val,
              child: Opacity(
                opacity: val,
                child: child,
              ),
            );
          },
          child: AlertDialog(
            backgroundColor: Theme.of(context).colorScheme.surface,
            title: const Text('Dialog Title'),
            content: const Text('This is a modal dialog.'),
            actions: [
              TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close'))
            ],
          ),
        );
      },
    );
  }

  void _showSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).colorScheme.surface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadii.sheetTop))),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          height: 300,
          child: Column(
            children: [
              Container(width: 40, height: 4, decoration: BoxDecoration(color: Theme.of(context).colorScheme.outline, borderRadius: BorderRadius.circular(2))),
              const SizedBox(height: 24),
              const Text('Bottom Sheet Content'),
            ],
          ),
        );
      },
    );
  }

  void _showToast() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('This is a toast'),
        duration: Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_item == null) return const Scaffold();

    final theme = Theme.of(context);
    final c1 = Color(int.parse(_item!.colors[0].replaceFirst('#', '0xFF')));
    final c2 = Color(int.parse(_item!.colors[1].replaceFirst('#', '0xFF')));

    return Scaffold(
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          SliverAppBar(
            expandedHeight: 240,
            pinned: true,
            leading: IconButton(
              key: const Key('back'),
              icon: const Icon(Icons.arrow_back),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: LayoutBuilder(
              builder: (context, constraints) {
                final double percent = (constraints.maxHeight - 56) / (240 - 56);
                final double clampedPercent = percent.clamp(0.0, 1.0);
                return FlexibleSpaceBar(
                  title: Text(
                    _item!.title,
                    style: TextStyle(
                      color: Color.lerp(theme.colorScheme.onSurface, Colors.white, clampedPercent),
                      fontSize: Tween<double>(begin: 20, end: 32).transform(clampedPercent),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  titlePadding: EdgeInsets.only(
                    left: Tween<double>(begin: 72, end: 16).transform(1-clampedPercent),
                    bottom: 16,
                  ),
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      Hero(
                        tag: 'hero-${_item!.id}',
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(colors: [c1, c2]),
                          ),
                        ),
                      ),
                      // Parallax simulation by offsetting child based on scroll
                      AnimatedBuilder(
                        animation: _scrollController,
                        builder: (context, child) {
                          double offset = 0;
                          if (_scrollController.hasClients) {
                            offset = _scrollController.offset * 0.5;
                          }
                          return Positioned(
                            top: -offset,
                            left: 0,
                            right: 0,
                            bottom: offset,
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [Colors.transparent, Colors.black.withValues(alpha: 0.6)],
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildProgressRing(theme),
                  const SizedBox(height: 24),
                  _buildAccordion(theme),
                  const SizedBox(height: 24),
                  _buildDraggableCard(theme),
                  const SizedBox(height: 24),
                  _buildSwipeList(theme),
                  const SizedBox(height: 24),
                  _buildButtonsRow(theme),
                  const SizedBox(height: 24),
                  _buildBodyText(theme),
                  const SizedBox(height: 100), // bottom padding
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressRing(ThemeData theme) {
    return GestureDetector(
      onTap: () {
        _ringController.forward(from: 0.0);
      },
      child: Center(
        child: SizedBox(
          width: 120,
          height: 120,
          child: AnimatedBuilder(
            animation: _ringController,
            builder: (context, child) {
              final val = CurvedAnimation(parent: _ringController, curve: AppMotion.slowCurve).value;
              final currentScore = (_item!.score * val).round();
              return CustomPaint(
                key: const Key('ring'),
                painter: RingPainter(
                  progress: val,
                  score: _item!.score / 100.0,
                  color: theme.primaryColor,
                  bgColor: theme.colorScheme.outline,
                ),
                child: Center(
                  child: Text('$currentScore%', style: theme.textTheme.titleLarge),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildAccordion(ThemeData theme) {
    return Container(
      key: const Key('accordion'),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(AppRadii.card),
        boxShadow: AppShadows.e1,
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () {
              setState(() => _accordionExpanded = !_accordionExpanded);
              if (_accordionExpanded) {
                _accordionController.forward();
              } else {
                _accordionController.reverse();
              }
            },
            borderRadius: BorderRadius.circular(AppRadii.card),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Details', style: theme.textTheme.titleLarge?.copyWith(fontSize: 18)),
                  RotationTransition(
                    turns: _accordionIconRotation,
                    child: const Icon(Icons.expand_more),
                  ),
                ],
              ),
            ),
          ),
          SizeTransition(
            sizeFactor: _accordionHeight,
            child: Padding(
              padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
              child: FadeTransition(
                // Content fades in last 50%
                opacity: Tween<double>(begin: -1.0, end: 1.0).animate(_accordionHeight).drive(CurveTween(curve: Curves.easeIn)).drive(Tween<double>(begin: 0, end: 1)),
                child: Text('This is the expandable content. It animates height first and fades in at the end.', style: theme.textTheme.bodyLarge),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDraggableCard(ThemeData theme) {
    return Container(
      height: 240, // Play area
      width: double.infinity,
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(AppRadii.card),
      ),
      clipBehavior: Clip.hardEdge,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Transform.translate(
            offset: _dragPosition,
            child: GestureDetector(
              onPanUpdate: _onPanUpdate,
              onPanEnd: _onPanEnd,
              child: Container(
                key: const Key('drag-card'),
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  color: theme.colorScheme.secondary,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: AppShadows.e2,
                ),
                child: const Center(child: Icon(Icons.drag_indicator, color: Colors.white)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSwipeList(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_swipeItems.isEmpty)
          TextButton(
            key: const Key('swipe-reset'),
            onPressed: () => setState(() {
              _swipeItems.addAll([1, 2, 3]);
            }),
            child: const Text('Reset'),
          ),
        ..._swipeItems.map((id) {
          return Dismissible(
            key: Key('swipe-$id'),
            direction: DismissDirection.endToStart,
            dismissThresholds: const {DismissDirection.endToStart: 0.4},
            onDismissed: (_) {
              setState(() {
                _swipeItems.remove(id);
              });
            },
            background: Container(
              color: const Color(0xFFE5484D),
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: 16),
              child: const Icon(Icons.delete, color: Colors.white),
            ),
            child: ListTile(
              title: Text('Swipe item $id'),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildButtonsRow(ThemeData theme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        ElevatedButton(key: const Key('btn-dialog'), onPressed: _showDialog, child: const Text('Dialog')),
        ElevatedButton(key: const Key('btn-sheet'), onPressed: _showSheet, child: const Text('Sheet')),
        ElevatedButton(key: const Key('btn-toast'), onPressed: _showToast, child: const Text('Toast')),
      ],
    );
  }

  Widget _buildBodyText(ThemeData theme) {
    return AnimatedSwitcher(
      duration: AppMotion.base,
      child: _showText
          ? Text(
              _item!.body,
              key: const ValueKey('text'),
              style: theme.textTheme.bodyLarge,
            )
          : SizedBox(
              key: const Key('shimmer'),
              width: double.infinity,
              child: AnimatedBuilder(
                animation: _shimmerController,
                builder: (context, child) {
                  return ShaderMask(
                    blendMode: BlendMode.srcATop,
                    shaderCallback: (bounds) {
                      return LinearGradient(
                        colors: [
                          theme.colorScheme.outline.withValues(alpha: 0.2),
                          theme.colorScheme.outline.withValues(alpha: 0.6),
                          theme.colorScheme.outline.withValues(alpha: 0.2),
                        ],
                        stops: const [0.0, 0.5, 1.0],
                        begin: Alignment(-1.0 + (_shimmerController.value * 2), 0),
                        end: Alignment(0.0 + (_shimmerController.value * 2), 0),
                      ).createShader(bounds);
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(height: 16, width: double.infinity, color: Colors.white),
                        const SizedBox(height: 8),
                        Container(height: 16, width: double.infinity, color: Colors.white),
                        const SizedBox(height: 8),
                        Container(height: 16, width: 200, color: Colors.white),
                      ],
                    ),
                  );
                },
              ),
            ),
    );
  }
}

class RingPainter extends CustomPainter {
  final double progress;
  final double score;
  final Color color;
  final Color bgColor;

  RingPainter({required this.progress, required this.score, required this.color, required this.bgColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width / 2) - 6;

    final bgPaint = Paint()
      ..color = bgColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 12;

    canvas.drawCircle(center, radius, bgPaint);

    final activePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 12
      ..strokeCap = StrokeCap.round;

    final sweepAngle = 2 * pi * score * progress;
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), -pi / 2, sweepAngle, false, activePaint);
  }

  @override
  bool shouldRepaint(RingPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.score != score;
  }
}
