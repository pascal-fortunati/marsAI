import { useState, useRef } from "react";
import { Upload, Clock, HardDrive, Film } from "lucide-react";

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
            <p className="f-mono text-[9px] tracking-widest uppercase text-white/40">
                {label}
                {required && <span className="ml-1" style={{ color: "var(--col-or)" }}>*</span>}
            </p>

            {/* Zone de dépôt */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className="rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 py-10"
                style={{
                    border: `1px dashed ${hasError ? "rgba(255, 92, 53, .75)" : dragging ? "var(--col-vi)" : file ? "rgba(125,113,251,.4)" : "rgba(255,255,255,.1)"}`,
                    background: dragging
                        ? "rgba(125,113,251,.07)"
                        : hasError
                            ? "rgba(255, 92, 53, .06)"
                            : file
                                ? "rgba(125,113,251,.04)"
                                : "rgba(255,255,255,.02)",
                }}
            >
                <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />

                {file ? (
                    // Fichier sélectionné
                    <>
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(125,113,251,.2)" }}
                        >
                            <Film size={14} style={{ color: "var(--col-vi)" }} />
                        </div>
                        <p className="f-mono text-[10px] text-white/70">{file.name}</p>
                        <p className="f-mono text-[9px] text-white/30">
                            {(file.size / 1024 / 1024).toFixed(1)} Mo
                        </p>
                    </>
                ) : (
                    // État vide
                    <>
                        <Upload size={20} className="text-white/20" />
                        <p className="f-mono text-[11px] text-white/40">Glisser-déposer ou cliquer</p>
                        <p className="f-mono text-[9px] text-white/20">{formats}</p>
                        <p className="f-mono text-[9px] text-white/15">{hint}</p>
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
        <div className="space-y-6 relative overflow-hidden rounded-3xl p-6" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px  solid rgba(255, 255, 255, 0.07)" }}>

            {/* En-tête étape */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="f-mono text-sm tracking-widest text-white/30">Étape 3/4</span>
                <span className="f-mono text-sm tracking-widest uppercase" style={{ color: "var(--col-vi)" }}>
                    Fichiers
                </span>
            </div>

            {/* Avertissement */}
            <p
                className="f-mono text-[9px] text-white/35 leading-relaxed rounded-xl px-4 py-3"
                style={{ border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}
            >
                * Votre vidéo sera stockée sur S3 Scaleway et uploadée en privé sur YouTube pour vérification
                copyright automatique. Aucune modification possible après soumission.
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
            <div className="grid grid-cols-3 gap-3">
                {[
                    { icon: Clock, label: "Durée max", value: "2 minutes" },
                    { icon: HardDrive, label: "Taille max", value: "3000 Mo" },
                    { icon: Film, label: "Formats", value: ".mp4 · .mov" },
                ].map(({ icon: Icon, label, value }) => (
                    <div
                        key={label}
                        className="rounded-xl py-4 flex flex-col items-center gap-1.5"
                        style={{ border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}
                    >
                        <Icon size={14} className="text-white/25" />
                        <span className="f-mono text-[8px] tracking-widest uppercase text-white/25">{label}</span>
                        <span className="f-mono text-[11px] text-white/60">{value}</span>
                    </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-2">
                <button
                    onClick={onPrev}
                    className="f-mono text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-xl transition-opacity hover:opacity-70"
                    style={{ border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.4)" }}
                >
                    ← Précédent
                </button>
                <button onClick={handleNext} className="f-mono text-[11px] tracking-widest uppercase px-6 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 active-scale-95" style={{ background: "linear-gradient(90deg, var(--col-vi), var(--col-or))" }}>
                    Étape suivante →
                </button>
            </div>

        </div>
    );
}