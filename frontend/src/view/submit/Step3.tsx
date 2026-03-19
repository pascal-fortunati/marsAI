import { useState, useRef } from "react";
import { Upload, Clock, HardDrive, Film, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import { marsaiGradients } from "../../theme/marsai";

interface Step3Props {
    onNext: () => void;
    onPrev: () => void;
}

// Zone de dépôt générique réutilisable
interface DropZoneProps {
    label: string;
    required?: boolean;
    accept: string;
    hint: string;
    formats: string;
    file: File | null;
    onFileChange: (file: File | null) => void;
    hasError?: boolean;
}

function DropZone({ label, required, accept, hint, formats, file, onFileChange, hasError = false }: DropZoneProps) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) onFileChange(dropped);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) onFileChange(e.target.files[0]);
    };

    return (
        <div className="space-y-1.5">
            {/* Label */}
            <p className="f-mono text-[8px] sm:text-[9px] tracking-widest uppercase text-white/40">
                {label}
                {required && <span className="ml-1" style={{ color: "var(--col-or)" }}>*</span>}
            </p>

            {/* Zone de dépôt */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className="rounded-lg sm:rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-1 sm:gap-2 py-8 sm:py-10"
                style={{
                    border: `1px dashed ${hasError ? "rgba(255, 92, 53, .75)" : dragging ? "var(--col-vi)" : file ? "rgba(0, 237, 143, .45)" : "rgba(255,255,255,.1)"}`,
                    background: dragging
                        ? "rgba(125,113,251,.07)"
                        : hasError
                            ? "rgba(255, 92, 53, .06)"
                            : file
                                ? "rgba(0, 237, 143, .06)"
                                : "rgba(255,255,255,.02)",
                }}
            >
                <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />

                {file ? (
                    // Fichier sélectionné
                    <>
                        <Check size={24} strokeWidth={2.4} style={{ color: "rgba(0, 237, 143, .95)" }} />
                        <p className="f-orb text-[11px] sm:text-[12px] md:text-[14px] leading-none text-[#00ed8f] break-all text-center max-w-xs">
                            {file.name}
                        </p>
                        <p className="f-mono text-[8px] sm:text-[9px] text-white/35">
                            {(file.size / 1024 / 1024).toFixed(1)} Mo
                        </p>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onFileChange(null);
                            }}
                            className="f-mono text-[8px] sm:text-[9px] tracking-[0.16em] uppercase transition-opacity hover:opacity-80"
                            style={{ color: "rgba(255, 92, 53, .95)" }}
                        >
                            Supprimer
                        </button>
                    </>
                ) : (
                    // État vide
                    <>
                        <Upload size={18} className="text-white/20" />
                        <p className="f-orb text-[12px] sm:text-[14px] md:text-[16px] leading-none text-white/58">Glisser-déposer ou cliquer</p>
                        <p className="f-mono text-[9px] sm:text-[11px] tracking-[0.18em] uppercase text-white/30">{formats}</p>
                        <p className="f-mono text-[8px] sm:text-[10px] text-white/20">{hint}</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function Step3({ onNext, onPrev }: Step3Props) {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
    const [showValidation, setShowValidation] = useState(false);

    const missing = {
        videoFile: !videoFile,
        posterFile: !posterFile,
    };

    const hasMissingRequired = Object.values(missing).some(Boolean);

    const handleNext = () => {
        setShowValidation(true);

        if (!hasMissingRequired) {
            onNext();
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px  solid rgba(255, 255, 255, 0.07)" }}>

            {/* En-tête étape */}
            <div className="flex items-center gap-4 pb-2">
                <span className="f-mono text-[11px] tracking-[0.28em] uppercase shrink-0" style={{ color: "rgba(162, 151, 255, .9)" }}>
                    Étape 3/4
                </span>
                <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(125,113,251,.55) 0%, rgba(125,113,251,.22) 55%, rgba(5,3,13,0) 100%)" }} />
                <span className="f-orb text-sm md:text-[15px] leading-none tracking-[0.03em] uppercase text-white whitespace-nowrap shrink-0">
                    Fichiers
                </span>
            </div>

            {/* Avertissement */}
            <p
                className="f-mono text-[8px] sm:text-[9px] text-white/35 leading-relaxed rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3"
                style={{ border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}
            >
                &gt; Votre vidéo sera stockée sur S3 Scaleway et uploadée en privé sur YouTube pour vérification
                copyright automatique.
            </p>

            {/* Vidéo du film */}
            <DropZone
                label="Vidéo du film"
                required
                accept="video/mp4,video/quicktime"
                formats="MP4, MOV — Max 3000 Mo"
                hint="Format 16:9 · Formats min · son min · Max 3000 Mo"
                file={videoFile}
                onFileChange={setVideoFile}
                hasError={showValidation && missing.videoFile}
            />

            {/* Poster / Affiche */}
            <DropZone
                label="Poster / Affiche"
                required
                accept="image/png,image/jpeg,image/gif,image/webp"
                formats="PNG, JPEG, GIF, ZIP — Max 5 Mo"
                hint="Format 2:3 (portrait) · Min 2 Mo · Ratio 2:3 recommandé"
                file={posterFile}
                onFileChange={setPosterFile}
                hasError={showValidation && missing.posterFile}
            />

            {/* Sous-titres */}
            <DropZone
                label="Sous-titres"
                accept=".srt,.vtt"
                formats="SRT, VTT — Max 5 Mo"
                hint="Format · .srt · langue basée sur votre choix · Non requis si film muet/international"
                file={subtitleFile}
                onFileChange={setSubtitleFile}
            />

            {/* Récapitulatif des contraintes */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                    { icon: Clock, label: "Durée max", value: "2 minutes" },
                    { icon: HardDrive, label: "Taille max", value: "3000 Mo" },
                    { icon: Film, label: "Formats", value: ".mp4 · .mov" },
                ].map(({ icon: Icon, label, value }) => (
                    <div
                        key={label}
                        className="rounded-lg sm:rounded-xl py-3 sm:py-4 px-2 sm:px-3 flex flex-col items-center gap-1"
                        style={{ border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}
                    >
                        <Icon size={14} className="text-white/25" />
                        <span className="f-mono text-[8px] tracking-widest uppercase text-white/25">{label}</span>
                        <span className="f-mono text-[11px] text-white/60">{value}</span>
                    </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pt-2 sm:pt-4">
                <button
                    onClick={onPrev}
                    className="f-mono text-[10px] sm:text-[9px] tracking-widest uppercase px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-opacity hover:opacity-70 w-full sm:w-auto"
                    style={{ border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.4)" }}
                >
                    ← Précédent
                </button>
                <Button
                    type="button"
                    onClick={handleNext}
                    className="f-orb group relative overflow-hidden rounded-full px-8 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
                    style={{ background: marsaiGradients.primaryToAccent }}
                >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Étape suivante →</span>
                </Button>
            </div>

            <p className="f-mono text-[9px] text-white/25 tracking-wide text-center">
                Aucune modification possible après soumission · Les champs sont mémorisés sur cet appareil
            </p>

        </div>
    );
}