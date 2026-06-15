import { useEffect, useRef, useState } from "react";

export function TagMultiSelect({
    label,
    options,
    selected,
    setSelected,
}: {
    label: string;
    options: string[];
    selected: string[];
    setSelected: (values: string[]) => void;
}) {
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            setSelected(selected.filter((v) => v !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(input.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-1.5 relative" ref={wrapperRef}>
            <label className="text-sm font-medium text-gray-700">{label}</label>

            <div
                className="flex flex-wrap items-start gap-2 border border-gray-200 rounded-xl p-2 cursor-text min-h-10 max-h-28 overflow-x-auto"
                onClick={() => setIsOpen(true)}
            >
                {selected.map((item) => (
                    <div
                        key={item}
                        className="flex items-center gap-1 bg-violet-100 text-violet-700 px-2 py-1 rounded-lg text-xs"
                    >
                        {item}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelected(selected.filter((i) => i !== item));
                            }}
                            className="text-violet-500 hover:text-red-500"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                <input
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setIsOpen(true);
                    }}
                    className="w-full outline-none text-sm px-1 mt-1"
                    placeholder={selected.length === 0 ? "Select or type..." : ""}
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-full border border-gray-200 rounded-xl max-h-48 overflow-auto bg-white shadow z-50">
                    {filteredOptions.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-400">
                            No options found
                        </div>
                    ) : (
                        filteredOptions.map((opt) => {
                            const isSelected = selected.includes(opt);

                            return (
                                <div
                                    key={opt}
                                    onClick={() => toggleOption(opt)}
                                    className={`px-3 py-2 text-sm cursor-pointer flex justify-between items-center
                        ${isSelected ? "bg-violet-50" : "hover:bg-gray-50"}`}
                                >
                                    <span>{opt}</span>
                                    {isSelected && (
                                        <span className="text-violet-600 text-xs">✔</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}