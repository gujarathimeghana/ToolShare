import 'tool_model.dart';
import 'user_model.dart';

class BookingModel {
  final String id;
  final ToolModel? tool;
  final UserModel? renter;
  final UserModel? owner;
  final DateTime startDate;
  final DateTime endDate;
  final double totalPrice;
  final String status;
  final String paymentOption;

  BookingModel({
    required this.id,
    this.tool,
    this.renter,
    this.owner,
    required this.startDate,
    required this.endDate,
    required this.totalPrice,
    required this.status,
    required this.paymentOption,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['_id'] ?? '',
      tool: json['tool'] != null && json['tool'] is Map ? ToolModel.fromJson(json['tool']) : null,
      renter: json['renter'] != null && json['renter'] is Map ? UserModel.fromJson(json['renter']) : null,
      owner: json['owner'] != null && json['owner'] is Map ? UserModel.fromJson(json['owner']) : null,
      startDate: DateTime.tryParse(json['startDate'] ?? '') ?? DateTime.now(),
      endDate: DateTime.tryParse(json['endDate'] ?? '') ?? DateTime.now(),
      totalPrice: (json['totalPrice'] ?? 0).toDouble(),
      status: json['status'] ?? 'pending',
      paymentOption: json['paymentOption'] ?? 'cash_on_pickup',
    );
  }
}
