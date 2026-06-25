// =======================
// ダウンロード実行
// =======================
export function handleDownload(msg) {
    
    if (msg.type !== "DOWNLOAD") return;
    
    console.log("受信:", msg);
    console.log("filename:",msg.filename);
    console.log("url:",msg.url);

    chrome.downloads.download({
        url: msg.url,
        filename: msg.filename,
        saveAs: true,
        conflictAction: "uniquify"
    });
}