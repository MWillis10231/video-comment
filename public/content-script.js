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

        const commentTextWithImgTagsReplacedWithAltValues = commentText.replace(/(<img).+?(>)/g, (match) => {
          const altMatch = match.match(/alt="(.*?)"/);

          return altMatch && altMatch[1] ? altMatch[1] : '';
        });

        const commentTextWithoutTags = commentTextWithImgTagsReplacedWithAltValues.replace(/(<([^>]+)>)/ig, '');
        return commentTextWithoutTags;
      });

      const flatMappedComments = mappedComments.flatMap(comment => comment.split('\n')).map(comment => comment.replaceAll('\r', ''));

      sendResponse(flatMappedComments);
    }

    if (request.action === "play") {
      const playButton = document.querySelector('.ytp-play-button');

      if (playButton) {
        playButton.click();
      }
    }

    if (request.action === "seek") {
      const requestTime = Number(request.time);
      const videoElement = document.querySelector('#movie_player > div.html5-video-container > video');

      videoElement.currentTime += (requestTime);
    }

    if (request.action === "setSpeed") {
      const requestSpeed = Number(request.speed);
      const videoElement = document.querySelector('#movie_player > div.html5-video-container > video');

      if (videoElement.playbackRate + requestSpeed <= 0.25) {
        videoElement.playbackRate = 0.25;
        return;
      }

      if (videoElement.playbackRate + requestSpeed >= 5) {
        videoElement.playbackRate = 5;
        return;
      }

      videoElement.playbackRate += requestSpeed;
      sendResponse(videoElement.playbackRate);
    }
  });
