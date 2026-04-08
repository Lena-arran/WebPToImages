let lastSrc = "";

// 右クリックメニュー
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "to-jpg",
        title: "JPGで保存",
        contexts: ["image"]
    });
    chrome.contextMenus.create({
        id: "to-png",
        title: "PNGで保存",
        contexts: ["image"]
    });
});

// contentからURL受け取る
chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.type === "IMAGE_INFO") {
        lastSrc = msg.src;
    }

    if (msg.type === "DOWNLOAD") {
        chrome.downloads.download({
            url: msg.url,
            filename: msg.filename || "image.png"
        });
    }
});

// クリック時
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const type = info.menuItemId === "to-png"
        ? "image/png"
        : "image/jpeg";

    const filename = getFileName(lastSrc || info.srcUrl, type);

    chrome.tabs.sendMessage(tab.id, {
        type: "CONVERT_IMAGE",
        format: type,
        filename: filename
    });
});

// ファイル名
function getFileName(url, type) {
    try {
        const urlObj = new URL(url);
        let name = urlObj.pathname.split("/").pop() || "image";
        name = name.replace(/\.[^/.]+$/, "");
        return name + "." + type.split("/")[1];
    } catch {
        return "image." + type.split("/")[1];
    }
}