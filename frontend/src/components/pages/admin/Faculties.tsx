import { getDeanList, getFacultyList, addFaculty, updateFaculty, deleteFaculty, updateDean } from "../../../../backend/AdminBackend/AdminForm";
import { getSectionList, getSubjectList } from "../../../../backend/UserBackend/UserForm";
import { useEffect, useState } from "react";
import AppLayout from "../../../layout/AppLayout";
import type { Faculty } from "../../../model/UserModel";
import Pagination from "../../common/Pagination";
import Toast from "../../common/ui/alert/Toast";
import AddDeanModal from "../../common/ui/modal/faculties/AddDeanModal";
import AddFacultyModal from "../../common/ui/modal/faculties/AddFacultyModal";
import EditFacultyModal from "../../common/ui/modal/faculties/EditFacultyModal";
import RemoveFacultyModal from "../../common/ui/modal/faculties/RemoveFacultyModal";

export default function Faculties() {
    const [dean, setDean] = useState({ id: 0, dean: "" });
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [search, setSearch] = useState("");
    const [sortColumn, setSortColumn] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState<{
        variant: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    } | null>(null);

    const [sections, setSections] = useState<{ sections: string }[]>([]);
    const [subjects, setSubjects] = useState<{ subject: string }[]>([]);
    const [expandedCell, setExpandedCell] = useState<string | null>(null);

    const [deanModalOpen, setDeanModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

    const [newDean, setNewDean] = useState("");
    const [newFaculty, setNewFaculty] = useState<{ name: string; academic_rank: string; status: string; section_handle: any[]; subject_handle: any[] }>({ name: "", academic_rank: "", status: "", section_handle: [], subject_handle: [] });
    const [editFaculty, setEditFaculty] = useState<{ name: string; academic_rank: string; status: string; section_handle: any[]; subject_handle: any[] }>({ name: "", academic_rank: "", status: "", section_handle: [], subject_handle: [] });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10

    useEffect(() => { setCurrentPage(1); }, [search]);

    async function fetchData() {
        try {
            const [deanRes, facultyRes] = await Promise.all([
                getDeanList(),
                getFacultyList(sortColumn, sortDirection),
            ]);
            setDean({ id: deanRes?.data.id ?? 0, dean: deanRes?.data.dean ?? "No dean assigned" });
            setFaculties(facultyRes?.data ?? []);
        } catch {
            setDean({ id: 0, dean: "No dean assigned" });
            setFaculties([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchData(); }, [sortColumn, sortDirection]);

    useEffect(() => {
        async function loadDropdowns() {
            try {
                const [sec, sub] = await Promise.all([
                    getSectionList(),
                    getSubjectList(),
                ]);
                setSections(sec.data ?? []);
                setSubjects(sub.data ?? []);
            } catch (err) {
                console.error("Failed to load dropdowns:", err);
            }
        }
        loadDropdowns();
    }, []);

    const handleSort = (col: string) => {
        if (sortColumn === col) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    const cellKey = (id: number, field: string) => `${id}-${field}`;

    const filtered = faculties.filter((f) =>
        f.faculty?.toLowerCase().includes(search.toLowerCase()) ||
        f.academic_rank?.toLowerCase().includes(search.toLowerCase()) ||
        f.status?.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleUpdateDean = async () => {
        if (!newDean.trim()) {
            setError("Dean name is required.");
            return;
        }
        try {
            setIsSubmitting(true);
            await updateDean(dean.id, newDean);
            setToast({
                variant: "success",
                title: "Success",
                message: newDean + " Added Successfully.",
            });
            setDeanModalOpen(false);
            setNewDean("");
            setError("");
            await fetchData();
        } catch {
            setError("Failed to update dean.");
            setToast({
                variant: "error",
                title: "Error",
                message: "Something went wrong.",
            });
        }
        finally { setIsSubmitting(false); }
    };

    const handleAddFaculty = async () => {
        if (!newFaculty.name.trim() || !newFaculty.academic_rank.trim() || !newFaculty.status.trim()) {
            setError("Please fill in all fields.");
            return;
        }
        try {
            setIsSubmitting(true);
            await addFaculty(newFaculty.name, newFaculty.academic_rank, newFaculty.status, newFaculty.section_handle, newFaculty.subject_handle);
            setToast({
                variant: "success",
                title: "Success",
                message: newFaculty.name + " Added Successfully.",
            });
            setAddModalOpen(false);
            setNewFaculty({ name: "", academic_rank: "", status: "", section_handle: [], subject_handle: [] });
            setError("");
            await fetchData();
        } catch {
            setError("Failed to add faculty.");
            setToast({
                variant: "error",
                title: "Error",
                message: "Something went wrong.",
            });
        }
        finally { setIsSubmitting(false); }
    };

    const handleEditFaculty = async () => {
        if (!selectedFaculty) return;
        if (!editFaculty.name.trim() || !editFaculty.academic_rank.trim() || !editFaculty.status.trim() || !editFaculty.section_handle || !editFaculty.subject_handle) {
            setError("Please fill in all fields.");
            return;
        }
        try {
            setIsSubmitting(true);
            await updateFaculty(selectedFaculty.id, editFaculty.name, editFaculty.academic_rank, editFaculty.status, editFaculty.section_handle, editFaculty.subject_handle);
            setToast({
                variant: "success",
                title: "Success",
                message: editFaculty.name + " Updated Successfully.",
            });
            setEditModalOpen(false);
            setSelectedFaculty(null);
            setError("");
            await fetchData();
        } catch {
            setError("Failed to update faculty.");
            setToast({
                variant: "error",
                title: "Error",
                message: "Something went wrong.",
            });
        }
        finally { setIsSubmitting(false); }
    };

    const handleDeleteFaculty = async () => {
        if (!selectedFaculty) return;
        try {
            setIsSubmitting(true);
            await deleteFaculty(selectedFaculty.id);
            setToast({
                variant: "success",
                title: "Success",
                message: "Faculty Removed Successfully.",
            });
            setDeleteModalOpen(false);
            setSelectedFaculty(null);
            await fetchData();
        } catch {
            setToast({
                variant: "error",
                title: "Error",
                message: "Something went wrong.",
            });
        }
        finally { setIsSubmitting(false); }
    };

    const normalizeArray = (value: any): string[] => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return [];
    };

    const SortIcon = ({ col }: { col: string }) => (
        sortColumn === col ? (
            <svg className={`w-3 h-3 inline-block ml-1 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        ) : (
            <svg className="w-3 h-3 inline-block ml-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        )
    );

    const statusColor = (status: string) => {
        if (status === "Regular") return "bg-green-50 text-green-700 border-green-200";
        if (status === "Part-time") return "bg-blue-50 text-blue-700 border-blue-200";
        return "bg-gray-50 text-gray-600 border-gray-200";
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">Loading faculties...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="w-full font-outfit">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">CCS Faculties</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage faculty information for IFES evaluations.</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                Current Dean
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                                    <span className="text-violet-600 text-xs font-bold">
                                        {dean.dean?.charAt(0) ?? "?"}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{dean.dean}</h2>
                            </div>
                        </div>
                        <button
                            onClick={() => { setDeanModalOpen(true); setNewDean(dean.dean); setError(""); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors shrink-0">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Update Dean
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search faculty name, rank, or status..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
                        />
                    </div>
                    <button
                        onClick={() => { setAddModalOpen(true); setNewFaculty({ name: "", academic_rank: "", status: "", section_handle: [], subject_handle: [] }); setError(""); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Faculty
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-500">No faculties found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search or add a new faculty.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        {[
                                            { label: "Name", col: "name" },
                                            { label: "Academic Rank", col: "academic_rank" },
                                            { label: "Status", col: "status" },
                                            { label: "Sections", col: "section_handle" },
                                            { label: "Subjects", col: "subject_handle" }
                                        ].map(({ label, col }) => (
                                            <th key={col}
                                                onClick={() => handleSort(col)}
                                                className="cursor-pointer px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest hover:text-gray-700 select-none">
                                                {label}
                                                <SortIcon col={col} />
                                            </th>
                                        ))}
                                        <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.map((faculty) => (
                                        <tr key={faculty.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                                                        <span className="text-violet-600 text-xs font-semibold">
                                                            {faculty.faculty?.charAt(0) ?? "?"}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-800">{faculty.faculty}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-gray-600">{faculty.academic_rank}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor(faculty.status)}`}>
                                                    {faculty.status}
                                                </span>
                                            </td>
                                            <td
                                                className="px-5 py-3.5 text-sm text-gray-600 max-w-xs cursor-pointer hover:text-violet-600 transition-all duration-200"
                                                onClick={() =>
                                                    setExpandedCell(
                                                        expandedCell === cellKey(faculty.id, "section")
                                                            ? null
                                                            : cellKey(faculty.id, "section")
                                                    )
                                                }
                                            >
                                                <span className="block">
                                                    {expandedCell === cellKey(faculty.id, "section") ? (
                                                        faculty.section_handle?.length > 0
                                                            ? faculty.section_handle.join(", ")
                                                            : "None"
                                                    ) : (
                                                        <span className="block truncate">
                                                            {faculty.section_handle?.length > 0
                                                                ? faculty.section_handle.join(", ")
                                                                : "None"}
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td
                                                className="px-5 py-3.5 text-sm text-gray-600 max-w-xs cursor-pointer hover:text-violet-600 transition-all duration-200"
                                                onClick={() =>
                                                    setExpandedCell(
                                                        expandedCell === cellKey(faculty.id, "subject")
                                                            ? null
                                                            : cellKey(faculty.id, "subject")
                                                    )
                                                }
                                            >
                                                <span className="block">
                                                    {expandedCell === cellKey(faculty.id, "subject") ? (
                                                        faculty.subject_handle?.length > 0
                                                            ? faculty.subject_handle.join(", ")
                                                            : "None"
                                                    ) : (
                                                        <span className="block truncate">
                                                            {faculty.subject_handle?.length > 0
                                                                ? faculty.subject_handle.join(", ")
                                                                : "None"}
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedFaculty(faculty);
                                                            setEditFaculty({ name: faculty.faculty, academic_rank: faculty.academic_rank, status: faculty.status, section_handle: normalizeArray(faculty.section_handle), subject_handle: normalizeArray(faculty.subject_handle) });
                                                            setEditModalOpen(true);
                                                            setError("");
                                                        }}
                                                        className="p-1.5 rounded-lg text-violet-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                                                        title="Edit">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedFaculty(faculty);
                                                            setDeleteModalOpen(true);
                                                        }}
                                                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                        title="Delete">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filtered.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>

                {faculties.length > 0 && (
                    <p className="text-xs text-gray-400 mt-3 text-right">
                        Showing {filtered.length} of {faculties.length} faculties
                    </p>
                )}
            </div>

            {[
                <AddDeanModal
                    isOpen={deanModalOpen}
                    onClose={() => setDeanModalOpen(false)}
                    newDean={newDean}
                    title="Update Dean"
                    description="Enter the name of the new dean."
                    setNewDean={setNewDean}
                    error={error}
                    setError={setError}
                    isSubmitting={isSubmitting}
                    onSubmit={handleUpdateDean}
                />,

                <AddFacultyModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    newFaculty={newFaculty}
                    title="Add Faculty"
                    description="Fill in the faculty details below."
                    setNewFaculty={setNewFaculty}
                    sections={sections}
                    subjects={subjects}
                    error={error}
                    setError={setError}
                    isSubmitting={isSubmitting}
                    onSubmit={handleAddFaculty}
                />,

                <EditFacultyModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    editFaculty={editFaculty}
                    title="Edit Faculty"
                    description="Update the faculty details below."
                    setEditFaculty={setEditFaculty}
                    sections={sections}
                    subjects={subjects}
                    error={error}
                    setError={setError}
                    isSubmitting={isSubmitting}
                    onSubmit={handleEditFaculty}
                />,

                <RemoveFacultyModal
                    isOpen={deleteModalOpen} 
                    onClose={() => setDeleteModalOpen(false)}
                    faculty={selectedFaculty?.faculty ?? "No Faculty Selected"}
                    title="Remove Faculty"
                    description="Are you sure you want to delete this faculty?"
                    isSubmitting={isSubmitting}
                    onSubmit={handleDeleteFaculty}
                />
                
            ]}
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