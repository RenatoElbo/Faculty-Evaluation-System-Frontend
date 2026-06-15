import { useState, useEffect, useRef } from "react";
import {
    type AnalysisResult,
    type Props,
} from "../../model/UserModel"
import {
    preprocessText,
    tfidfVectorize,
    predictSentiment,
    mapScoreToScale,
    mapToDescriptiveTerm,
    mapToFeedbackTone,
    loadModelAndVectorizer,
    analyzeSentence,
    matchRatingWithSentiment,
    calculateAverageRating,
} from "../modelHelper/FeedbackAnalysis";

function getSentimentColor(tone: string): string {
    if (tone === "Happy" || tone === "Overjoyed" || tone === "Positive") return "bg-green-100 text-green-700 border-green-200";
    if (tone === "Satisfied" || tone === "Okay" || tone === "Neutral") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-red-100 text-red-700 border-red-200";
}

export default function FeedbackSection({ onNext, onBack, surveyAnswers, initialData, evaluatorData }: Props) {
    const [feedback, setFeedback] = useState(initialData?.feedback ?? "");
    const [studentGrade, setStudentGrade] = useState(initialData?.student_grade ?? "");
    const [errors, setErrors] = useState<{ feedback?: string; grade?: string }>({});
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [showAllSentences, setShowAllSentences] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!showAllSentences) return;

        const handleKeyDown = (e: { key: string; }) => {
            if (e.key === "Escape") {
                setShowAllSentences(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showAllSentences]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        setIsOverflowing(el.scrollHeight > el.clientHeight);
    }, [analysis?.sentences]);

    useEffect(() => {
        if (!feedback.trim()) {
            setAnalysis(null);
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runAnalysis(feedback), 600);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [feedback]);

    function runAnalysis(text: string) {
        try {
            setIsAnalyzing(true);

            const preprocessedFeedback = preprocessText(text);
            const { vectorizerData, modelData } = loadModelAndVectorizer();
            const tfidfVec = tfidfVectorize(preprocessedFeedback, vectorizerData);
            const sentimentScore = predictSentiment(tfidfVec, modelData);

            const scaledScore = mapScoreToScale(sentimentScore);
            const descriptiveTerm = mapToDescriptiveTerm(scaledScore);
            const feedbackTone = mapToFeedbackTone(scaledScore);
            const sentiment = scaledScore >= 4 ? "Positive" : scaledScore >= 3 ? "Neutral" : "Negative";


            const averageRating = calculateAverageRating(surveyAnswers);


            const scaleInfo = matchRatingWithSentiment(averageRating, sentimentScore);


            const sentences = text
                .split(/[.!?]+/)
                .filter((s) => s.trim())
                .map((s) => {
                    const result = analyzeSentence(s, vectorizerData, modelData);
                    return {
                        text: result.text,
                        tone: mapToFeedbackTone(mapScoreToScale(result.sentimentScore)),
                        score: result.sentimentScore,
                        bgColor: result.bgColor,
                    };
                });

            setAnalysis({
                feedbackRating: scaledScore,
                descriptiveScale: descriptiveTerm,
                feedbackTone,
                sentiment,
                averageRating: parseFloat(averageRating.toFixed(2)),
                isMatching: scaleInfo.isMatching,
                sentences,
            });
        } catch (error) {
            console.error("Analysis error:", error);
        } finally {
            setIsAnalyzing(false);
        }
    }

    const validate = () => {
        const newErrors: { feedback?: string; grade?: string } = {};
        if (!feedback.trim()) newErrors.feedback = "Please provide your feedback.";
        if (!studentGrade.trim()) newErrors.grade = "Please input your GWA.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validate()) return;
        onNext({
            feedback,
            student_grade: studentGrade,
            feedback_analysis: analysis?.sentiment ?? "",
            feedback_tone: analysis?.feedbackTone ?? "",
            descriptive_scale: analysis?.descriptiveScale ?? "",
            feedback_rating: analysis?.feedbackRating ?? 0,
            average_rating: analysis?.averageRating ?? 0,
            evaluation_matching: analysis?.isMatching ? "true" : "false",
        });
    };

    return (
        <div className="w-full">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 bg-violet-50 rounded-full px-4 py-1.5 mb-4">
                        <div className="w-2 h-2 rounded-full bg-violet-600" />
                        <span className="text-xs text-violet-600 font-semibold tracking-wide uppercase">
                            Feedback
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Comments & Feedback
                    </h2>

                    <p className="text-sm text-gray-400">
                        Please indicate your comments about this teacher. Use English language.
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-700">Instructor</p>
                    <p className="text-1xl font-bold text-violet-600">
                        {evaluatorData.faculty || "N/A"}
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

                <div className="flex flex-col gap-5">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Your Feedback <span className="text-violet-600">*</span>
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => {
                                setFeedback(e.target.value);
                                setErrors({ ...errors, feedback: "" });
                            }}
                            placeholder="Please use English language for your comment (Translation Not Supported). e.g. The professor explains clearly and is very approachable..."
                            rows={10}
                            className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition-all resize-none
                                focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                                ${errors.feedback ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                        />
                        <div className="flex justify-between items-center">
                            {errors.feedback
                                ? <p className="text-xs text-red-500">{errors.feedback}</p>
                                : <p className="text-xs text-gray-400">{feedback.length} characters</p>
                            }
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            GWA Last Semester <span className="text-violet-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={studentGrade}
                            onChange={(e) => {
                                setStudentGrade(e.target.value);
                                setErrors({ ...errors, grade: "" });
                            }}
                            placeholder="e.g. 1.50"
                            className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition-all
                                focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                                ${errors.grade ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                        />
                        {errors.grade && <p className="text-xs text-red-500">{errors.grade}</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {!feedback.trim() && !isAnalyzing && (
                        <div className="h-full min-h-[260px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200 bg-violet-50 p-6 text-center">
                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mb-3">
                                <div className="w-4 h-4 rounded-full bg-violet-300" />
                            </div>
                            <p className="text-sm font-medium text-violet-400">Analysis will appear here</p>
                            <p className="text-xs text-violet-300 mt-1">Start typing your feedback</p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="h-full min-h-[260px] flex flex-col items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 gap-3">
                            <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-violet-600 font-medium">Analyzing feedback...</p>
                        </div>
                    )}

                    {analysis && !isAnalyzing && feedback.trim() && (
                        <div className="flex flex-col gap-3">

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                    <p className="text-xs text-gray-400 mb-1">Feedback Rating</p>
                                    <p className="text-xl font-bold text-violet-600">
                                        {analysis.feedbackRating}
                                        <span className="text-xs text-gray-400 font-normal"> / 5</span>
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                    <p className="text-xs text-gray-400 mb-1">Descriptive Scale</p>
                                    <p className="text-sm font-semibold text-gray-800">{analysis.descriptiveScale}</p>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                    <p className="text-xs text-gray-400 mb-1">Overall Analysis</p>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getSentimentColor(analysis.sentiment)}`}>
                                        {analysis.sentiment}
                                    </span>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                    <p className="text-xs text-gray-400 mb-1">Feedback Tone</p>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getSentimentColor(analysis.feedbackTone)}`}>
                                        {analysis.feedbackTone}
                                    </span>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                    <p className="text-xs text-gray-400 mb-1">Average Rating</p>
                                    <p className="text-xl font-bold text-violet-600">
                                        {analysis.averageRating}
                                        <span className="text-xs text-gray-400 font-normal"> / 5</span>
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                    <p className="text-xs text-gray-400 mb-1">Matched</p>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${analysis.isMatching ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                                        {analysis.isMatching ? "True" : "False"}
                                    </span>
                                </div>
                            </div>

                            <div className="relative bg-white rounded-xl p-3 border border-gray-200 h-37">
                                <div
                                    ref={containerRef}
                                    className="flex flex-wrap gap-1 max-h-24 overflow-hidden pr-1"
                                >
                                    {analysis.sentences.map((s, i) => (
                                        <span
                                            key={i}
                                            className={`text-xs px-3 py-1.5 rounded-full border font-medium ${getSentimentColor(s.tone)}`}
                                        >
                                            {s.text}
                                            <span className="ml-1 opacity-60">
                                                ({s.score.toFixed(2)})
                                            </span>
                                        </span>
                                    ))}
                                </div>

                                {isOverflowing && (
                                    <div className="mt-2 flex justify-center">
                                        <button
                                            onClick={() => setShowAllSentences(true)}
                                            className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                                        >
                                            View more
                                        </button>
                                    </div>
                                )}
                            </div>


                            {showAllSentences && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-lg">
                                        <div className="flex justify-between items-center px-4 py-3 border-b">
                                            <p className="text-sm font-semibold text-gray-700">
                                                Full Sentence Breakdown
                                            </p>
                                            <button
                                                onClick={() => setShowAllSentences(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="p-4 overflow-y-auto max-h-[60vh] flex flex-col gap-2">
                                            {analysis.sentences.map((s, i) => (
                                                <div
                                                    key={i}
                                                    className="flex justify-between items-center border rounded-lg px-3 py-2"
                                                >
                                                    <p className="text-xs text-gray-700 flex-1">
                                                        {s.text}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-gray-400">
                                                            {s.score.toFixed(2)}
                                                        </span>
                                                        <span
                                                            className={`text-[10px] px-2 py-0.5 rounded-full border ${getSentimentColor(s.tone)}`}
                                                        >
                                                            {s.tone}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between">
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