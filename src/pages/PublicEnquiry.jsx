// src/pages/PublicEnquiry.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { showToast } from '../components/common/Toast';
import axios from 'axios';

const PublicEnquiry = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    message: '',
    priority: 'medium',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call public API endpoint (no auth required)
      await axios.post('http://localhost:5000/api/enquiries/public', formData);
      
      showToast('Your enquiry has been submitted! We will contact you soon.', 'success');
      
      // Clear form
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        message: '',
        priority: 'medium',
      });
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit enquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-2 text-gray-600">Submit your enquiry and we'll get back to you soon</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Your Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="1234567890"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                placeholder="Please describe your enquiry..."
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Submit Enquiry
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicEnquiry;