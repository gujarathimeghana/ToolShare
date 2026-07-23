class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String avatar;
  final String role;
  final bool isHelper;
  final double rating;
  final Map<String, dynamic> location;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.avatar,
    required this.role,
    required this.isHelper,
    required this.rating,
    required this.location,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      avatar: json['avatar'] ?? '',
      role: json['role'] ?? 'user',
      isHelper: json['isHelper'] ?? false,
      rating: (json['rating'] ?? 5.0).toDouble(),
      location: json['location'] is Map ? json['location'] : {},
    );
  }
}
