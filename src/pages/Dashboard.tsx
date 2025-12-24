import { useAuth0 } from '@auth0/auth0-react';

export const Dashboard = () => {
  const { user, logout } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Dashboard</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <div className="flex items-center space-x-4 mb-6">
              {user?.picture && (
                <img
                  src={user.picture}
                  alt={user.name || 'User'}
                  className="h-20 w-20 rounded-full ring-4 ring-blue-100"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-gray-600 mt-1">{user?.email}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.name || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.email_verified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Not Verified
                      </span>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono text-xs truncate">
                    {user?.sub || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden rounded-lg px-4 py-5 shadow">
                  <dt className="text-sm font-medium text-blue-900 truncate">Last Login</dt>
                  <dd className="mt-1 text-2xl font-semibold text-blue-600">
                    {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Today'}
                  </dd>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden rounded-lg px-4 py-5 shadow">
                  <dt className="text-sm font-medium text-purple-900 truncate">Account Status</dt>
                  <dd className="mt-1 text-2xl font-semibold text-purple-600">Active</dd>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden rounded-lg px-4 py-5 shadow">
                  <dt className="text-sm font-medium text-green-900 truncate">Security</dt>
                  <dd className="mt-1 text-2xl font-semibold text-green-600">Protected</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
