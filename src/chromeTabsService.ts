/**
 *
 * @returns {Promise<number | undefined>} The ID of the active tab in the last focused window, or undefined if no such tab exists.
 * @description This function queries the Chrome tabs API to find the active tab in the last focused window.
 */
const getTabId = async (): Promise<number | undefined> => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})

  return tab?.id;
}

/**
 *
 * @param tabId
 * @param message
 * @returns {Promise<any>} The response from the content script.
 * @description Sends a message to the content script of the specified tab.
 */
const sendMessageToTab = async (tabId: number, message: object) => {
  return await chrome.tabs.sendMessage(tabId, message)
}

const createTab = async (url: string) => {
  await chrome.tabs.create({ url });
}

export {
  getTabId,
  sendMessageToTab,
  createTab
}
