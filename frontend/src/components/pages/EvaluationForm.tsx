import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EvaluatorForm from "../evaluation/EvaluatorForm";
import SurveySection from "../evaluation/SurveySection";
import FeedbackSection from "../evaluation/FeedbackSection";
import RatingSection from "../evaluation/RatingSection";
import type { EvaluatorFormData, FeedbackData } from "../../model/UserModel";
import { insertEvaluation } from "../../../backend/UserBackend/UserForm";

const surveyData = [
    {
        section: "A",
        title: "Course / Subject Matter Organization",
        questions: [
            { id: "q1", text: "Objectives of courses / subject matter are clearly stated" },
            { id: "q2", text: "Overall course outline appears to be clear and focused" },
            { id: "q3", text: "The course content matches the learning objectives" },
            { id: "q4", text: "The teaching methods used in the course are effective" },
            { id: "q5", text: "The learning materials are appropriate for the course" },
        ],
    },
    {
        section: "B",
        title: "Mastery of Subject Matter",
        questions: [
            { id: "q6", text: "Demonstrates comprehensive knowledge of the subject matter" },
            { id: "q7", text: "Applies subject knowledge effectively to practical situations" },
            { id: "q8", text: "Stays current with recent developments in the field" },
            { id: "q9", text: "Provides useful and relevant feedback on assignments" },
            { id: "q10", text: "Effectively integrates theory with practice" },
        ],
    },
    {
        section: "C",
        title: "Teaching Approach",
        questions: [
            { id: "q11", text: "Engages students in the learning process" },
            { id: "q12", text: "Encourages critical thinking and problem-solving" },
            { id: "q13", text: "Provides clear and concise explanations" },
            { id: "q14", text: "Uses appropriate and varied teaching aids" },
            { id: "q15", text: "Demonstrates enthusiasm and passion for teaching" },
        ],
    },
    {
        section: "D",
        title: "Command of Language",
        questions: [
            { id: "q16", text: "Communicates effectively with students" },
            { id: "q17", text: "Listens to and addresses student concerns" },
            { id: "q18", text: "Provides timely and helpful feedback on student performance" },
            { id: "q19", text: "Exhibits patience and understanding" },
            { id: "q20", text: "Demonstrates effective use of language in presentations" },
        ],
    },
    {
        section: "E",
        title: "Regency and Relevance of Concepts / Materials",
        questions: [
            { id: "q21", text: "Maintains a positive learning environment" },
            { id: "q22", text: "Manages classroom activities effectively" },
            { id: "q23", text: "Shows fairness in evaluating students" },
        ],
    },
];

export default function EvaluationForm() {
    const [step, setStep] = useState(1);
    const totalSteps = 8;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    const [evaluatorData, setEvaluatorData] = useState<EvaluatorFormData>({
        email: "",
        name: "",
        section: "",
        semester: "",
        faculty: "",
        subject: "",
        date: new Date().toISOString().split("T")[0],
    });
    const [surveyAnswers, setSurveyAnswers] = useState<Record<string, number>>({});
    const [feedbackData, setFeedbackData] = useState<FeedbackData>({
        feedback: "",
        feedback_analysis: "",
        feedback_tone: "",
        descriptive_scale: "",
        student_grade: "",
        average_rating: 0,
        feedback_rating: 0,
        evaluation_matching: "false",
    });

    const next = () => setStep((s) => Math.min(s + 1, totalSteps));
    const back = () => setStep((s) => Math.max(s - 1, 1));
    const navigate = useNavigate();
    const exit = () => {
        navigate("/");
    };

    const handleEvaluatorNext = (data: EvaluatorFormData) => {
        setEvaluatorData(data);
        next();
    };

    const handleSurveyNext = (answers: Record<string, number>) => {
        setSurveyAnswers((prev) => ({ ...prev, ...answers }));
        next();
    };

    const handleFeedbackNext = (data: FeedbackData) => {
        setFeedbackData(data);
        next();
    };

    const handleSubmit = async () => {
        const payload = {
            ...evaluatorData,
            ...surveyAnswers,
            ...feedbackData,
        };

        try {
            await insertEvaluation(payload);
            setTimeout(() => {
                navigate("/thankyou");
            }, 1000);
        } catch (err: any) {
            console.error("Submission failed:", err.message);
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-50 font-outfit">

            <header className="relative z-10 w-full bg-violet-600 py-4 px-6 text-center sticky top-0 shadow-md">
                <p className="text-white text-sm md:text-base font-semibold tracking-[0.2em] uppercase">
                    Teaching Effectiveness | Student Evaluation
                </p>
            </header>

            <div className="w-full bg-violet-100 h-1.5 sticky top-[56px] z-10">
                <div
                    className="bg-blue-600 h-1.5 transition-all duration-500"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                />
            </div>

            <div className="flex justify-center mt-8">
                <div className="inline-flex items-center gap-2 bg-white border border-violet-100 shadow-sm rounded-full px-4 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-violet-600" />
                    <span className="text-xs text-violet-600 font-semibold tracking-wide">
                        Step {step} of {totalSteps}
                    </span>
                </div>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`rounded-full transition-all duration-300 ${i + 1 === step
                                ? "w-6 h-2 bg-violet-600"
                                : i + 1 < step
                                    ? "w-2 h-2 bg-violet-400"
                                    : "w-2 h-2 bg-violet-100"
                            }`}
                    />
                ))}
            </div>

            <div className={`mx-auto px-4 md:px-6 py-8 ${step === 7 ? "max-w-6xl" : "max-w-3xl"}`}>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">

                    {step === 1 && (
                        <EvaluatorForm
                            onBack={exit}
                            onNext={handleEvaluatorNext}
                            initialData={evaluatorData}
                        />
                    )}

                    {surveyData.map((survey, index) =>
                        step === index + 2 ? (
                            <SurveySection
                                key={survey.section}
                                section={survey.section}
                                title={survey.title}
                                questions={survey.questions}
                                onNext={handleSurveyNext}
                                onBack={back}
                                initialAnswers={surveyAnswers}
                            />
                        ) : null
                    )}

                    {step === 7 && (
                        <FeedbackSection
                            onNext={handleFeedbackNext}
                            onBack={back}
                            surveyAnswers={surveyAnswers}
                            initialData={feedbackData}
                            evaluatorData={evaluatorData}
                        />
                    )}

                    {step === 8 && (
                        <RatingSection
                            evaluatorData={evaluatorData}
                            surveyAnswers={surveyAnswers}
                            feedbackData={feedbackData}
                            onBack={back}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}