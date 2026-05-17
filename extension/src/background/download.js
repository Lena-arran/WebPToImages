// =======================
// ダウンロード実行
// =======================
export function handleDownload(msg) {
    if (msg.type !== "DOWNLOAD") return;
    console.log("保存ファイル名:", msg.filename);

    chrome.downloads.download({
        url: msg.url,
        filename: msg.filename,
        saveAs: true,
        conflictAction: "uniquify"
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("DL失敗", chrome.runtime.lastError);
        }
    });
}