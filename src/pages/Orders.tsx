import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  title: string;
  type: 'patent' | 'trademark';
  number: string;
  purchaseDate: string;
  status: string;
  price: number;
}

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (orderId: string) => {
    try {
      toast.success('Downloading certificate...');
      // Implement certificate download logic
    } catch (error) {
      toast.error('Error downloading certificate');
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-fixed">
      <div className="min-h-screen bg-black/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8"
          >
            <div className="flex items-center mb-8">
              <ShoppingBag className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold">My Orders</h1>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-gray-500">Start searching and protecting your intellectual property.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{order.title}</h3>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="font-medium capitalize">{order.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Number</p>
                            <p className="font-medium">{order.number}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Purchase Date</p>
                            <p className="font-medium">{new Date(order.purchaseDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-green-600">₹{order.price.toLocaleString()}</p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        onClick={() => downloadCertificate(order.id)}
                        className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </button>
                      <button
                        onClick={() => toast.success('Viewing details...')}
                        className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}