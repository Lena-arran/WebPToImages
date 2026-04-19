// =======================
// 初期化（右クリックメニュー）
// =======================
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

// =======================
// クリック → contentに命令
// =======================
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab?.id) return;

    const format =
        info.menuItemId === "to-png"
            ? "image/png"
            : "image/jpeg";

    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        });

        chrome.tabs.sendMessage(tab.id, {
            type: "CONVERT_IMAGE",
            format: format
        });
    } catch(e) {
        console.error("スクリプト注入失敗", e);
    }
});

// =======================
// ダウンロード実行
// =======================
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "DOWNLOAD") return;

    console.log("保存ファイル名:", msg.filename);

    chrome.downloads.download({
        url: msg.url,
        filename: msg.filename,
        saveAs: true, // ← 安定運用
        conflictAction: "uniquify"
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("DL失敗", chrome.runtime.lastError);
        }
    });
});