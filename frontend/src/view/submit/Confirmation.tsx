import { useState } from "react";

interface ConfirmationProps {
    submissionId?: string;
    email?: string;
    onHome?: () => void;
    onSubmitAnother?: () => void;
}

export default function Confirmation({
    submissionId,
    email,
    onHome,
    onSubmitAnother
}: ConfirmationProps) {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4" style={{ background: "var(--col-bg)" }}>

            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `
            radial-gradient(ellipse 50% 40% at 50% 30%, rgba(125,113,251,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 80% 80%, rgba(255,92,53,0.04) 0%, transparent 70%)
          `,
                }}
            />

        </div>
    );

}
