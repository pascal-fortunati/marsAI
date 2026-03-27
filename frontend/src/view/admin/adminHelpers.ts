export async function invalidateSiteCache(base: string, getToken: () => string) {
    try {
        await fetch(`${base}/api/admin/settings/invalidate-cache`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` }
        });
    } catch {
        // Non bloquant
    }
}