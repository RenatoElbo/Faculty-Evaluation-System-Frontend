import PageMeta from "../../components/common/PageMeta";
import FacultiesPage from "../../components/pages/admin/Faculties";

export default function Faculties() {
    return (
        <>
            <PageMeta title="IFES | Faculties" description="Manage faculty information for IFES evaluations." />
            <FacultiesPage />
        </>
    );
}