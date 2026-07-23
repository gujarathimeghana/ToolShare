import 'user_model.dart';

class ToolModel {
  final String id;
  final String title;
  final String description;
  final String categoryName;
  final List<String> images;
  final double pricePerDay;
  final double securityDeposit;
  final String condition;
  final String address;
  final double lat;
  final double lng;
  final UserModel? owner;
  final String ownerId;
  final double rating;

  ToolModel({
    required this.id,
    required this.title,
    required this.description,
    required this.categoryName,
    required this.images,
    required this.pricePerDay,
    required this.securityDeposit,
    required this.condition,
    required this.address,
    required this.lat,
    required this.lng,
    this.owner,
    required this.ownerId,
    required this.rating,
  });

  factory ToolModel.fromJson(Map<String, dynamic> json) {
    List<String> imgList = [];
    if (json['images'] != null) {
      imgList = List<String>.from(json['images']);
    }

    final loc = json['location'] ?? {};
    final coords = loc['coordinates'] ?? [-73.935242, 40.73061];
    final ownerObj = json['owner'] != null && json['owner'] is Map ? UserModel.fromJson(json['owner']) : null;
    final ownerStrId = json['owner'] is String ? json['owner'] : (ownerObj?.id ?? '');

    return ToolModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      categoryName: json['category'] != null && json['category'] is Map ? json['category']['name'] ?? 'Tool' : 'Tool',
      images: imgList,
      pricePerDay: (json['pricePerDay'] ?? 0).toDouble(),
      securityDeposit: (json['securityDeposit'] ?? 0).toDouble(),
      condition: json['condition'] ?? 'Good',
      address: loc['address'] ?? 'Local Neighborhood',
      lat: (coords[1] ?? 40.73061).toDouble(),
      lng: (coords[0] ?? -73.935242).toDouble(),
      owner: ownerObj,
      ownerId: ownerStrId,
      rating: (json['rating'] ?? 5.0).toDouble(),
    );
  }
}
