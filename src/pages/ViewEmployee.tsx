import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutWithSidebarTopbar } from '../layouts/LayoutWithSidebarTopbar';
import type { Employee } from '../types/employee';
import api from '../api/client';
import { useDeleteEmployee } from '../hooks/useEmployees';

const ViewEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: employee, isLoading, isError } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const { data } = await api.get<Employee>(`/employees/${id}`);
      return data;
    },
  });

  const handleEdit = () => {
    navigate(`/employees/${id}/edit`);
  };

  const handleDelete = () => {
    const { mutate: deleteEmployeeMutate} = useDeleteEmployee();
    try {
      // await api.delete(`/employees/${id}`);
      deleteEmployeeMutate(id!);
      navigate('/employees');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  const handleAddNotice = () => {
    navigate(`/employees/${id}/notice`);
  };

  const handleViewClockInOut = () => {
    navigate(`/employees/${id}/clock`);
  };

  const handleViewCalendar = () => {
    navigate(`/employees/${id}/calendar`);
  };

  const handleManualAdjustments = () => {
    navigate(`/employees/${id}/adjustments`);
  };

  const handleLeaveRequests = () => {
    navigate(`/employees/${id}/leave-requests`);
  };

  const handleModifyRate = () => {
    navigate(`/employees/${id}/rate`);
  };

  const handleCreatePayroll = () => {
    navigate(`/employees/${id}/payroll/create`);
  };

  const handleAddDocument = () => {
    navigate(`/employees/${id}/documents/add`);
  };

  const handleViewReports = () => {
    navigate(`/employees/${id}/reports`);
  };

  if (isLoading) {
    return (
      <LayoutWithSidebarTopbar menuItem="add-employee">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading employee details...</div>
        </div>
      </LayoutWithSidebarTopbar>
    );
  }

  if (isError || !employee) {
    return (
      <LayoutWithSidebarTopbar menuItem="add-employee">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-600">Error loading employee details</div>
        </div>
      </LayoutWithSidebarTopbar>
    );
  }

  return (
    <LayoutWithSidebarTopbar menuItem="all-employee">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Actions */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <button
              onClick={() => navigate('/employees')}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
            >
              &larr; Back to Employees
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Employee Details</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="mb-6">
                Are you sure you want to delete {employee.firstName} {employee.lastName}? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Personal Information</h2>
              <div className="flex items-start gap-6">
                {employee.profileImage && (
                  <img
                    src={employee.profileImage}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                )}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Employee ID</label>
                    <p className="text-gray-900">{employee.employeeId || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">
                      {employee.fullName || `${employee.firstName} ${employee.middleName || ''} ${employee.lastName}`.trim()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-gray-900">{employee.dateOfBirth || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-gray-900 capitalize">{employee.gender || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marital Status</label>
                    <p className="text-gray-900">{employee.maritalStatus || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nationality</label>
                    <p className="text-gray-900">{employee.nationality || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Blood Group</label>
                    <p className="text-gray-900">{employee.bloodGroup || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <p>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : employee.status === 'inactive'
                            ? 'bg-yellow-100 text-yellow-800'
                            : employee.status === 'terminated'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {employee.status || 'active'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{employee.email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{employee.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Alternate Phone</label>
                  <p className="text-gray-900">{employee.alternatePhone || '-'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">
                    {[employee.address, employee.city, employee.state, employee.zipCode, employee.country]
                      .filter(Boolean)
                      .join(', ') || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Employment Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p className="text-gray-900">{employee.department || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Position</label>
                  <p className="text-gray-900">{employee.position || employee.jobTitle || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Employment Type</label>
                  <p className="text-gray-900">{employee.employmentType || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Joining</label>
                  <p className="text-gray-900">{employee.dateOfJoining || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Work Location</label>
                  <p className="text-gray-900">{employee.workLocation || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reporting Manager</label>
                  <p className="text-gray-900">{employee.reportingManager || '-'}</p>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Bank Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Bank Name</label>
                  <p className="text-gray-900">{employee.bankName || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Account Number</label>
                  <p className="text-gray-900">{employee.accountNumber || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">IFSC Code</label>
                  <p className="text-gray-900">{employee.ifscCode || '-'}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            {employee.emergencyContact && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Emergency Contact</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{employee.emergencyContact.name || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Relation</label>
                    <p className="text-gray-900">{employee.emergencyContact.relation || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{employee.emergencyContact.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-gray-900">{employee.emergencyContact.address || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            {employee.documents && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Documents</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Citizenship Number</label>
                    <p className="text-gray-900">{employee.documents.citizenShipNumber || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">PAN Number</label>
                    <p className="text-gray-900">{employee.documents.panNumber || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Passport Number</label>
                    <p className="text-gray-900">{employee.documents.passportNumber || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Driving License</label>
                    <p className="text-gray-900">{employee.documents.drivingLicense || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            {(employee.allergies || employee.notes) && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Additional Information</h2>
                {employee.allergies && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-600">Allergies</label>
                    <p className="text-gray-900">{employee.allergies}</p>
                  </div>
                )}
                {employee.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notes</label>
                    <p className="text-gray-900">{employee.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Panel - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleAddNotice}
                  className="w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-md transition-colors"
                >
                  <div className="font-medium text-yellow-900">Add Notice</div>
                  <div className="text-sm text-yellow-700">Issue notice to employee</div>
                </button>

                <button
                  onClick={handleViewClockInOut}
                  className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
                >
                  <div className="font-medium text-blue-900">Clock In/Out</div>
                  <div className="text-sm text-blue-700">View attendance records</div>
                </button>

                <button
                  onClick={handleViewCalendar}
                  className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-colors"
                >
                  <div className="font-medium text-purple-900">Calendar</div>
                  <div className="text-sm text-purple-700">View schedule & events</div>
                </button>

                <button
                  onClick={handleManualAdjustments}
                  className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-md transition-colors"
                >
                  <div className="font-medium text-orange-900">Manual Adjustments</div>
                  <div className="text-sm text-orange-700">Adjust attendance/hours</div>
                </button>

                <button
                  onClick={handleLeaveRequests}
                  className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-md transition-colors"
                >
                  <div className="font-medium text-green-900">Leave Requests</div>
                  <div className="text-sm text-green-700">Manage leave applications</div>
                </button>

                <button
                  onClick={handleModifyRate}
                  className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors"
                >
                  <div className="font-medium text-indigo-900">Add/Modify Rate</div>
                  <div className="text-sm text-indigo-700">Update compensation</div>
                </button>

                <button
                  onClick={handleCreatePayroll}
                  className="w-full text-left px-4 py-3 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-md transition-colors"
                >
                  <div className="font-medium text-pink-900">Create Payroll</div>
                  <div className="text-sm text-pink-700">Generate monthly payroll</div>
                </button>

                <button
                  onClick={handleAddDocument}
                  className="w-full text-left px-4 py-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
                >
                  <div className="font-medium text-teal-900">Add Document</div>
                  <div className="text-sm text-teal-700">Upload employee documents</div>
                </button>

                <button
                  onClick={handleViewReports}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
                >
                  <div className="font-medium text-gray-900">View Reports</div>
                  <div className="text-sm text-gray-700">Access employee reports</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWithSidebarTopbar>
  );
};

export default ViewEmployee;
