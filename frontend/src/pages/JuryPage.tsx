import { MarsBackground } from "../components/MarsBackground";
import JuryView from "../view/jury/JuryView";

export default function JuryPage() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--col-bg)" }}>
            <MarsBackground />
            <div className="relative z-10">
                <JuryView />
            </div>
        </div>
    )
}