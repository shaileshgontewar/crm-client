import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { showToast } from '../components/common/Toast';
import Button from '../components/common/Button';
import UserTable from '../components/user/UserTable';
import UserForm from '../components/user/UserForm';
import { Plus, Search } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      
      const response = await userAPI.getAll(params);
      setUsers(response.data.users);
    } catch (error) {
      showToast(error.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data) => {
    setLoading(true);
    try {
      await userAPI.create(data);
      showToast('User created successfully', 'success');
      setShowCreateForm(false);
      loadUsers();
    } catch (error) {
      showToast(error.message || 'Failed to create user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (data) => {
    setLoading(true);
    try {
      await userAPI.update(editingUser._id, data);
      showToast('User updated successfully', 'success');
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      showToast(error.message || 'Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      return;
    }

    try {
      await userAPI.delete(user._id);
      showToast('User deleted successfully', 'success');
      loadUsers();
    } catch (error) {
      showToast(error.message || 'Failed to delete user', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New User
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <UserTable
            users={users}
            onEdit={setEditingUser}
            onDelete={handleDeleteUser}
          />
        )}
      </div>

      {(showCreateForm || editingUser) && (
        <UserForm
          user={editingUser}
          onClose={() => {
            setShowCreateForm(false);
            setEditingUser(null);
          }}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Users;