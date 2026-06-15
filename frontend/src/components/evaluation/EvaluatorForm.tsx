import { useEffect, useState } from "react";
import {
    getSemesterList,
    getFacultyList,
    getSectionList,
    getSubjectList,
} from "../../../backend/UserBackend/UserForm";
import { type EvaluatorFormData } from "../../model/UserModel";

interface Props {
    onBack: () => void;
    onNext: (data: EvaluatorFormData) => void;
    initialData?: EvaluatorFormData;
}

export default function EvaluatorForm({ onBack, onNext, initialData }: Props) {
    const [semesters, setSemesters] = useState<{ semester: string }[]>([]);
    const [faculties, setFaculties] = useState<{ faculty: string }[]>([]);
    const [sections, setSections] = useState<{ sections: string }[]>([]);
    const [subjects, setSubjects] = useState<{ subject: string }[]>([]);
    const [form, setForm] = useState<EvaluatorFormData>(
        initialData ?? {
            email: "",
            name: "",
            section: "",
            semester: "",
            faculty: "",
            subject: "",
            date: new Date().toISOString().split("T")[0],
        }
    );
    const [errors, setErrors] = useState<Partial<EvaluatorFormData>>({});

    useEffect(() => {
        async function loadDropdowns() {
            try {
                const [sem, sec, fac, sub] = await Promise.all([
                    getSemesterList(),
                    getSectionList(),
                    getFacultyList(),
                    getSubjectList(),
                ]);
                setSemesters(sem.data ?? []);
                setSections(sec.data ?? []);
                setFaculties(fac.data ?? []);
                setSubjects(sub.data ?? []);
            } catch (err) {
                console.error("Failed to load dropdowns:", err);
            }
        }
        loadDropdowns();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors: Partial<EvaluatorFormData> = {};
        if (!form.email) newErrors.email = "Email is required";
        if (!form.name) newErrors.name = "Name is required";
        if (!form.section) newErrors.section = "Section is required";
        if (!form.semester) newErrors.semester = "Semester is required";
        if (!form.faculty) newErrors.faculty = "Faculty is required";
        if (!form.subject) newErrors.subject = "Subject is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext(form);
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Evaluator Information</h2>
                <p className="text-sm text-gray-400">Please fill in your details before proceeding to the evaluation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                        Email <span className="text-violet-600">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. juan@lspu.edu.ph"
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition-all
                            focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                            ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                        Full Name <span className="text-violet-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Juan P. Dela Cruz Jr."
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition-all
                            focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                            ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                        Section & Year <span className="text-violet-600">*</span>
                    </label>
                    <select
                        name="section"
                        value={form.section}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition-all
                            focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                            ${errors.section ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                    >
                        <option value="" disabled>Select Section & Year</option>
                        {sections.map((s) => (
                            <option key={s.sections} value={s.sections}>{s.sections}</option>
                        ))}
                    </select>
                    {errors.section && <p className="text-xs text-red-500">{errors.section}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                        Semester <span className="text-violet-600">*</span>
                    </label>
                    <select
                        name="semester"
                        value={form.semester}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition-all
                            focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                            ${errors.semester ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                    >
                        <option value="" disabled>Select Semester</option>
                        {semesters.map((s) => (
                            <option key={s.semester} value={s.semester}>{s.semester}</option>
                        ))}
                    </select>
                    {errors.semester && <p className="text-xs text-red-500">{errors.semester}</p>}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                        Instructor / Professor <span className="text-violet-600">*</span>
                    </label>
                    <select
                        name="faculty"
                        value={form.faculty}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition-all
                            focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                            ${errors.faculty ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                    >
                        <option value="" disabled>Select Faculty Member</option>
                        {faculties.map((f) => (
                            <option key={f.faculty} value={f.faculty}>{f.faculty}</option>
                        ))}
                    </select>
                    {errors.faculty && <p className="text-xs text-red-500">{errors.faculty}</p>}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                        Subject <span className="text-violet-600">*</span>
                    </label>
                    <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition-all
                            focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                            ${errors.subject ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                    >
                        <option value="" disabled>Select Subject</option>
                        {subjects.map((s) => (
                            <option key={s.subject} value={s.subject}>{s.subject}</option>
                        ))}
                    </select>
                    {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
                </div>
            </div>

            <div className="flex justify-between mt-10">
                <button
                    onClick={onBack}
                    className="px-7 py-3 border-2 border-violet-200 text-violet-600 rounded-full text-sm font-semibold hover:bg-violet-50 transition-colors">
                    ← Exit
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