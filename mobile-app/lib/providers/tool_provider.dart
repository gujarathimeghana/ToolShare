import 'package:flutter/material.dart';
import '../core/api_client.dart';
import '../models/tool_model.dart';

class ToolProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  List<ToolModel> _tools = [];
  bool _isLoading = false;

  List<ToolModel> get tools => _tools;
  bool get isLoading => _isLoading;

  Future<void> fetchTools({String search = '', String category = ''}) async {
    _isLoading = true;
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
      print('Fetch tools error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createTool(Map<String, dynamic> toolData) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiClient.dio.post('/tools', data: toolData);
      if (response.data['success'] == true) {
        await fetchTools();
        return true;
      }
    } catch (e) {
      print('Create tool error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return false;
  }
}
