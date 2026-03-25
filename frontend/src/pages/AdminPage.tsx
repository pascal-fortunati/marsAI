import { MarsBackground } from "../components/MarsBackground";
import AdminView from "../view/admin/AdminView";

export default function AdminPage() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--col-bg)" }}>
            <MarsBackground />
            <div className="relative z-10">
                <AdminView />
            </div>
        </div>
    );
}
