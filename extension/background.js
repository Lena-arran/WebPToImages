//右クリックメニュー作成
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

// クリックイベント
chrome.contextMenus.onClicked.addListener(async (info)=> {

    const type = info.menuItemId === "to-png" ? "image/png" : "image/jpeg";

    const response = await fetch(info.srcUrl);
    const blob = await response.blob();
    
    convertImage(blob, type, info.srcUrl);
});


// 変換処理
function convertImage(file, type, srcUrl) {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
        const canvas = new OffscreenCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const convertedBlob = await canvas.convertToBlob({type});
        const url = URL.createObjectURL(convertedBlob);
        
        const filename = getFileName(srcUrl, type);
        
        chrome.downloads.download({
            url: url,
            filename: filename
        });
    };
}

// ファイル名取得
function getFileName(url, type) {
    const urlObj = new URL(url);

    // パスの最後を取得し、拡張子削除
    let fileName = urlObj.pathname.split("/").pop();
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");

    // 新しい拡張子
    const ext = type.split("/")[1];
    return nameWithoutExt + "." + ext;
}
