import { MarsBackground } from "../components/MarsBackground";
import HomeView from "../view/home/HomeView";

export default function HomePage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <MarsBackground />
            <HomeView />
        </div>
    )
}