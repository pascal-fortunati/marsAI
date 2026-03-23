import { MarsBackground } from "../components/MarsBackground";
import CatalogueView from "../view/catalogue/CatalogueView";

export default function CataloguePage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <MarsBackground />
            <CatalogueView />
        </div>
    )
}