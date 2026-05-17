// =======================
// state
// =======================

let lastClickedImg = null;

let isProcessing = false;


// =======================
// 右クリック画像を保持
// =======================

document.addEventListener("contextmenu", (e) => {

    const img = e.target.closest("img");

    if (img) {
        lastClickedImg = img;
    }
});


// =======================
// メッセージ受信
// =======================

chrome.runtime.onMessage.addListener(
    handleConvertMessage
);


// =======================
// 変換処理
// =======================

async function handleConvertMessage(msg) {

    if (msg.type !== "CONVERT_IMAGE")
        return;

    if (isProcessing) {

        console.log(
            "処理中のためスキップ"
        );

        return;
    }

    isProcessing = true;

    try {

        const img = lastClickedImg;

        if (!img) {

            console.warn(
                "画像が選択されていません"
            );

            return;
        }

        // =======================
        // URL取得
        // =======================

        const src =
            img.currentSrc || img.src;

        console.log("画像URL:", src);

        const filename =
            buildFileName(
                src,
                msg.format
            );

        // =======================
        // 同形式なら直接DL
        // =======================

        const originalExt =
            getExtension(src);

        const targetExt =
            msg.format === "image/png"
                ? "png"
                : "jpg";

        if (originalExt === targetExt) {

            chrome.runtime.sendMessage({

                type: "DOWNLOAD",

                url: src,

                filename
            });

            return;
        }

        // =======================
        // DOM描画
        // =======================

        try {

            const canvas =
                document.createElement(
                    "canvas"
                );

            canvas.width =
                img.naturalWidth;

            canvas.height =
                img.naturalHeight;

            const ctx =
                canvas.getContext("2d");

            if (!ctx) {

                throw new Error(
                    "ctx取得失敗"
                );
            }

            ctx.drawImage(img, 0, 0);

            const dataUrl =
                canvas.toDataURL(
                    msg.format,
                    0.95
                );

            chrome.runtime.sendMessage({

                type: "DOWNLOAD",

                url: dataUrl,

                filename
            });

            return;

        } catch (e) {

            console.warn(
                "DOM描画失敗 → fetchへ",
                e
            );
        }

        // =======================
        // fetch fallback
        // =======================

        try {

            const response =
                await fetch(src, {
                    cache: "no-store"
                });

            const blob =
                await response.blob();

            const bitmap =
                await createImageBitmap(
                    blob
                );

            const canvas =
                document.createElement(
                    "canvas"
                );

            canvas.width =
                bitmap.width;

            canvas.height =
                bitmap.height;

            const ctx =
                canvas.getContext("2d");

            if (!ctx) {

                throw new Error(
                    "ctx取得失敗"
                );
            }

            ctx.drawImage(
                bitmap,
                0,
                0
            );

            const dataUrl =
                canvas.toDataURL(
                    msg.format,
                    0.98
                );

            chrome.runtime.sendMessage({

                type: "DOWNLOAD",

                url: dataUrl,

                filename
            });

        } catch (e) {

            console.warn(
                "fetch失敗 → 直接DL",
                e
            );

            chrome.runtime.sendMessage({

                type: "DOWNLOAD",

                url: src,

                filename
            });
        }

    } catch (e) {

        console.error(
            "変換エラー",
            e
        );

    } finally {

        isProcessing = false;
    }
}


// =======================
// 拡張子取得
// =======================

function getExtension(url) {

    try {

        const pathname =
            new URL(url).pathname;

        return pathname
            .split(".")
            .pop()
            .toLowerCase();

    } catch {

        return "";
    }
}


// =======================
// ファイル名生成
// =======================

function buildFileName(
    url,
    format
) {

    try {

        const u = new URL(url);

        let name =
            u.pathname
                .split("/")
                .pop() || "";

        // ファイル名が無い場合
        if (
            !name ||
            !name.includes(".")
        ) {

            name =
                "image_" + Date.now();

        } else {

            // 拡張子除去
            name = name.replace(
                /\.[^/.]+$/,
                ""
            );
        }

        const ext =
            format === "image/png"
                ? "png"
                : "jpg";

        return `${name}.${ext}`;

    } catch {

        return `image_${
            Date.now()
        }.${
            format.split("/")[1]
        }`;
    }
}