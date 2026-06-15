import type { ReactNode } from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
import { SidebarProvider } from "../context/SidebarContext";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen bg-gray-50 font-outfit overflow-hidden">

                <AppSidebar />

                <Backdrop />

                <div className="flex flex-col flex-1 overflow-hidden">
                    <AppHeader />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}