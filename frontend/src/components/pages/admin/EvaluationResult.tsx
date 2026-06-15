import { useEffect, useState } from "react";
import AppLayout from "../../../layout/AppLayout";
import Pagination from "../../common/Pagination";
import { getEvaluationResults, getSemesterList } from "../../../../backend/AdminBackend/AdminForm";
import type { EvaluationResult } from "../../../model/UserModel";
import Toast from "../../common/ui/alert/Toast";


function feedbackAnalysisColor(analysis: string) {
    if (analysis === "Positive") return "bg-green-50 text-green-700 border-green-200";
    if (analysis === "Neutral") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-red-50 text-red-700 border-red-200";
}

function matchingColor(matching: string) {
    return matching === "true"
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-red-50 text-red-700 border-red-200";
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-PH", {
        year: "numeric", month: "short", day: "numeric"
    });
}

export default function EvaluationResult() {
    const [totalResponse, setTotalResponse] = useState(0);
    const [results, setResults] = useState<EvaluationResult[]>([]);
    const [semesters, setSemesters] = useState<{ semester: string }[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const itemsPerPage = 10;
    const [toast, setToast] = useState<{
        variant: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    } | null>(null);

    async function fetchResults(semester: string | null) {
        try {
            setLoading(true);
            const semesterParam = semester ?? null;
            const res = await getEvaluationResults(semesterParam);
            setTotalResponse(res.data?.totalResponse?.total ?? 0);
            setResults(res.data?.evaluationResults ?? []);
        } catch {
            setTotalResponse(0);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    async function fetchSemesters() {
        try {
            const res = await getSemesterList();
            setSemesters(res.data ?? []);
        } catch {
            setSemesters([]);
        }
    }

    useEffect(() => {
        fetchSemesters();
        fetchResults(null);
    }, []);

    const handleSemesterChange = (value: string) => {
        const sem = value === "all" ? null : value;
        setSelectedSemester(sem);
        setCurrentPage(1);
        fetchResults(sem);
    };

    const filtered = results.filter((r) =>
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.faculty?.toLowerCase().includes(search.toLowerCase()) ||
        r.section?.toLowerCase().includes(search.toLowerCase()) ||
        r.subject?.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => { setCurrentPage(1); }, [search]);

    const handleExportCSV = async () => {
        try {
            setIsExporting(true);
            const res = await getEvaluationResults(selectedSemester ?? null);
            const data: EvaluationResult[] = res.data?.evaluationResults ?? [];

            const headers = [
                "Email", "Name", "Section", "Date", "Semester",
                "Faculty", "Subject", "Q1", "Q2", "Q3", "Q4", "Q5",
                "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12", "Q13",
                "Q14", "Q15", "Q16", "Q17", "Q18", "Q19", "Q20",
                "Q21", "Q22", "Q23", "Feedback", "Feedback Analysis",
                "Feedback Tone", "Descriptive Scale", "Student Grade",
                "Average Rating", "Feedback Rating", "Evaluation Matching"
            ];

            const rows = data.map((r: any) => [
                `"${(r.email ?? "").replace(/"/g, '""')}"`,
                `"${(r.name ?? "").replace(/"/g, '""')}"`,
                `"${(r.section ?? "").replace(/"/g, '""')}"`,
                `"${formatDate(r.date)}"`,
                `"${(r.semester ?? "").replace(/"/g, '""')}"`,
                `"${(r.faculty ?? "").replace(/"/g, '""')}"`,
                `"${(r.subject ?? "").replace(/"/g, '""')}"`,
                r.q1, r.q2, r.q3, r.q4, r.q5,
                r.q6, r.q7, r.q8, r.q9, r.q10,
                r.q11, r.q12, r.q13, r.q14, r.q15,
                r.q16, r.q17, r.q18, r.q19, r.q20,
                r.q21, r.q22, r.q23,
                `"${(r.feedback ?? "").replace(/"/g, '""')}"`,
                `"${(r.feedback_analysis ?? "").replace(/"/g, '""')}"`,
                `"${(r.feedback_tone ?? "").replace(/"/g, '""')}"`,
                `"${(r.descriptive_scale ?? "").replace(/"/g, '""')}"`,
                `"${(r.student_grade ?? "").replace(/"/g, '""')}"`,
                r.average_rating,
                r.feedback_rating,
                `"${(r.evaluation_matching ?? "").replace(/"/g, '""')}"`
            ]);

            const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `evaluation-results-${selectedSemester ?? "all"}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            setToast({
                variant: "success",
                title: "Success",
                message: "Exporting to CSV Successfully.",
            });
        } catch {
            setToast({
                variant: "error",
                title: "Error",
                message: "Something went wrong.",
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <AppLayout>
            <div className="w-full font-outfit">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Evaluation Results</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage results of student evaluations.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">

                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shrink-0">
                        <span className="text-sm text-gray-500 font-bold">
                            Total Responses: <span className="text-violet-600 font-bold">{totalResponse}</span>
                        </span>
                    </div>

                    <div className="relative flex-1 w-full">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, faculty, section, or subject..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
                        />
                    </div>

                    <select
                        onChange={(e) => handleSemesterChange(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white shrink-0">
                        <option value="all">All Semesters</option>
                        {semesters.map((s) => (
                            <option key={s.semester} value={s.semester}>{s.semester}</option>
                        ))}
                    </select>

                    <div className="relative group shrink-0">
                        <button
                            onClick={handleExportCSV}
                            disabled={isExporting || filtered.length === 0}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50">
                            {isExporting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            )}
                            <span className="hidden sm:block">Export</span>
                        </button>
                        <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Export as .csv
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-gray-400">Loading results...</p>
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-500">No results found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search or semester filter.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            {[
                                                "Name", "Section", "Date", "Semester",
                                                "Faculty", "Subject", "Avg Rating",
                                                "Feedback Analysis", "Tone",
                                                "Descriptive Scale", "GWA", "Matched"
                                            ].map((label) => (
                                                <th key={label}
                                                    className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                                                    {label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.map((r) => (
                                            <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 whitespace-nowrap">{r.name}</p>
                                                            <p className="text-xs text-gray-400">{r.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{r.section}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{formatDate(r.date)}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap max-w-[180px] truncate">{r.semester}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{r.faculty}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[160px] truncate">{r.subject}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${r.average_rating >= 4.5 ? "bg-green-50 text-green-700 border-green-200" :
                                                        r.average_rating >= 3.5 ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                            r.average_rating >= 2.5 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                                                "bg-red-50 text-red-700 border-red-200"
                                                        }`}>
                                                        {r.average_rating?.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${feedbackAnalysisColor(r.feedback_analysis)}`}>
                                                        {r.feedback_analysis}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{r.feedback_tone}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{r.descriptive_scale}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-600">{r.student_grade}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${matchingColor(r.evaluation_matching)}`}>
                                                        {r.evaluation_matching === "true" ? "True" : "False"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalItems={filtered.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </div>
            {toast && (
                <Toast
                    variant={toast.variant}
                    title={toast.title}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </AppLayout>
    );
}