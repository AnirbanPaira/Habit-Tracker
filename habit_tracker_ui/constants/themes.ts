export interface Theme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        textDark: string;
        textLight: string;
        success: string;
        error: string;
    };
}

export const themes: { [key: string]: Theme } = {
    modernBlue: {
        name: "Modern Blue",
        colors: {
            primary: "#2563eb",    // blue-600
            secondary: "#3b82f6",  // blue-500
            accent: "#06b6d4",     // cyan-500
            background: "#f8fafc", // slate-50
            surface: "#ffffff",
            textDark: "#0f172a",   // slate-900
            textLight: "#e2e8f0",  // slate-200
            success: "#22c55e",    // green-500
            error: "#ef4444"       // red-500
        },
    },
    forestGreen: {
        name: "Forest Green",
        colors: {
            primary: "#16a34a",    // green-600
            secondary: "#22c55e",  // green-500
            accent: "#f59e0b",     // amber-500
            background: "#f0fdf4", // green-50
            surface: "#ffffff",
            textDark: "#064e3b",   // green-900
            textLight: "#d1fae5",  // green-100
            success: "#22c55e",    // green-500
            error: "#ef4444"       // red-500
        },
    },
    sunsetOrange: {
        name: "Sunset Orange",
        colors: {
            primary: "#ea580c",    // orange-600
            secondary: "#f97316",  // orange-500
            accent: "#facc15",     // yellow-400
            background: "#fff7ed", // orange-50
            surface: "#ffffff",
            textDark: "#1c1917",   // stone-900
            textLight: "#fef3c7",  // amber-100
            success: "#22c55e",    // green-500
            error: "#ef4444"       // red-500
        },
    },
    purpleGalaxy: {
        name: "Purple Galaxy",
        colors: {
            primary: "#7c3aed",    // violet-600
            secondary: "#a855f7",  // purple-500
            accent: "#ec4899",     // pink-500
            background: "#faf5ff", // purple-50
            surface: "#ffffff",
            textDark: "#1e1b4b",   // indigo-900
            textLight: "#ede9fe",  // violet-100
            success: "#22c55e",    // green-500
            error: "#ef4444"       // red-500
        },
    },
    darkMode: {
        name: "Dark Mode",
        colors: {
            primary: "#0ea5e9",    // sky-500
            secondary: "#38bdf8",  // sky-400
            accent: "#f43f5e",     // rose-500
            background: "#0f172a", // slate-900
            surface: "#1e293b",    // slate-800
            textDark: "#f1f5f9",   // slate-200
            textLight: "#94a3b8",  // slate-400
            success: "#22c55e",    // green-500
            error: "#ef4444"       // red-500
        },
    },
    oceanBreeze: {
        name: "Ocean Breeze",
        colors: {
            primary: "#0284c7",    // sky-600
            secondary: "#0ea5e9",  // sky-500
            accent: "#14b8a6",     // teal-500
            background: "#f0f9ff", // sky-50
            surface: "#ffffff",
            textDark: "#0c4a6e",   // sky-900
            textLight: "#bae6fd",  // sky-200
            success: "#22c55e",    // green-500
            error: "#ef4444"       // red-500
        },
    },
    roseBlush: {
        name: "Rose Blush",
        colors: {
            primary: "#e11d48",    // rose-600
            secondary: "#f43f5e",  // rose-500
            accent: "#f9a8d4",     // pink-300
            background: "#fff1f2", // rose-50
            surface: "#ffffff",
            textDark: "#881337",   // rose-900
            textLight: "#fecdd3",  // rose-200
            success: "#22c55e",    // green-500
            error: "#ef4444"       // red-500
        },
    },
    goldenSands: {
        name: "Golden Sands",
        colors: {
            primary: "#d97706",    // amber-600
            secondary: "#f59e0b",  // amber-500
            accent: "#fbbf24",     // amber-400
            background: "#fffbeb", // amber-50
            surface: "#ffffff",
            textDark: "#78350f",   // amber-900
            textLight: "#fde68a",  // amber-200
            success: "#22c55e",    // green-500
            error: "#ef4444"       // red-500
        },
    },
    charcoalGray: {
        name: "Charcoal Gray",
        colors: {
            primary: "#374151",    // gray-700
            secondary: "#6b7280",  // gray-500
            accent: "#9ca3af",     // gray-400
            background: "#f9fafb", // gray-50
            surface: "#ffffff",
            textDark: "#111827",   // gray-900
            textLight: "#d1d5db",  // gray-300
            success: "#22c55e",    // green-500
            error: "#ef4444"       // red-500
        },
    },
    mintFresh: {
        name: "Mint Fresh",
        colors: {
            primary: "#10b981",    // emerald-500
            secondary: "#34d399",  // emerald-400
            accent: "#6ee7b7",     // emerald-300
            background: "#ecfdf5", // emerald-50
            surface: "#ffffff",
            textDark: "#064e3b",   // emerald-900
            textLight: "#a7f3d0",  // emerald-200
            success: "#22c55e",    // green-500
            error: "#ef4444"       // red-500
        },
    },
};
