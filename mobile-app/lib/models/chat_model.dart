import 'user_model.dart';

class MessageModel {
  final String id;
  final String chatId;
  final String senderId;
  final String recipientId;
  final String text;
  final DateTime createdAt;

  MessageModel({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.recipientId,
    required this.text,
    required this.createdAt,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      id: json['_id'] ?? '',
      chatId: json['chat'] ?? '',
      senderId: json['sender'] is Map ? json['sender']['_id'] : (json['sender'] ?? ''),
      recipientId: json['recipient'] is Map ? json['recipient']['_id'] : (json['recipient'] ?? ''),
      text: json['text'] ?? '',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }
}
