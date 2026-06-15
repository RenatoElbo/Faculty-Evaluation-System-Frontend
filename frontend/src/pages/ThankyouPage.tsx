import PageMeta from "../components/common/PageMeta";
import { useNavigate } from "react-router-dom";

export default function ThankyouPage() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    };

    return (
        <>
            <PageMeta
                title="IFES | Thank You"
                description="Evaluation submitted successfully"
            />

            <div className="min-h-screen flex items-center justify-center bg-violet-50 px-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-md w-full text-center">

                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Thank You!
                    </h1>

                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        Your evaluation has been successfully submitted.
                        We appreciate your feedback and time.
                    </p>

                    <button
                        onClick={goHome}
                        className="px-6 py-3 bg-violet-600 text-white rounded-full text-sm font-semibold hover:bg-violet-700 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </>
    );
}