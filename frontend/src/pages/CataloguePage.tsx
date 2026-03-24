import { MarsBackground } from "../components/MarsBackground";
import CatalogueView from "../view/catalogue/CatalogueView.tsx";

export default function CataloguePage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <MarsBackground />
            <CatalogueView />
        </div>
    )
}