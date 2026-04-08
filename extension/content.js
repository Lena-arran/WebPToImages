let lastClickedImg = null;

// 右クリック時に要素保存 + URL送信
document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "IMG") {
        lastClickedImg = e.target;

        chrome.runtime.sendMessage({
            type: "IMAGE_INFO",
            src: e.target.currentSrc || e.target.src
        });
    }
});

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type !== "CONVERT_IMAGE") return;

    try {
        const img = lastClickedImg;

        if (!img) {
            console.error("img null");
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        const blob = await new Promise(resolve =>
            canvas.toBlob(resolve, message.format, 0.95)
        );

        if (!blob) throw new Error("blob作れない");

        const url = URL.createObjectURL(blob);

        chrome.runtime.sendMessage({
            type: "DOWNLOAD",
            url: url,
            filename: message.filename
        });

    } catch (e) {
        console.error("変換失敗", e);
    }
});