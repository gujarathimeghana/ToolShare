import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import '../../providers/tool_provider.dart';

class NearbyMapScreen extends StatelessWidget {
  const NearbyMapScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final toolProvider = Provider.of<ToolProvider>(context);

    final markers = toolProvider.tools.map((tool) {
      return Marker(
        point: LatLng(tool.lat, tool.lng),
        width: 40,
        height: 40,
        child: const Icon(Icons.location_on, color: Color(0xFF4F46E5), size: 36),
      );
    }).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Nearby Proximity Map')),
      body: FlutterMap(
        options: const MapOptions(
          initialCenter: LatLng(40.73061, -73.935242),
          initialZoom: 12.0,
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            userAgentPackageName: 'com.neighborly.app',
          ),
          MarkerLayer(markers: markers),
        ],
      ),
    );
  }
}
