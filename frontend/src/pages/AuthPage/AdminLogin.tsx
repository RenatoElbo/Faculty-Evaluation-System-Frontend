import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { checkUserCredentials } from "../../../backend/UserBackend/UserForm";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setError("Please fill in all fields.");
            return;
        }
        try {
            setIsLoading(true);
            const res = await checkUserCredentials(form.username, form.password);
            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 1000);
            localStorage.setItem("name", res.data.username);
            localStorage.setItem("user_id", res.data.id);
        } catch {
            setError("Invalid username or password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PageMeta
                title="IFES - Admin Login"
                description="Admin Login Page"
            />

            <div className="relative min-h-screen bg-gray-50 font-outfit flex items-center justify-center px-4 overflow-hidden">

                <div className="absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full bg-[#f0c6f7] opacity-40" />
                <div className="absolute -bottom-32 -right-24 w-[500px] h-[500px] rounded-full bg-[#b3c8f5] opacity-40" />
                <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-[#c9aff5] opacity-30" />

                <div className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-10">

                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center mb-4">
                            <span className="text-white text-lg font-bold">iF</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                        <p className="text-sm text-gray-400 mt-1 text-center">
                            Sign in to access the IFES Admin Dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <p className="text-xs text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                autoComplete="username"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2">
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                    <p className="text-center text-xs text-gray-400 mt-8">
                        LSPU-SCC — College of Computer Studies
                    </p>
                </div>
            </div>
        </>
    );
}