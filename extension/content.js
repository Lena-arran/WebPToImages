// =======================
// 右クリックされた画像を保持
// =======================
let lastClickedImg = null;

document.addEventListener("contextmenu", (e) => {
    const el = e.target.closest("img");
    if (el) {
        lastClickedImg = el;
    }
});

// =======================
// 命令受信 → 変換処理
// =======================
chrome.runtime.onMessage.addListener(async (msg) => {

    if (msg.type !== "CONVERT_IMAGE") return;

    try {
        const img = lastClickedImg;

        if (!img) {
            console.warn("画像が選択されていません");
            return;
        }

        // =======================
        // 画像URL取得
        // =======================
        const src = img.currentSrc || img.src;

        console.log("画像URL:", src);

        // =======================
        // 画像データ取得
        // =======================
        const response = await fetch(src);
        const blob = await response.blob();

        const bitmap = await createImageBitmap(blob);

        // =======================
        // canvas変換
        // =======================
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("ctx取得失敗");

        ctx.drawImage(bitmap, 0, 0);

        // =======================
        // dataURLに変換
        // =======================
        const dataUrl = canvas.toDataURL(msg.format, 0.95);

        // =======================
        // ファイル名生成
        // =======================
        const filename = buildFileName(src, msg.format);

        chrome.runtime.sendMessage({
            type: "DOWNLOAD",
            url: dataUrl,
            filename
        });

        console.log("生成ファイル名:", filename);

        // =======================
        // backgroundへ送信
        // =======================
        chrome.runtime.sendMessage({
            type: "DOWNLOAD",
            url: dataUrl,
            filename: filename
        });

    } catch (e) {
        console.error("変換エラー", e);
    }
});

// =======================
// ファイル名生成
// =======================
function buildFileName(url, format) {
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