import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../core/api_client.dart';

class BookingModel {
  final String id;
  final String toolTitle;
  final String toolImage;
  final double totalPrice;
  final String paymentOption;
  final String status;
  final String renterName;
  final String renterPhone;
  final String ownerName;
  final String ownerPhone;
  final DateTime startDate;
  final DateTime endDate;

  BookingModel({
    required this.id,
    required this.toolTitle,
    required this.toolImage,
    required this.totalPrice,
    required this.paymentOption,
    required this.status,
    required this.renterName,
    required this.renterPhone,
    required this.ownerName,
    required this.ownerPhone,
    required this.startDate,
    required this.endDate,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    final tool = json['tool'] is Map ? json['tool'] : {};
    final renter = json['renter'] is Map ? json['renter'] : {};
    final owner = json['owner'] is Map ? json['owner'] : {};
    final images = (tool['images'] as List?) ?? [];

    return BookingModel(
      id: json['_id'] ?? '',
      toolTitle: tool['title'] ?? 'Tool',
      toolImage: images.isNotEmpty ? images[0] : 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600',
      totalPrice: (json['totalPrice'] ?? 0).toDouble(),
      paymentOption: json['paymentOption'] ?? 'cash_on_pickup',
      status: json['status'] ?? 'pending',
      renterName: renter['name'] ?? 'Neighbor',
      renterPhone: renter['phone'] ?? '',
      ownerName: owner['name'] ?? 'Neighbor',
      ownerPhone: owner['phone'] ?? '',
      startDate: DateTime.tryParse(json['startDate'] ?? '') ?? DateTime.now(),
      endDate: DateTime.tryParse(json['endDate'] ?? '') ?? DateTime.now(),
    );
  }
}

class BookingProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  List<BookingModel> _incomingRequests = [];
  List<BookingModel> _sentRequests = [];
  bool _isLoading = false;
  String? _error;

  List<BookingModel> get incomingRequests => _incomingRequests;
  List<BookingModel> get sentRequests => _sentRequests;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchBookings() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final resIncoming = await _apiClient.dio.get('/bookings?role=owner');
      if (resIncoming.data != null && resIncoming.data['success'] == true) {
        final List list = resIncoming.data['data'] ?? [];
        _incomingRequests = list.map((item) => BookingModel.fromJson(item)).toList();
      }

      final resSent = await _apiClient.dio.get('/bookings?role=renter');
      if (resSent.data != null && resSent.data['success'] == true) {
        final List list = resSent.data['data'] ?? [];
        _sentRequests = list.map((item) => BookingModel.fromJson(item)).toList();
      }
    } catch (e) {
      _error = 'Failed to load requests';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createBooking({
    required String toolId,
    required DateTime startDate,
    required DateTime endDate,
    String paymentOption = 'cash_on_pickup',
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.post('/bookings', data: {
        'toolId': toolId,
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
        'paymentOption': paymentOption,
      });

      if (response.data != null && (response.statusCode == 200 || response.statusCode == 201) && response.data['success'] == true) {
        await fetchBookings();
        return true;
      } else if (response.data != null && response.data['message'] != null) {
        _error = response.data['message'];
      } else {
        _error = 'Failed to send request';
      }
    } on DioException catch (e) {
      if (e.response != null && e.response?.data != null && e.response?.data['message'] != null) {
        _error = e.response?.data['message'];
      } else {
        _error = e.message ?? 'Network error while sending request';
      }
    } catch (e) {
      _error = 'Error sending request: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }

    return false;
  }

  Future<bool> updateStatus(String bookingId, String status) async {
    try {
      final response = await _apiClient.dio.put('/bookings/$bookingId/status', data: {
        'status': status,
      });

      if (response.data != null && response.data['success'] == true) {
        await fetchBookings();
        return true;
      }
    } catch (e) {
      print('Update status error: $e');
    }
    return false;
  }
}
