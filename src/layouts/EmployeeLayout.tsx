import React, { useState } from 'react';
import EmployeeSidebar from '../components/EmployeeSidebar';
import EmployeeTopbar from '../components/EmployeeTopbar';

interface EmployeeLayoutProps {
  children: React.ReactNode;
  onCreateLeaveRequest?: () => void;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({
  children,
  onCreateLeaveRequest = () => console.log('Create leave request')
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <EmployeeSidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EmployeeTopbar onCreateLeaveRequest={onCreateLeaveRequest} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
