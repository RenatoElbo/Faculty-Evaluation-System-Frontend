import { TagMultiSelect } from "../../../TagMultiSelect";

interface EditFacultyProps {
    isOpen: boolean;
    onClose: () => void;

    editFaculty: {
        name: string;
        academic_rank: string;
        status: string;
        section_handle: string[];
        subject_handle: string[];
    };
    title: string;
    description: string;
    setEditFaculty: React.Dispatch<
        React.SetStateAction<{
            name: string;
            academic_rank: string;
            status: string;
            section_handle: string[];
            subject_handle: string[];
        }>
    >;

    sections: { sections: string }[];
    subjects: { subject: string }[];

    error: string;
    setError: (value: string) => void;

    isSubmitting: boolean;

    onSubmit: () => void;
}

export default function EditFacultyModal({
    isOpen,
    onClose,
    editFaculty,
    title,
    description,
    setEditFaculty,
    sections,
    subjects,
    error,
    setError,
    isSubmitting,
    onSubmit,
}: EditFacultyProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {title}
                </h3>

                <p className="text-sm text-gray-400 mb-5">
                    {description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">

                    <div className="flex flex-col gap-4">

                        {[
                            {
                                label: "Faculty Name",
                                key: "name",
                                placeholder: "e.g. Dela Cruz, Juan P."
                            },
                            {
                                label: "Academic Rank",
                                key: "academic_rank",
                                placeholder: "e.g. Instructor I"
                            },
                        ].map(({ label, key, placeholder }) => (
                            <div
                                key={key}
                                className="flex flex-col gap-1.5"
                            >
                                <label className="text-sm font-medium text-gray-700">
                                    {label}
                                </label>

                                <input
                                    type="text"
                                    value={editFaculty[key as keyof typeof editFaculty] as string}
                                    onChange={(e) => {
                                        setEditFaculty({
                                            ...editFaculty,
                                            [key]: e.target.value
                                        });

                                        setError("");
                                    }}
                                    placeholder={placeholder}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                />
                            </div>
                        ))}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <select
                                value={editFaculty.status}
                                onChange={(e) => {
                                    setEditFaculty({
                                        ...editFaculty,
                                        status: e.target.value
                                    });

                                    setError("");
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                            >
                                <option value="" disabled>
                                    Select Status
                                </option>

                                <option value="Regular">
                                    Permanent
                                </option>

                                <option value="Part-time">
                                    Parttime
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">

                        <TagMultiSelect
                            label="Sections"
                            options={sections.map((s) => s.sections)}
                            selected={editFaculty.section_handle}
                            setSelected={(values) =>
                                setEditFaculty({
                                    ...editFaculty,
                                    section_handle: values
                                })
                            }
                        />

                        <TagMultiSelect
                            label="Subjects"
                            options={subjects.map((s) => s.subject)}
                            selected={editFaculty.subject_handle}
                            setSelected={(values) =>
                                setEditFaculty({
                                    ...editFaculty,
                                    subject_handle: values
                                })
                            }
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-xs text-red-500 mb-3">
                        {error}
                    </p>
                )}

                <div className="flex gap-3 justify-end">

                    <button
                        onClick={() => {
                            onClose();
                            setError("");
                        }}
                        className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Faculty"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}