import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    };

    return (
        <>
            <PageMeta
                title="404 - Page Not Found"
                description="The page you are looking for does not exist."
            />

            <div className="min-h-screen flex items-center justify-center bg-blue-50 px-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-md w-full text-center">

                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        404 - Page Not Found
                    </h1>

                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        The page you are trying to access does not exist
                        or may have been moved.
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