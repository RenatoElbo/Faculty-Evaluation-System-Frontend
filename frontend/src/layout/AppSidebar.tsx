import { NavLink, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const navItems = [
    {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: "Academic Year",
        path: "/admin/academic-year",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: "Section",
        path: "/admin/year-section",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
    },
    {
        label: "Faculties",
        path: "/admin/faculties",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: "Evaluation Result",
        path: "/admin/evareport",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: "Questions Result",
        path: "/admin/questions",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        label: "Generate Report",
        path: "/generated",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
];

export default function AppSidebar() {
    const { isExpanded, isMobileOpen, isHovered, toggleMobileSidebar, setIsHovered } = useSidebar();
    const location = useLocation();

    const isOpen = isExpanded || isHovered;
    
    const userName = localStorage.getItem("name")

    return (
        <aside
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
                flex flex-col transition-all duration-300 ease-in-out
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:static lg:z-auto
                ${isOpen ? "w-64" : "lg:w-16"}
            `}>

            <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 overflow-hidden`}>
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">iF</span>
                </div>
                {isOpen && (
                    <div className="transition-opacity duration-200">
                        <p className="text-sm font-bold text-gray-900 tracking-wide whitespace-nowrap">IFES</p>
                        <p className="text-xs text-gray-400 whitespace-nowrap">LSPU-SCC-CCS</p>
                    </div>
                )}
                <button
                    onClick={toggleMobileSidebar}
                    className="ml-auto lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <nav className="flex-1 px-2 py-4 overflow-y-auto overflow-x-hidden">
                {isOpen && (
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3 whitespace-nowrap">
                        Main Menu
                    </p>
                )}
                <ul className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    onClick={toggleMobileSidebar} 
                                    title={!isOpen ? item.label : undefined}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                        ${isOpen ? "" : "lg:justify-center"}
                                        ${isActive
                                            ? "bg-violet-600 text-white shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`}>
                                    <span className={`shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}>
                                        {item.icon}
                                    </span>
                                    {isOpen && (
                                        <span className="whitespace-nowrap overflow-hidden">
                                            {item.label}
                                        </span>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-gray-100">
                <div className={`flex items-center gap-3 px-1 ${!isOpen ? "lg:justify-center" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <span className="text-violet-600 text-xs font-bold">AD</span>
                    </div>
                    {isOpen && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                            <p className="text-xs text-gray-400 truncate">Administrator</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}