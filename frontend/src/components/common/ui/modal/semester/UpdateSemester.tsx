interface UpdateSemesterProps {
    isOpen: boolean;
    onClose: () => void;
    newSemester: string;
    setNewSemester: (value: string) => void;
    error: string;
    setError: (value: string) => void;
    isSubmitting: boolean;
    onSubmit: () => void;
}


export default function UpdateSemesterModal({
    isOpen,
    onClose,
    newSemester,
    setNewSemester,
    error,
    setError,
    isSubmitting,
    onSubmit
}: UpdateSemesterProps) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Add New Semester</h3>
                <p className="text-sm text-gray-400 mb-5">Enter the new semester name to add it as the current semester.</p>

                <div className="flex flex-col gap-1.5 mb-5">
                    <label className="text-sm font-medium text-gray-700">Semester Name</label>
                    <input
                        type="text"
                        value={newSemester}
                        onChange={(e) => { setNewSemester(e.target.value); setError(""); }}
                        placeholder="e.g. FIRST SEMESTER A.Y. 2025-2026"
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition-all
                                    focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                                    ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-70 flex items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Adding...
                            </>
                        ) : "Add Semester"}
                    </button>
                </div>
            </div>
        </div>
    )
}