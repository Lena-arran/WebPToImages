// 右クリックされた画像を取得してbackgroundへ

document.addEventListener("contextmenu", (e) => {
    const target = e.target;

    if(target.tagName === "IMG") {
        chrome.runtime.sendMessage({
            type: "IMAGE_CLICK",
            src: target.src
        });
        alert('取得からのデータ移動へ');
    }
});