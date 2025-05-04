chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "getTime") {
      const time = document.querySelector('.ytp-time-current').innerHTML

      sendResponse(time);
    }

    if (request.action === "getDuration") {
      const duration = document.querySelector('.ytp-time-duration').innerHTML

      sendResponse(duration);
    }

    if (request.action === "getComments") {
      // TODO purify DOM strings

      const commentsArray = Array.from(document.querySelectorAll('#contents ytd-comment-thread-renderer #content-text .yt-core-attributed-string'));
      const mappedComments = commentsArray.map(comment => {
        const commentText = comment.innerHTML
        const commentTextWithReplacedStars = commentText.replace(/(<img).+?(>)/g, '⭐');

        const commentTextWithoutTags = commentTextWithReplacedStars.replace(/(<([^>]+)>)/ig, '');
        return commentTextWithoutTags;
      });

      const flatMappedComments = mappedComments.flatMap(comment => comment.split('\n')).map(comment => comment.replaceAll('\r', ''));

      sendResponse(flatMappedComments);
    }
  });
