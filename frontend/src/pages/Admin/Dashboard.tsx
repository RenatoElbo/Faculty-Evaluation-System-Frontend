import PageMeta from "../../components/common/PageMeta";
import DashboardPage from "../../components/pages/admin/AdminDashboard";

export default function AdminDashboardPage() {
    return (
        <>
        <PageMeta
            title="IFES | Dashboard"
            description="Admin Dashboard"
        />
        <DashboardPage />
        </>
    );
}