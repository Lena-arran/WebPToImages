import { setupMenus } from "./menu.js";
import { handleDownload } from "./download.js";

setupMenus();

chrome.runtime.onMessage.addListener(handleDownload);
