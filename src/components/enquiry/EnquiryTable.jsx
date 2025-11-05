import { Eye, Edit, Trash2 } from 'lucide-react';
import { ENQUIRY_STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS, PRIORITY_LABELS } from '../../utils/constants';
import { clsx } from 'clsx';

const EnquiryTable = ({ enquiries, onView, onEdit, onDelete, canDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {enquiries.map((enquiry) => (
            <tr key={enquiry._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{enquiry.customerName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{enquiry.email}</div>
                <div className="text-sm text-gray-500">{enquiry.phone}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {enquiry.message}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', PRIORITY_COLORS[enquiry.priority])}>
                  {PRIORITY_LABELS[enquiry.priority]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', STATUS_COLORS[enquiry.status])}>
                  {ENQUIRY_STATUS_LABELS[enquiry.status]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {enquiry.assignedTo?.name || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(enquiry.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onView(enquiry)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onEdit(enquiry)}
                    className="text-green-600 hover:text-green-900"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => onDelete(enquiry)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnquiryTable;