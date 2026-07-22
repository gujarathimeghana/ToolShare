import 'package:flutter/material.dart';
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

      if (response.data['success'] == true) {
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
      if (response.data['success'] == true) {
        await fetchTools();
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response.data['message'] ?? 'Failed to list tool';
      }
    } catch (e) {
      _error = 'Network or server error while listing tool';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }
}
