import { useState } from "react";
import { type QuestionProps } from "../../model/UserModel";

const scaleLabels = [
    { value: 1, label: "Needs Improvement" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Very Good" },
    { value: 5, label: "Outstanding" },
];

export default function SurveySection({ section, title, questions, onNext, onBack, initialAnswers }: QuestionProps) {
    const [answers, setAnswers] = useState<Record<string, number>>(
        initialAnswers ?? {}
    );
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleSelect = (questionId: string, value: number) => {
        setAnswers({ ...answers, [questionId]: value });
        setErrors({ ...errors, [questionId]: false });
    };

    const validate = () => {
        const newErrors: Record<string, boolean> = {};
        questions.forEach((q) => {
            if (!answers[q.id]) newErrors[q.id] = true;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext(answers);
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-violet-50 rounded-full px-4 py-1.5 mb-4">
                    <div className="w-2 h-2 rounded-full bg-violet-600" />
                    <span className="text-xs text-violet-600 font-semibold tracking-wide uppercase">
                        Section {section}
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
                <p className="text-sm text-gray-400">
                    Rate each item honestly using the scale below.
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                {scaleLabels.map((s) => (
                    <div key={s.value}
                        className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                        <span className="text-xs font-bold text-violet-600">{s.value}</span>
                        <span className="text-xs text-gray-500">— {s.label}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-5">
                {questions.map((q, index) => (
                    <div key={q.id}
                        className={`p-5 rounded-2xl border transition-all ${
                            errors[q.id]
                                ? "border-red-300 bg-red-50"
                                : answers[q.id]
                                ? "border-violet-200 bg-violet-50"
                                : "border-gray-200 bg-white"
                        }`}>

                        <p className="text-sm font-medium text-gray-800 mb-4">
                            <span className="text-violet-600 font-bold mr-2">{index + 1}.</span>
                            {q.text}
                        </p>

                        <div className="flex gap-2 flex-wrap">
                            {scaleLabels.map((s) => (
                                <button
                                    key={s.value}
                                    type="button"
                                    onClick={() => handleSelect(q.id, s.value)}
                                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 text-sm font-bold transition-all
                                        ${answers[q.id] === s.value
                                            ? "border-violet-600 bg-violet-600 text-white shadow-md scale-105"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:bg-violet-50"
                                        }`}>
                                    {s.value}
                                </button>
                            ))}

                            {answers[q.id] && (
                                <div className="flex items-center ml-2">
                                    <span className="text-xs text-violet-600 font-semibold">
                                        {scaleLabels.find(s => s.value === answers[q.id])?.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        {errors[q.id] && (
                            <p className="text-xs text-red-500 mt-2">Please select a rating.</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-10">
                <button
                    onClick={onBack}
                    className="px-7 py-3 border-2 border-violet-200 text-violet-600 rounded-full text-sm font-semibold hover:bg-violet-50 transition-colors">
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-violet-600 text-white rounded-full text-sm font-semibold hover:bg-violet-700 transition-colors">
                    Next →
                </button>
            </div>
        </div>
    );
}