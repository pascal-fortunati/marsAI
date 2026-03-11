import React from "react";

interface FormFieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const FormField = ({ label, required, children, className = "" }: FormFieldProps) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="f-mono text-[9px] tracking-widest uppercase text-white/40">
            {label}
            {required && (
                <span className="ml-1" style={{ color: "var(--col-or)" }}>*</span>
            )}
        </label>
        {children}
    </div>
);