export function showErrorNotification() {

    console.log("通知処理を実行");

    const iconUrl = chrome.runtime.getURL("icons/converter-icon_128.png");

    chrome.notifications.create({
        type: "basic",
        iconUrl,
        title: "Image Converter",
        message: "ページを再読み込みしてから、もう一度お試しください。"
    }, (notificationId) => {

        if (chrome.runtime.lastError) {
            console.error(
                "通知作成失敗:",
                chrome.runtime.lastError.message
            );
            return;
        }

        console.log(
            "通知作成成功:",
            notificationId
        );
    });
}