import { MarsBackground } from "../components/MarsBackground";
import { SubmitView } from "../view/submit/SubmitView";

export default function SubmitPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <MarsBackground />
            <SubmitView />
        </div>
    );
}