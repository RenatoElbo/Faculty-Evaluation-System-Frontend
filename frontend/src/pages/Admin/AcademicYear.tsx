import AcademicYearPage from "../../components/pages/admin/AcademicYear";
import PageMeta from "../../components/common/PageMeta";


export default function AcademicYear() {
    return (
        <>
            <PageMeta title="IFES | Academic Year" description="Manage current and previous semesters for IFES evaluations." />
            <AcademicYearPage />
        </>
    );
}