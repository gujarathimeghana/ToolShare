import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/tool_model.dart';
import '../../providers/booking_provider.dart';
import '../../providers/auth_provider.dart';

class ToolDetailsScreen extends StatefulWidget {
  final ToolModel tool;

  const ToolDetailsScreen({Key? key, required this.tool}) : super(key: key);

  @override
  State<ToolDetailsScreen> createState() => _ToolDetailsScreenState();
}

class _ToolDetailsScreenState extends State<ToolDetailsScreen> {
  DateTime _startDate = DateTime.now();
  DateTime _endDate = DateTime.now().add(const Duration(days: 2));
  bool _isSubmitting = false;

  void _showRequestModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                top: 24,
                left: 24,
                right: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Borrow ${widget.tool.title}',
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 16),

                  ListTile(
                    tileColor: Colors.grey.withOpacity(0.1),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    leading: const Icon(Icons.calendar_today, color: Color(0xFF4F46E5)),
                    title: const Text('Start Date', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    subtitle: Text('${_startDate.year}-${_startDate.month}-${_startDate.day}'),
                    onTap: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: _startDate,
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 90)),
                      );
                      if (picked != null) {
                        setModalState(() => _startDate = picked);
                      }
                    },
                  ),
                  const SizedBox(height: 10),

                  ListTile(
                    tileColor: Colors.grey.withOpacity(0.1),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    leading: const Icon(Icons.event, color: Color(0xFF4F46E5)),
                    title: const Text('End Date', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    subtitle: Text('${_endDate.year}-${_endDate.month}-${_endDate.day}'),
                    onTap: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: _endDate,
                        firstDate: _startDate,
                        lastDate: DateTime.now().add(const Duration(days: 90)),
                      );
                      if (picked != null) {
                        setModalState(() => _endDate = picked);
                      }
                    },
                  ),
                  const SizedBox(height: 20),

                  ElevatedButton(
                    onPressed: _isSubmitting
                        ? null
                        : () async {
                            setModalState(() => _isSubmitting = true);
                            final bookingProvider = Provider.of<BookingProvider>(context, listen: false);
                            final success = await bookingProvider.createBooking(
                              toolId: widget.tool.id,
                              startDate: _startDate,
                              endDate: _endDate,
                            );
                            setModalState(() => _isSubmitting = false);

                            if (mounted) {
                              Navigator.pop(context);
                              if (success) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Request sent successfully to tool owner!'),
                                    backgroundColor: Colors.green,
                                  ),
                                );
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(bookingProvider.error ?? 'Failed to send request.'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              }
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4F46E5),
                      minimumSize: const Size.fromHeight(52),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: _isSubmitting
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('Confirm Borrow Request', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final isOwner = auth.user?.id == widget.tool.ownerId;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.tool.title, style: const TextStyle(fontWeight: FontWeight.w900)),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Image.network(
              widget.tool.images.isNotEmpty ? widget.tool.images[0] : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
              width: double.infinity,
              height: 250,
              fit: BoxFit.cover,
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF4F46E5).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(widget.tool.categoryName, style: const TextStyle(color: Color(0xFF4F46E5), fontWeight: FontWeight.bold)),
                      ),
                      Text('\$${widget.tool.pricePerDay.toStringAsFixed(0)} / day', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.green)),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(widget.tool.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 12),
                  Text(widget.tool.description, style: TextStyle(color: Colors.grey[700], fontSize: 14, height: 1.5)),
                  const SizedBox(height: 20),

                  // Location details box
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.indigo.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.indigo.withOpacity(0.1)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.location_on, color: Color(0xFF4F46E5)),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Location: ${widget.tool.address.isNotEmpty ? widget.tool.address : "New York, NY"}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),

                  if (isOwner)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.amber.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Center(
                        child: Text('You own this tool listing', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold)),
                      ),
                    )
                  else
                    ElevatedButton(
                      onPressed: _showRequestModal,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4F46E5),
                        minimumSize: const Size.fromHeight(54),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      ),
                      child: const Text('Request to Borrow Tool', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white)),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
