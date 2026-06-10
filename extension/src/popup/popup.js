// DOM取得
const qualityRange = document.querySelector('#qualityRange');
const value = document.querySelector('#qualityValue');

const saveBtn = document.querySelector('#save');
const filename = document.querySelector('#filename');

const statusMessage = document.querySelector("#statusMessage");

// スライダー更新
function updateSlider() {
    value.textContent = `${qualityRange.value}%`;

    const percent = ((qualityRange.value - qualityRange.min) / (qualityRange.max - qualityRange.min)) * 100;

    qualityRange.style.background =
        `linear-gradient(
            to right,
            #4c00ff 0%,
            #4c00ff ${percent}%,
            #e2e8f0 ${percent}%,
            #e2e8f0 100%
        )`;
}
// ステータス表示
function showStatus(message) {
    statusMessage.textContent = message;
    // statusMessage.textContent = '設定を保存しました';
    setTimeout(() => {
        statusMessage.textContent = '';
    }, 2000);
}

// イベント・保存処理
saveBtn.addEventListener("click", () => {
    chrome.storage.sync.set({
        filename: filename.value,
        quality: Number(qualityRange.value)
    }, ()=> {
        console.log("保存完了");
        showStatus("設定を保存しました");
    });
    // console.log("ファイル名：", filename.value);
    // console.log("画質：", qualityRange.value);
});

// 読み込み処理
chrome.storage.sync.get(
    ["filename", "quality"],
    (result) => {
        if (result.filename) {
            filename.value = result.filename;
        }
        if (result.quality !== undefined) {
            qualityRange.value = result.quality;
        }

        updateSlider();
        // console.log(result);
    }
);

updateSlider();
qualityRange.addEventListener("input", updateSlider);
