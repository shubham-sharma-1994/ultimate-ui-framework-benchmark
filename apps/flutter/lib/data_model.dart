class ListItemData {
  final int id;
  final String title;
  final String subtitle;
  final int score;
  final List<String> colors;
  final String body;

  ListItemData({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.score,
    required this.colors,
    required this.body,
  });

  factory ListItemData.fromJson(Map<String, dynamic> json) {
    return ListItemData(
      id: json['id'],
      title: json['title'],
      subtitle: json['subtitle'],
      score: json['score'],
      colors: List<String>.from(json['colors']),
      body: json['body'],
    );
  }
}
