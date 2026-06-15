import { useSidebar } from "../context/SidebarContext";

export default function Backdrop() {
    const { isMobileOpen, toggleMobileSidebar } = useSidebar();

    if (!isMobileOpen) return null;

    return (
        <div
            onClick={toggleMobileSidebar}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
        />
    );
}