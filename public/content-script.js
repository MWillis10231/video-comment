chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "getTime") {
      const time = document.querySelector('.ytp-time-current').innerHTML

      sendResponse(time);
    }
  });