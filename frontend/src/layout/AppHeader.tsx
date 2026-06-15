import { useSidebar } from "../context/SidebarContext";
import { useState, useRef, useEffect } from "react";

export default function AppHeader() {
    const { toggleSidebar, toggleMobileSidebar } = useSidebar();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuClick = () => {
        if (window.innerWidth < 768) {
            toggleMobileSidebar();
        } else {
            toggleSidebar();
        }
    };

    const userName = localStorage.getItem("name")

    const handleLogout = () => {
        window.location.href = "/accountadminlogin";
        localStorage.removeItem("name");
        localStorage.removeItem("user_id");
    };

    return (
        <header className="w-full bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-40 font-outfit">

            <div className="flex items-center gap-3">
                <button
                    onClick={handleMenuClick} 
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col gap-1.5">
                        <div className="w-5 h-0.5 bg-gray-600" />
                        <div className="w-5 h-0.5 bg-gray-600" />
                        <div className="w-5 h-0.5 bg-gray-600" />
                    </div>
                </button>
                <div className="flex items-center gap-2 lg:hidden">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">iF</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 tracking-widest">LSPU-SCC-CCS</span>
                </div>
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                        <span className="text-violet-600 text-xs font-bold">AD</span>
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-800">{userName}</span>
                        <span className="text-xs text-gray-400">Administrator</span>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">{userName}</p>
                            <p className="text-xs text-gray-400">LSPU-SCC-CCS</p>
                        </div>
                        <div className="py-1">
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profile
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </button>
                        </div>
                        <div className="border-t border-gray-100 py-1">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}