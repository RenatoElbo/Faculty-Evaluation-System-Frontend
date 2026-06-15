interface RemoveFacultyProps {
    isOpen: boolean;
    onClose: () => void;
    faculty: string;
    title: string;
    description: string;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export default function RemoveFacultyModal({
    isOpen,
    onClose,
    faculty,
    title,
    description,
    isSubmitting,
    onSubmit
}: RemoveFacultyProps) {
    if (!isOpen) return null
    return (
        <div key="delete" className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-100 mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-1">{title}</h3>
                <p className="text-sm text-gray-400 text-center mb-2">{description}</p>
                <p className="text-sm font-semibold text-gray-700 text-center mb-6">"{faculty}"</p>
                <div className="flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onSubmit} disabled={isSubmitting}
                        className="flex-1 px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                        {isSubmitting ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting...</> : "Yes, Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}