import { useState, useEffect } from 'react';
import { enquiryAPI } from '../services/api';
import { BarChart3, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await enquiryAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (status) => {
    return stats?.byStatus.find((s) => s._id === status)?.count || 0;
  };

  const cards = [
    {
      title: 'Total Enquiries',
      value: stats?.total || 0,
      icon: MessageSquare,
      color: 'bg-blue-500',
      onClick: () => navigate('/enquiries'),
    },
    {
      title: 'New Enquiries',
      value: getStatusCount('new'),
      icon: TrendingUp,
      color: 'bg-green-500',
      onClick: () => navigate('/enquiries?status=new'),
    },
    {
      title: 'In Progress',
      value: getStatusCount('in_progress'),
      icon: Users,
      color: 'bg-yellow-500',
      onClick: () => navigate('/enquiries?status=in_progress'),
    },
    {
      title: 'Closed',
      value: getStatusCount('closed'),
      icon: BarChart3,
      color: 'bg-gray-500',
      onClick: () => navigate('/enquiries?status=closed'),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <button
            onClick={() => navigate('/enquiries')}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition"
          >
            <p className="font-medium text-gray-900">View All Enquiries</p>
            <p className="text-sm text-gray-600">Manage and respond to customer enquiries</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;