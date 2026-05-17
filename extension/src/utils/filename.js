// =======================
// ファイル名生成
// =======================
export function buildFileName(url, format) {
    try {
        const u = new URL(url);

        let name = u.pathname.split("/").pop() || "";

        // ファイル名が取れない場合
        if (!name || !name.includes(".")) {
            name = "image_" + Date.now();
        } else {
            // 拡張子除去
            name = name.replace(/\.[^/.]+$/, "");
        }

        const ext =
            format === "image/png"
                ? "png"
                : "jpg";

        return `${name}.${ext}`;

    } catch {
        return `image_${Date.now()}.${format.split("/")[1]}`;
    }
}