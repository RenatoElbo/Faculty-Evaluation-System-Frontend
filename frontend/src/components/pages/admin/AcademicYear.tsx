import { useEffect, useState } from "react";
import AppLayout from "../../../layout/AppLayout";
import { getCurrentSemester } from "../../../../backend/UserBackend/UserForm";
import { addSemester, removeSemester, getPreviousSemesters } from "../../../../backend/AdminBackend/AdminForm";
import Toast from "../../common/ui/alert/Toast";
import UpdateSemesterModal from "../../common/ui/modal/semester/UpdateSemester";

export default function AcademicYearPage() {
    const [currentSemester, setCurrentSemester] = useState("Loading...");
    const [semId, setSemId] = useState<number | null>(null);
    const [semesterList, setSemesterList] = useState<{ semester: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newSemester, setNewSemester] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState<{
        variant: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    } | null>(null);

    async function fetchData() {
        try {
            const [semRes, semListRes] = await Promise.all([
                getCurrentSemester(),
                getPreviousSemesters(),
            ]);
            setCurrentSemester(semRes.data.semester ?? "No Semester Available Yet");
            setSemId(semRes.data.id);
            setSemesterList(semListRes.data ?? []);
        } catch {
            setCurrentSemester("No Semester Available Yet");
            setSemesterList([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchData(); }, []);

    const handleAddSemester = async () => {
        if (!newSemester.trim()) {
            setError("Please enter a semester name.");
            return;
        }
        else if (semId === null) {
            setError("Unable to remove semester. Semester id is not available.");
            return;
        }
        try {
            setIsSubmitting(true);
            await addSemester(newSemester.trim());
            await removeSemester(semId);
            setToast({
                variant: "success",
                title: "Success",
                message: "Semester Updated Successfully.",
            });
            setNewSemester("");
            setAddModalOpen(false);
            setError("");
            await fetchData();
        } catch {
            setError("Failed to add semester.");
            setToast({
                variant: "error",
                title: "Error",
                message: "Something went wrong.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">Loading academic year...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="w-full font-outfit">

                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Academic Year</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage current and previous semesters.</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                Current Semester
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                    {currentSemester}
                                </h2>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">This is the active evaluation semester.</p>
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <button
                                onClick={() => { setAddModalOpen(true); setError(""); }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Semester
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                        Previous Semesters
                    </p>

                    {semesterList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-500">No previous semesters</p>
                            <p className="text-xs text-gray-400 mt-1">Previous semesters will appear here.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {semesterList.map((sem, index) => (
                                <div key={index}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                        <span className="text-sm font-medium text-gray-700">{sem.semester}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded-full">
                                        Previous
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

             <UpdateSemesterModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                newSemester={newSemester}
                setNewSemester={setNewSemester} 
                error={error}
                setError={setError}
                isSubmitting={isSubmitting}
                onSubmit={handleAddSemester}
            />

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