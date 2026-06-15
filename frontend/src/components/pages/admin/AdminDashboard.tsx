import { useEffect, useState } from "react";
import AppLayout from "../../../layout/AppLayout";
import { getDashboardData } from "../../../../backend/AdminBackend/AdminForm";
import { type DashboardData } from "../../../model/UserModel";

function DonutChart({
    value,
    total,
    color,
    label,
}: {
    value: number;
    total: number;
    color: string;
    label: string;
}) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="16" />
                    <circle
                        cx="80" cy="80" r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{value}</span>
                    <span className="text-xs text-gray-400">{label}</span>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData>({
        currentSemester: "Loading...",
        totalRespondents: [],
        totalFaculties: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const res = await getDashboardData();
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard:", error);
                setData({
                    currentSemester: "Unavailable",
                    totalRespondents: [],
                    totalFaculties: [],
                });
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    
    const totalRespondents = data.totalRespondents.reduce((sum, s) => sum + s.count, 0);
    const totalFaculties = data.totalFaculties.reduce((sum, f) => sum + f.count, 0);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">Loading dashboard...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="w-full font-outfit">

                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Welcome, {localStorage.getItem("name")}
                    </h1>
                    <div className="inline-flex items-center gap-2 bg-violet-50 rounded-full px-3 py-1 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                        <span className="text-sm text-violet-600 font-semibold tracking-wide">
                            {data.currentSemester}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
                        <div className="w-full mb-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                Total Respondents
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900">{totalRespondents}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Students who submitted evaluations</p>
                        </div>

                        <DonutChart
                            value={totalRespondents}
                            total={totalRespondents + 50}
                            color="#7c3aed"
                            label="Responses"
                        />

                        <div className="flex items-center gap-4 mt-6 w-full">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-violet-600" />
                                <span className="text-xs text-gray-500">Submitted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200" />
                                <span className="text-xs text-gray-500">Remaining</span>
                            </div>
                        </div>

                        {data.totalRespondents.length > 0 && (
                            <div className="w-full mt-5 pt-5 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                    By Section
                                </p>
                                <div className="flex flex-col gap-2">
                                    {data.totalRespondents.map((s) => (
                                        <div key={s.section} className="flex justify-between items-center">
                                            <span className="text-xs text-gray-600">{s.section}</span>
                                            <span className="text-xs font-semibold text-violet-600">{s.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
                        <div className="w-full mb-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                Total Faculties Got Evaluated
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900">{totalFaculties}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Instructors who have been evaluated</p>
                        </div>

                        <DonutChart
                            value={totalFaculties}
                            total={totalFaculties + 10}
                            color="#a78bfa"
                            label="Faculties"
                        />

                        <div className="flex items-center gap-4 mt-6 w-full">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-violet-400" />
                                <span className="text-xs text-gray-500">Active</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200" />
                                <span className="text-xs text-gray-500">Remaining</span>
                            </div>
                        </div>

                        {data.totalFaculties.length > 0 && (
                            <div className="w-full mt-5 pt-5 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                    By Faculty
                                </p>
                                <div className="flex flex-col gap-2">
                                    {data.totalFaculties.map((f) => (
                                        <div key={f.faculty} className="flex justify-between items-center">
                                            <span className="text-xs text-gray-600 truncate max-w-[180px]">{f.faculty}</span>
                                            <span className="text-xs font-semibold text-violet-600">{f.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}