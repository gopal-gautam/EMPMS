import React, { useState } from 'react';
import EmployeeLayout from '../layouts/EmployeeLayout';
import { useAuth0 } from '@auth0/auth0-react';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth0();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Mock data - replace with actual API calls
  const stats = {
    remainingLeaves: 18,
    totalLeaves: 24,
    pendingRequests: 2,
    approvedRequests: 8,
  };

  const upcomingLeaves = [
    { id: 1, startDate: '2026-01-15', endDate: '2026-01-17', type: 'Sick Leave', status: 'Approved' },
    { id: 2, startDate: '2026-02-10', endDate: '2026-02-12', type: 'Casual Leave', status: 'Pending' },
  ];

  const recentActivities = [
    { id: 1, action: 'Clocked in', time: 'Today at 9:00 AM', icon: '🕐' },
    { id: 2, action: 'Leave request approved', time: 'Yesterday', icon: '✓' },
    { id: 3, action: 'Document uploaded', time: '2 days ago', icon: '📄' },
    { id: 4, action: 'Payslip downloaded', time: '5 days ago', icon: '💰' },
  ];

  const quickActions = [
    { name: 'Request Leave', icon: '📅', action: () => setShowLeaveModal(true), color: 'blue' },
    { name: 'View Payslips', icon: '💵', action: () => console.log('View payslips'), color: 'green' },
    { name: 'Upload Document', icon: '📤', action: () => console.log('Upload document'), color: 'purple' },
    { name: 'View Notices', icon: '📢', action: () => console.log('View notices'), color: 'orange' },
  ];

  const handleCreateLeaveRequest = () => {
    setShowLeaveModal(true);
  };

  return (
    <EmployeeLayout onCreateLeaveRequest={handleCreateLeaveRequest}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Employee'}!</h1>
              <p className="text-blue-100">Here's what's happening with your account today.</p>
            </div>
            <img
              src={user?.picture || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Remaining Leaves</p>
                <p className="text-3xl font-bold text-gray-800">{stats.remainingLeaves}</p>
                <p className="text-xs text-gray-500 mt-1">out of {stats.totalLeaves}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingRequests}</p>
                <p className="text-xs text-gray-500 mt-1">awaiting approval</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved Leaves</p>
                <p className="text-3xl font-bold text-gray-800">{stats.approvedRequests}</p>
                <p className="text-xs text-gray-500 mt-1">this year</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Attendance</p>
                <p className="text-3xl font-bold text-gray-800">96%</p>
                <p className="text-xs text-gray-500 mt-1">this month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`p-6 rounded-lg border-2 border-${action.color}-200 hover:border-${action.color}-400 hover:bg-${action.color}-50 transition-all text-center group`}
              >
                <div className="text-4xl mb-2">{action.icon}</div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{action.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Leaves */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Leaves</h2>
            <div className="space-y-4">
              {upcomingLeaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{leave.type}</p>
                    <p className="text-sm text-gray-600">
                      {leave.startDate} to {leave.endDate}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      leave.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>
              ))}
              {upcomingLeaves.length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming leaves</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Request Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Create Leave Request</h2>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Earned Leave</option>
                    <option>Unpaid Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide a reason for your leave request..."
                  ></textarea>
                </div>
                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
