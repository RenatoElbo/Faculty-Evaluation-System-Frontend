import PageMeta from "../../components/common/PageMeta";
import EvaluationResult from "../../components/pages/admin/EvaluationResult";

export default function AdminDashboardPage() {
    return (
        <>
        <PageMeta
            title="IFES | Dashboard"
            description="Admin Dashboard"
        />
        <EvaluationResult />
        </>
    );
}