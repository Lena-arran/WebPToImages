// =======================
// 拡張子取得
// =======================
export function getExtension(url) {
    try {
        const pathname = new URL(url).pathname;
        return pathname.split(".").pop().toLowerCase();
    } catch {
        return "";
    }
}