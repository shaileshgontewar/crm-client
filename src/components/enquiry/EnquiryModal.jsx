import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import { ENQUIRY_STATUS_LABELS, PRIORITY_LABELS } from "../../utils/constants";

const EnquiryModal = ({
  enquiry,
  staffList,
  onClose,
  onUpdate,
  loading,
  canAssign,
}) => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    message: "",
    status: "new",
    priority: "medium",
    assignedTo: "",
  });

  useEffect(() => {
    if (enquiry) {
      setFormData({
        customerName: enquiry.customerName,
        email: enquiry.email,
        phone: enquiry.phone,
        message: enquiry.message,
        status: enquiry.status,
        priority: enquiry.priority,
        assignedTo: enquiry.assignedTo?._id || "",
      });
    }
  }, [enquiry]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updateData;
    if (canAssign) {
      // Admin/authorized users can update all fields
      updateData = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || null,
      };
    } else {
      // Staff can only update status and message
      updateData = {
        status: formData.status,
        message: formData.message,
      };
    }

    onUpdate(enquiry._id, updateData);
  };

  if (!enquiry) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Edit Enquiry
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                disabled={!canAssign}
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!canAssign}
              />

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!canAssign}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={!canAssign}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                >
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Object.entries(ENQUIRY_STATUS_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {canAssign && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.name} ({staff.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  // disabled={!canAssign}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Update Enquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
