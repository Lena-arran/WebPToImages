import { showErrorNotification } from "./notification.js";

// =======================
// 初期化（右クリックメニュー）
// =======================
export function setupMenus() {
    chrome.runtime.onInstalled.addListener(() => {

        chrome.contextMenus.removeAll(() => {
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
        
    });

    // =======================
    // クリック → contentに命令
    // =======================
    chrome.contextMenus.onClicked.addListener(async (info, tab) => {
        if (!tab?.id) return;

        const format =
            info.menuItemId === "to-png"
                ? "image/png"
                : "image/jpeg";

        chrome.tabs.sendMessage(
            tab.id,{
                type: "CONVERT_IMAGE",
                format: format                
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.warn(
                        "content.jsへ接続できません:",
                        chrome.runtime.lastError.message
                    );
                    showErrorNotification();
                }
            }
        )
    });
}