import { useEffect, useState } from "react";
import { getCurrentSemester } from "../../../backend/UserBackend/UserForm";

export default function LandingPage() {
    const [semester, setSemester] = useState("Loading...");

    useEffect(() => {
        async function fetchSemester() {
            try {
                const data = await getCurrentSemester();
                setSemester(data.data.semester);
            } catch (error) {
                setSemester("Unavailable");
            }
        }
        fetchSemester();
    }, []);

    return (
        <div className="relative min-h-screen bg-white overflow-hidden font-outfit">

            <div className="hidden md:block absolute -top-40 -right-32 w-[700px] h-[700px] lg:w-[1000px] lg:h-[1000px] rounded-full bg-[#f0c6f7] opacity-50" />
            <div className="hidden md:block absolute top-10 right-10 w-[550px] h-[550px] lg:w-[850px] lg:h-[850px] rounded-full bg-[#c9aff5] opacity-45" />
            <div className="hidden md:block absolute top-28 right-40 w-[400px] h-[400px] lg:w-[650px] lg:h-[650px] rounded-full bg-[#b3c8f5] opacity-40" />

            <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-5 md:py-7">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">iF</span>
                    </div>
                    <h2 className="text-sm md:text-base font-bold text-gray-900 tracking-widest">LSPU-SCC-CCS</h2>
                </div>
                <button className="md:hidden flex flex-col gap-1.5 p-2">
                    <div className="w-5 h-0.5 bg-gray-600" />
                    <div className="w-5 h-0.5 bg-gray-600" />
                    <div className="w-5 h-0.5 bg-gray-600" />
                </button>
            </nav>

            <div className="relative z-10 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] items-center px-6 md:px-16 gap-10 md:gap-16 py-10 md:py-0"
                    style={{ minHeight: 'calc(100vh - 88px)' }}>

                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-violet-50 rounded-full px-4 py-1.5 mb-5 md:mb-6">
                            <div className="w-2 h-2 rounded-full bg-violet-600" />
                            <span className="text-xs md:text-sm text-violet-600 font-semibold tracking-wide">{semester}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-5">
                            Intelligent Faculty <br />
                            <span className="text-violet-600">Evaluation System</span> <br />
                            for CCS
                        </h1>

                        <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8 md:mb-10 max-w-md mx-auto md:mx-0">
                            Rate your instructors objectively and help improve the quality of education at the College of Computer Studies.
                        </p>

                        <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
                            <a href="/afes"
                                className="px-6 md:px-8 py-3 md:py-3.5 bg-violet-600 text-white rounded-full text-sm font-semibold hover:bg-violet-700 transition-colors">
                                Proceed
                            </a>
                            <a href="#guide"
                                className="px-5 md:px-7 py-3 md:py-3.5 border-2 border-violet-200 text-violet-600 rounded-full text-sm font-semibold hover:bg-violet-50 transition-colors">
                                Quick Guide
                            </a>
                        </div>
                    </div>

                    <div className="flex justify-center items-center w-full">
                        <div className="relative w-[300px] h-[380px] md:w-[400px] md:h-[460px] lg:w-[480px] lg:h-[520px]">
                            <div className="absolute top-5 left-5 w-[260px] h-[340px] md:w-[350px] md:h-[420px] lg:w-[420px] lg:h-[480px] bg-violet-50 rounded-3xl border border-violet-100" />
                            <div className="absolute top-0 left-0 w-[260px] md:w-[350px] lg:w-[420px] bg-white rounded-3xl p-6 md:p-7 lg:p-9 border border-violet-100 shadow-lg">
                                <p className="text-xs md:text-sm text-gray-400 mb-2 tracking-widest uppercase">Overall Rating</p>
                                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 md:mb-6 lg:mb-7">
                                    4.8 <span className="text-base md:text-lg lg:text-xl text-violet-500 font-medium">/ 5.0</span>
                                </p>
                                {[
                                    { label: "Teaching Approach", value: 96 },
                                    { label: "Subject Mastery", value: 91 },
                                    { label: "Communication", value: 98 },
                                    { label: "Course Content", value: 88 },
                                ].map((item) => (
                                    <div key={item.label} className="mb-3 md:mb-4 lg:mb-5">
                                        <div className="flex justify-between text-xs md:text-sm text-gray-500 mb-1.5 md:mb-2">
                                            <span>{item.label}</span>
                                            <span className="font-medium">{item.value}%</span>
                                        </div>
                                        <div className="h-2 md:h-2.5 bg-violet-50 rounded-full">
                                            <div className="h-2 md:h-2.5 bg-violet-600 rounded-full"
                                                style={{ width: `${item.value}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex absolute bottom-10 left-16 flex-col gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-violet-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-violet-200" />
            </div>
        </div>
    );
}