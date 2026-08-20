// =======================
// ダウンロード実行
// =======================
export function handleDownload(msg) {
    
    if (msg.type !== "DOWNLOAD") return;


    chrome.downloads.download({
        url: msg.url,
        filename: msg.filename,
        saveAs: true,
        conflictAction: "uniquify"
    });
}