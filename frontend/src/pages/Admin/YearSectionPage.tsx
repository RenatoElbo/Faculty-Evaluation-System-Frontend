import YearAndSection from "../../components/pages/admin/YearAndSection";
import PageMeta from "../../components/common/PageMeta";

export default function YearSectionPage() {
    return (
        <>
            <PageMeta title="IFES | Year and Section Management" description="This is the Year and Section Management page for the IFES application." />
            <YearAndSection />
        </>
    );
}