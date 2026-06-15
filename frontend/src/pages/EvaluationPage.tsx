import PageMeta from "../components/common/PageMeta";
import EvaluationContext from "../components/pages/EvaluationForm";


export default function EvaluationPage() {
    return (
        <>
        <PageMeta
            title="IFES | Evaluation Form"
            description="Evaluation Form Page"
        />
        <EvaluationContext />
        </>
    );
}