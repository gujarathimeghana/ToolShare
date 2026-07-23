import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/booking_provider.dart';

class RequestsScreen extends StatefulWidget {
  const RequestsScreen({Key? key}) : super(key: key);

  @override
  State<RequestsScreen> createState() => _RequestsScreenState();
}

class _RequestsScreenState extends State<RequestsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    Future.microtask(() => Provider.of<BookingProvider>(context, listen: false).fetchBookings());
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Widget _buildStatusBadge(String status) {
    Color bg;
    Color fg;
    String text;

    switch (status) {
      case 'approved':
      case 'active':
        bg = Colors.green.withOpacity(0.15);
        fg = Colors.green;
        text = 'ACCEPTED';
        break;
      case 'rejected':
        bg = Colors.red.withOpacity(0.15);
        fg = Colors.red;
        text = 'REJECTED';
        break;
      case 'completed':
        bg = Colors.blue.withOpacity(0.15);
        fg = Colors.blue;
        text = 'COMPLETED';
        break;
      case 'pending':
      default:
        bg = Colors.orange.withOpacity(0.15);
        fg = Colors.orange;
        text = 'PENDING';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
      child: Text(text, style: TextStyle(color: fg, fontSize: 11, fontWeight: FontWeight.w900)),
    );
  }

  Widget _buildRequestList(List<BookingModel> requests, bool isIncoming) {
    final bookingProvider = Provider.of<BookingProvider>(context, listen: false);

    if (requests.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(30.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(isIncoming ? Icons.inbox : Icons.send, size: 60, color: Colors.grey[400]),
              const SizedBox(height: 12),
              Text(
                isIncoming ? 'No incoming tool requests yet.' : 'You have not sent any tool requests.',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => bookingProvider.fetchBookings(),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: requests.length,
        itemBuilder: (context, index) {
          final req = requests[index];
          final isDark = Theme.of(context).brightness == Brightness.dark;

          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(isDark ? 0.3 : 0.05),
                  blurRadius: 15,
                  offset: const Offset(0, 6),
                )
              ],
              border: Border.all(color: Colors.indigo.withOpacity(0.1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        req.toolTitle,
                        style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    _buildStatusBadge(req.status),
                  ],
                ),
                const SizedBox(height: 8),

                Row(
                  children: [
                    const Icon(Icons.calendar_today_outlined, size: 14, color: Color(0xFF4F46E5)),
                    const SizedBox(width: 6),
                    Text(
                      'Dates: ${req.startDate.month}/${req.startDate.day} - ${req.endDate.month}/${req.endDate.day}',
                      style: TextStyle(fontSize: 13, color: Colors.grey[600], fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const SizedBox(height: 6),

                Row(
                  children: [
                    const Icon(Icons.person_outline, size: 14, color: Color(0xFF4F46E5)),
                    const SizedBox(width: 6),
                    Text(
                      isIncoming ? 'Requested By: ${req.renterName}' : 'Owner: ${req.ownerName}',
                      style: TextStyle(fontSize: 13, color: Colors.grey[600], fontWeight: FontWeight.w600),
                    ),
                  ],
                ),

                if (isIncoming && req.renterPhone.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.phone_outlined, size: 14, color: Colors.green),
                      const SizedBox(width: 6),
                      Text(
                        'Phone: ${req.renterPhone}',
                        style: const TextStyle(fontSize: 13, color: Colors.green, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],

                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '\$${req.totalPrice.toStringAsFixed(0)} (${req.paymentOption})',
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF4F46E5)),
                    ),
                  ],
                ),

                // Incoming Action Buttons for Owner
                if (isIncoming) ...[
                  const SizedBox(height: 14),
                  const Divider(height: 1),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      if (req.status == 'pending') ...[
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () async {
                              final success = await bookingProvider.updateStatus(req.id, 'approved');
                              if (success && mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Request Accepted!'), backgroundColor: Colors.green),
                                );
                              }
                            },
                            icon: const Icon(Icons.check_circle_outline, size: 18, color: Colors.white),
                            label: const Text('Accept', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () async {
                              final success = await bookingProvider.updateStatus(req.id, 'rejected');
                              if (success && mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Request Rejected'), backgroundColor: Colors.red),
                                );
                              }
                            },
                            icon: const Icon(Icons.cancel_outlined, size: 18, color: Colors.white),
                            label: const Text('Reject', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                        ),
                      ] else if (req.status == 'approved') ...[
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () async {
                              final success = await bookingProvider.updateStatus(req.id, 'completed');
                              if (success && mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Request Marked Completed!'), backgroundColor: Colors.blue),
                                );
                              }
                            },
                            icon: const Icon(Icons.task_alt, size: 18, color: Colors.white),
                            label: const Text('Mark Completed', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tool Requests & Loans', style: TextStyle(fontWeight: FontWeight.w900)),
        elevation: 0,
        backgroundColor: Colors.transparent,
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF4F46E5),
          unselectedLabelColor: Colors.grey,
          indicatorColor: const Color(0xFF4F46E5),
          labelStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
          tabs: const [
            Tab(text: 'Incoming Requests'),
            Tab(text: 'Sent Requests'),
          ],
        ),
      ),
      body: bookingProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildRequestList(bookingProvider.incomingRequests, true),
                _buildRequestList(bookingProvider.sentRequests, false),
              ],
            ),
    );
  }
}
