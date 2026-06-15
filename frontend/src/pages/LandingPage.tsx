import PageMeta from "../components/common/PageMeta";
import LandingPageContext from "../components/pages/LandingPage";


export default function LandingPage() {
    return (
        <>
        <PageMeta
            title="IFES"
            description="Langding Page"
        />
        <LandingPageContext />
        </>
    );
}