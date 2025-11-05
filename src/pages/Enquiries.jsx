import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { enquiryAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/common/Toast';
import Button from '../components/common/Button';
import EnquiryTable from '../components/enquiry/EnquiryTable';
import EnquiryForm from '../components/enquiry/EnquiryForm';
import EnquiryModal from '../components/enquiry/EnquiryModal';
import EnquiryFilters from '../components/enquiry/EnquiryFilters';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Enquiries = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [enquiries, setEnquiries] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);
  const [viewingEnquiry, setViewingEnquiry] = useState(null);
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
  });

  useEffect(() => {
    loadEnquiries();
    loadStaffList();
  }, [filters]);

  useEffect(() => {
    // Update URL params when filters change
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params);
  }, [filters]);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const response = await enquiryAPI.getAll(filters);
      setEnquiries(response.data.enquiries);
      setPagination(response.data.pagination);
    } catch (error) {
      showToast(error.message || 'Failed to load enquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStaffList = async () => {
    try {
      const response = await userAPI.getStaff();
      setStaffList(response.data);
    } catch (error) {
      console.error('Failed to load staff list:', error);
    }
  };

  const handleCreateEnquiry = async (data) => {
    setLoading(true);
    try {
      await enquiryAPI.create(data);
      showToast('Enquiry created successfully', 'success');
      setShowCreateForm(false);
      loadEnquiries();
    } catch (error) {
      showToast(error.message || 'Failed to create enquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEnquiry = async (id, data) => {
    setLoading(true);
    try {
      await enquiryAPI.update(id, data);
      showToast('Enquiry updated successfully', 'success');
      setEditingEnquiry(null);
      setViewingEnquiry(null);
      loadEnquiries();
    } catch (error) {
      showToast(error.message || 'Failed to update enquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnquiry = async (enquiry) => {
    if (!window.confirm(`Are you sure you want to delete enquiry from ${enquiry.customerName}?`)) {
      return;
    }

    try {
      await enquiryAPI.delete(enquiry._id);
      showToast('Enquiry deleted successfully', 'success');
      loadEnquiries();
    } catch (error) {
      showToast(error.message || 'Failed to delete enquiry', 'error');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const canDelete = user?.role === 'admin';
  const canAssign = user?.role === 'admin';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Enquiry
        </Button>
      </div>

      <EnquiryFilters filters={filters} onFilterChange={handleFilterChange} />

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Enquiry</h2>
          <EnquiryForm
            onSubmit={handleCreateEnquiry}
            onCancel={() => setShowCreateForm(false)}
            loading={loading}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && enquiries.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No enquiries found</p>
          </div>
        ) : (
          <>
            <EnquiryTable
              enquiries={enquiries}
              onView={setViewingEnquiry}
              onEdit={setEditingEnquiry}
              onDelete={handleDeleteEnquiry}
              canDelete={canDelete}
            />

            {pagination && pagination.pages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={pagination.page === i + 1 ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {(editingEnquiry || viewingEnquiry) && (
        <EnquiryModal
          enquiry={editingEnquiry || viewingEnquiry}
          staffList={staffList}
          onClose={() => {
            setEditingEnquiry(null);
            setViewingEnquiry(null);
          }}
          onUpdate={handleUpdateEnquiry}
          loading={loading}
          canAssign={canAssign}
        />
      )}
    </div>
  );
};

export default Enquiries;