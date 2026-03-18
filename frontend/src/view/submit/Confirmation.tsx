import { Check } from "lucide-react";

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
    const resolvedSubmissionId = submissionId ?? "9adf0ea3-59d3-4eb1-9324-1519e4f11152";
    const resolvedEmail = email ?? "pauline.alex@laplateforme.io";

    return (
        <div
            className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4"
            style={{ background: "transparent" }}
        >
            <div className="relative z-10 flex flex-col items-center text-center gap-4 w-full max-w-[480px]">

                {/* Icône check */}
                <div
                    className="w-[66px] h-[66px] rounded-[20px] flex items-center justify-center mb-1"
                    style={{ background: "linear-gradient(135deg, #a07cf8, #e06060, #e8864a)" }}
                >
                    <Check size={27} strokeWidth={2.6} className="text-white" />
                </div>

                {/* Sous-titre + titre */}
                <p className="f-mono text-[8px] tracking-[0.24em] uppercase text-white/32">
                    Soumission enregistrée
                </p>
                <h1 className="f-orb text-[36px] leading-none font-bold text-white">
                    Film reçu
                </h1>

                {/* Description */}
                <p className="f-mono text-[11px] text-white/32 leading-relaxed max-w-[320px]">
                    Votre film est bien enregistré. Un email de confirmation a été envoyé.
                </p>

                {/* Carte ID */}
                <div
                    className="w-full rounded-2xl px-5 py-4 space-y-2 mt-1"
                    style={{
                        border: "1px solid rgba(125,113,251,.24)",
                        background: "rgba(16,10,38,.85)",
                    }}
                >
                    <p className="f-mono text-[8px] tracking-[0.24em] uppercase text-white/28">
                        Identifiant de soumission
                    </p>
                    <p className="f-orb text-[18px] leading-snug font-bold text-white tracking-wider break-all">
                        {resolvedSubmissionId}
                    </p>
                    <p className="f-mono text-[9px] text-white/28">
                        Email de confirmation envoyé à{" "}
                        <span style={{ color: "var(--col-vi)" }}>{resolvedEmail}</span>
                    </p>
                </div>

                {/* Boutons */}
                <div className="flex gap-2.5 items-center justify-center flex-wrap mt-1.5">
                    <button
                        onClick={onHome}
                        className="f-mono text-[10px] tracking-widest uppercase px-6 h-10 rounded-full transition-opacity hover:opacity-80"
                        style={{
                            border: "1px solid rgba(255,255,255,.13)",
                            background: "transparent",
                            color: "rgba(255,255,255,.45)",
                        }}
                    >
                        Retour à l'accueil
                    </button>
                    <button
                        onClick={onSubmitAnother}
                        className="f-mono text-[10px] tracking-widest uppercase px-6 h-10 rounded-full font-bold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "linear-gradient(90deg, var(--col-vi), var(--col-or))" }}
                    >
                        Soumettre un autre film
                    </button>
                </div>

            </div>
        </div>
    );
}