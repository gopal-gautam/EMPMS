import { Sidebar } from "../components/Sidebar"
import { Topbar } from "../components/Topbar"
import React from "react";

export const LayoutWithSidebarTopbar = ({ children, menuItem }: { children: React.ReactNode, menuItem: string }) => {
    const [activeMenu, setActiveMenu] = React.useState<string>(menuItem);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Sidebar */}
            <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <Topbar />
                {/* Content Area */}
                {children}
            </div>
        </div>
    );
}