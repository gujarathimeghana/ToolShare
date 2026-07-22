import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../core/api_client.dart';
import '../models/tool_model.dart';

class ToolProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  List<ToolModel> _tools = [];
  bool _isLoading = false;
  String? _error;

  List<ToolModel> get tools => _tools;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchTools({String search = '', String category = ''}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.get('/tools', queryParameters: {
        if (search.isNotEmpty) 'search': search,
        if (category.isNotEmpty) 'category': category,
      });

      if (response.data != null && response.data['success'] == true) {
        final List list = response.data['data'] ?? [];
        _tools = list.map((item) => ToolModel.fromJson(item)).toList();
      }
    } catch (e) {
      _error = 'Failed to load tools';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createTool(Map<String, dynamic> toolData) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.post('/tools', data: toolData);

      if (response.data != null && (response.statusCode == 200 || response.statusCode == 201) && response.data['success'] == true) {
        await fetchTools();
        _isLoading = false;
        notifyListeners();
        return true;
      } else if (response.data != null && response.data['message'] != null) {
        _error = response.data['message'];
      } else {
        _error = 'Failed to list tool (Server error ${response.statusCode})';
      }
    } on DioException catch (e) {
      if (e.response != null && e.response?.data != null && e.response?.data['message'] != null) {
        _error = e.response?.data['message'];
      } else {
        _error = e.message ?? 'Network connection error while listing tool';
      }
    } catch (e) {
      _error = 'Error listing tool: $e';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }
}
