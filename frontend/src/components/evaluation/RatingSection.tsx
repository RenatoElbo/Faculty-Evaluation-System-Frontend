import { useState } from "react";
import { type FeedbackData } from "../../model/UserModel";

interface RatingSectionProps {
    evaluatorData: {
        email: string;
        name: string;
        section: string;
        semester: string;
        faculty: string;
        subject: string;
        date: string;
    };
    surveyAnswers: Record<string, number>;
    feedbackData: FeedbackData;
    onBack: () => void;
    onSubmit: () => Promise<void>;
}

const scaleLabels: Record<number, string> = {
    1: "Needs Improvement",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Outstanding",
};

function getScaleColor(score: number): string {
    if (score >= 4.5) return "text-green-600";
    if (score >= 3.5) return "text-blue-600";
    if (score >= 2.5) return "text-yellow-600";
    if (score >= 1.5) return "text-orange-600";
    return "text-red-600";
}

function getBgColor(score: number): string {
    if (score >= 4.5) return "bg-green-50 border-green-200";
    if (score >= 3.5) return "bg-blue-50 border-blue-200";
    if (score >= 2.5) return "bg-yellow-50 border-yellow-200";
    if (score >= 1.5) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
}

const sectionLabels: Record<string, string> = {
    A: "Course / Subject Matter Organization",
    B: "Mastery of Subject Matter",
    C: "Teaching Approach",
    D: "Command of Language",
    E: "Regency and Relevance",
};

const sectionQuestions: Record<string, string[]> = {
    A: ["q1", "q2", "q3", "q4", "q5"],
    B: ["q6", "q7", "q8", "q9", "q10"],
    C: ["q11", "q12", "q13", "q14", "q15"],
    D: ["q16", "q17", "q18", "q19", "q20"],
    E: ["q21", "q22", "q23"],
};

export default function RatingSection({
    evaluatorData,
    surveyAnswers,
    feedbackData,
    onBack,
    onSubmit,
}: RatingSectionProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sectionAverages = Object.entries(sectionQuestions).map(([section, questions]) => {
        const values = questions.map((q) => surveyAnswers[q] ?? 0);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return { section, label: sectionLabels[section], avg: parseFloat(avg.toFixed(2)) };
    });

    const allValues = Object.values(surveyAnswers);
    const overallAverage = allValues.length > 0
        ? parseFloat((allValues.reduce((a, b) => a + b, 0) / allValues.length).toFixed(2))
        : 0;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">

            <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-violet-50 rounded-full px-4 py-1.5 mb-4">
                    <div className="w-2 h-2 rounded-full bg-violet-600" />
                    <span className="text-xs text-violet-600 font-semibold tracking-wide uppercase">
                        Final Step
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Overall Rating & Summary</h2>
                <p className="text-sm text-gray-400">
                    Review your evaluation before submitting.
                </p>
            </div>

            <div className={`rounded-2xl border p-6 mb-6 ${getBgColor(overallAverage)}`}>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Average Evaluation Rating</p>
                <div className="flex items-end gap-3">
                    <p className={`text-6xl font-bold ${getScaleColor(overallAverage)}`}>
                        {overallAverage}
                    </p>
                    <div className="mb-2">
                        <p className="text-sm text-gray-400 font-medium">/ 5.0</p>
                        <p className={`text-sm font-semibold ${getScaleColor(overallAverage)}`}>
                            {scaleLabels[Math.round(overallAverage)] ?? ""}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {sectionAverages.map(({ section, label, avg }) => (
                    <div key={section}
                        className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-violet-600 font-semibold mb-0.5">Section {section}</p>
                            <p className="text-sm font-medium text-gray-700">{label}</p>
                        </div>
                        <div className="text-right">
                            <p className={`text-xl font-bold ${getScaleColor(avg)}`}>{avg}</p>
                            <p className="text-xs text-gray-400">{scaleLabels[Math.round(avg)]}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-4">Rating Breakdown</p>
                <div className="flex flex-col gap-4">
                    {sectionAverages.map(({ section, label, avg }) => (
                        <div key={section}>
                            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                <span>{label}</span>
                                <span className="font-semibold">{avg} / 5.0</span>
                            </div>
                            <div className="h-2.5 bg-gray-100 rounded-full">
                                <div
                                    className="h-2.5 bg-violet-600 rounded-full transition-all duration-500"
                                    style={{ width: `${(avg / 5) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10">
                <p className="text-sm font-semibold text-gray-700 mb-4">Evaluation Summary</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { label: "Name", value: evaluatorData.name },
                        { label: "Email", value: evaluatorData.email },
                        { label: "Section", value: evaluatorData.section },
                        { label: "Semester", value: evaluatorData.semester },
                        { label: "Faculty", value: evaluatorData.faculty },
                        { label: "Subject", value: evaluatorData.subject },
                        { label: "GWA", value: feedbackData.student_grade },
                        { label: "Date", value: evaluatorData.date },
                    ].map((item) => (
                        <div key={item.label} className="flex flex-col gap-0.5">
                            <p className="text-xs text-gray-400">{item.label}</p>
                            <p className="text-sm font-medium text-gray-800">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">Feedback</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{feedbackData.feedback}</p>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="px-7 py-3 border-2 border-violet-200 text-violet-600 rounded-full text-sm font-semibold hover:bg-violet-50 transition-colors disabled:opacity-50">
                    ← Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-violet-600 text-white rounded-full text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-70 flex items-center gap-2">
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        "Submit Evaluation"
                    )}
                </button>
            </div>
        </div>
    );
}