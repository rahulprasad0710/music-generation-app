import { PromptRecord } from "@/store/music.store";

export const PROMPT_FALLBACK_COLORS = [
    "from-violet-600 to-indigo-700",
    "from-rose-500 to-pink-700",
    "from-amber-500 to-orange-600",
    "from-teal-500 to-cyan-700",
    "from-blue-500 to-indigo-600",
    "from-fuchsia-500 to-purple-700",
];

type Status = PromptRecord["status"];

export const STATUS_CONFIG = {
    PENDING: {
        label: "Pending",
        subtitle: "Waiting to start...",
        subtitleClass: "text-white/40",
        showProgress: false,
        showPulse: true,
        pulseClass: "bg-white/30",
        dotColor: "bg-white/50",
    },
    QUEUED: {
        label: "Queued",
        subtitle: "In queue...",
        subtitleClass: "text-amber-400/80",
        showProgress: false,
        showPulse: true,
        pulseClass: "bg-amber-400/60",
        dotColor: "bg-amber-400",
    },
    PROCESSING: {
        label: "Processing",
        subtitle: null, // dynamic
        subtitleClass: "text-white/50",
        showProgress: true,
        showPulse: true,
        pulseClass: "bg-blue-400/60",
        dotColor: "bg-green-500",
    },
    COMPLETED: {
        label: "Done",
        subtitle: "Ready to play",
        subtitleClass: "text-emerald-400/80",
        showProgress: false,
        showPulse: false,
        pulseClass: "",
        dotColor: "bg-green-600",
    },
    FAILED: {
        label: "Failed",
        subtitle: null,
        subtitleClass: "text-red-400/80",
        showProgress: false,
        showPulse: false,
        pulseClass: "",
        dotColor: "",
    },
} satisfies Record<
    Status,
    {
        label: string;
        subtitle: string | null;
        subtitleClass: string;
        showProgress: boolean;
        showPulse: boolean;
        pulseClass: string;
        dotColor: string;
    }
>;
