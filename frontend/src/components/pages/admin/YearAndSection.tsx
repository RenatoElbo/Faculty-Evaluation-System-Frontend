import { useEffect, useState } from "react";
import { getSectionListAdmin, addSection, removeSection } from "../../../../backend/AdminBackend/AdminForm";
import AppLayout from "../../../layout/AppLayout";
import Toast from "../../common/ui/alert/Toast";
import type { Section } from "../../../model/UserModel";
import AddProgramModal from "../../common/ui/modal/section/AddNewProgram";
import RemoveFacultyModal from "../../common/ui/modal/faculties/RemoveFacultyModal";

export default function YearAndSection() {
    const [sections, setSections] = useState<Section[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [newSection, setNewSection] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState<{
        variant: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    } | null>(null);

    async function fetchSections() {
        try {
            const res = await getSectionListAdmin();
            setSections(res.data ?? []);
        } catch {
            setSections([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchSections(); }, []);

    const categories = [...new Set(sections.map((s) => s.category))].sort();

    const filtered = sections.filter((s) =>
        s.sections.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = categories.reduce((acc, cat) => {
        const rows = filtered.filter((s) => s.category === cat);
        if (rows.length > 0) acc[cat] = rows;
        return acc;
    }, {} as Record<string, Section[]>);

    const handleAddSection = async () => {
        const trimmed = newSection.trim();
        if (!trimmed) {
            setError("Please enter a section name.");
            return;
        }
        try {
            setIsSubmitting(true);
            await addSection(trimmed);
            setToast({
                variant: "success",
                title: "Success",
                message: trimmed + " Added Successfully",
            });
            setNewSection("");
            setAddModalOpen(false);
            setError("");
            await fetchSections();
        } catch {
            setError("Failed to add section.");
            setToast({
                variant: "error",
                title: "Error",
                message: "Something went wrong.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveSection = async () => {
        if (!selectedSection) return;
        try {
            setIsSubmitting(true);
            await removeSection(selectedSection.id);
            setToast({
                variant: "success",
                title: "Success",
                message: "Removed Successfully",
            });
            setRemoveModalOpen(false);
            setSelectedSection(null);
            await fetchSections();
        } catch {
            setToast({
                variant: "error",
                title: "Error",
                message: "Something went wrong.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRowClick = (section: Section) => {
        setSelectedSection((prev) =>
            prev?.id === section.id ? null : section
        );
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">Loading sections...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="w-full font-outfit">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Year and Sections</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage year and section information.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search sections..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
                        />
                    </div>

                    <div className="flex gap-3 shrink-0">
                        <button
                            onClick={() => { setAddModalOpen(true); setError(""); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create
                        </button>
                        <button
                            onClick={() => setRemoveModalOpen(true)}
                            disabled={!selectedSection}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all
                                ${selectedSection
                                    ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100 cursor-pointer"
                                    : "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                                }`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {Object.keys(grouped).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-500">No sections found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search or add a new section.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        {categories.filter(cat => grouped[cat]).map((cat) => (
                                            <th key={cat}
                                                className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                                {cat}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({
                                        length: Math.max(...Object.values(grouped).map((g) => g.length))
                                    }).map((_, rowIndex) => (
                                        <tr key={rowIndex} className="border-b border-gray-100">
                                            {categories.filter(cat => grouped[cat]).map((cat) => {
                                                const section = grouped[cat]?.[rowIndex];
                                                const isSelected = selectedSection?.id === section?.id;

                                                return (
                                                    <td key={cat} className="px-5 py-3">
                                                        {section ? (
                                                            <button
                                                                onClick={() => handleRowClick(section)}
                                                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all w-full text-left
                                                                    ${isSelected
                                                                        ? "bg-violet-600 text-white"
                                                                        : "hover:bg-violet-50 hover:text-violet-700 text-gray-700"
                                                                    }`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? "bg-white" : "bg-violet-400"}`} />
                                                                {section.sections}
                                                            </button>
                                                        ) : null}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {sections.length > 0 && (
                    <p className="text-xs text-gray-400 mt-3 text-right">
                        Showing {filtered.length} of {sections.length} sections
                    </p>
                )}
            </div>

            <AddProgramModal
               isOpen={addModalOpen}
               onClose={() => setAddModalOpen(false)}
               newSection={newSection}
               setNewSection={setNewSection}
               error={error}
               setError={setError}
               isSubmitting={isSubmitting}
               onSubmit={handleAddSection}     
            />

            <RemoveFacultyModal
                isOpen={removeModalOpen}
                onClose={() => setRemoveModalOpen(false)}
                faculty={selectedSection?.sections ?? "No Section selected"}
                title="Remove Section"
                description="Are you sure you want to remove this section?"
                isSubmitting={isSubmitting}
                onSubmit={handleRemoveSection}
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