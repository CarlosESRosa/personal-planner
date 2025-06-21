import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { cn } from "../../lib/utils";

/* =====================================================================
   Tipos
   ===================================================================*/

type Variant = "success" | "error" | "warning" | "info";

interface AlertPayload {
    title: string;
    message?: string;
    variant?: Variant; // default "info"
}

interface Alert extends AlertPayload {
    id: number;
    variant: Variant;
}

interface AlertContextValue {
    /** Dispara um alerta */
    show: (payload: AlertPayload) => void;
}

/* =====================================================================
   Context + Provider
   ===================================================================*/

const AlertContext = createContext<AlertContextValue>({} as AlertContextValue);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    const show = useCallback((payload: AlertPayload) => {
        const id = Date.now();
        const alert: Alert = {
            id,
            variant: payload.variant ?? "info",
            title: payload.title,
            message: payload.message,
        };

        setAlerts((prev) => [...prev, alert]);

        // auto‑dismiss em 4 s
        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 4000);
    }, []);

    return (
        <AlertContext.Provider value={{ show }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {alerts.map((a) => (
                    <AlertCard key={a.id} alert={a} />
                ))}
            </div>
        </AlertContext.Provider>
    );
}

export const useAlert = () => useContext(AlertContext);

/* =====================================================================
   Card visual
   ===================================================================*/

const iconMap: Record<Variant, (props: any) => JSX.Element> = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
};

const colorMap: Record<Variant, string> = {
    success: "border-success bg-success/10 text-success",
    error: "border-error bg-error/10 text-error",
    warning: "border-warning bg-warning/10 text-warning",
    info: "border-primary bg-primary/10 text-primary",
};

function AlertCard({ alert }: { alert: Alert }) {
    const Icon = iconMap[alert.variant];
    return (
        <div
            className={cn(
                "relative flex items-start gap-3 rounded-xl border px-4 py-3 shadow-soft backdrop-blur-sm",
                "animate-fade-in",
                colorMap[alert.variant],
            )}
        >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="text-sm">
                <p className="font-semibold leading-none">{alert.title}</p>
                {alert.message && <p className="mt-0.5 text-xs">{alert.message}</p>}
            </div>
            <button
                onClick={() =>
                    setAlerts((prev) => prev.filter((a) => a.id !== alert.id))
                }
                className="absolute -top-2 -right-2 rounded-full bg-surface p-1 shadow-soft hover:bg-bg"
            >
                <XMarkIcon className="h-3 w-3" />
            </button>
        </div>
    );
}
