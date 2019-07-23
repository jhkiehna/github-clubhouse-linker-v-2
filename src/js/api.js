const CLUBHOUSE_API = "https://api.clubhouse.io/api/v2";

function appendProject(CLUBHOUSE_API_TOKEN, story, resolver) {
  fetch(
    `${CLUBHOUSE_API}/projects/${story.project_id}?token=${CLUBHOUSE_API_TOKEN}`
  )
    .then(res => res.json())
    .then(project => {
      story.project = project;
      resolver(story);
    })
    .catch(error => {
      console.log(error);
    });
}

function getStories(CLUBHOUSE_API_TOKEN, searchTerm, finalResolver) {
  fetch(
    `${CLUBHOUSE_API}/search/stories?token=${CLUBHOUSE_API_TOKEN}&query=${searchTerm}&page_size=25`
  )
    .then(res => res.json())
    .then(response => {
      let stories = response.data.map(story => {
        return new Promise(resolver =>
          appendProject(CLUBHOUSE_API_TOKEN, story, resolver)
        );
      });

      Promise.all(stories).then(stories => {
        finalResolver(stories);
      });
    });
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "search");

  port.onMessage.addListener(function(msg) {
    if (msg.action === "searchStories") {
      chrome.storage.sync.get(["clubhouseToken"], item => {
        let CLUBHOUSE_API_TOKEN = item.clubhouseToken;

        new Promise(finalResolver => {
          getStories(CLUBHOUSE_API_TOKEN, msg.searchTerm, finalResolver);
        }).then(stories =>
          port.postMessage({ response: "stories", stories: stories })
        );
      });
    }
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // if (request.contentScriptQuery == "searchStories") {
  //   chrome.storage.sync.get(["clubhouseToken"], item => {
  //     let CLUBHOUSE_API_TOKEN = item.clubhouseToken;

  //     sendResponse(
  //       new Promise(finalResolver => {
  //         getStories(CLUBHOUSE_API_TOKEN, request.searchTerm, finalResolver);
  //       })
  //     );
  //   });
  // }

  if (request.contentScriptQuery == "fetchStory") {
    chrome.storage.sync.get(["clubhouseToken"], item => {
      let CLUBHOUSE_API_TOKEN = item.clubhouseToken;

      fetch(
        `${CLUBHOUSE_API}/stories/${
          request.storyId
        }?token=${CLUBHOUSE_API_TOKEN}`
      )
        .then(res => res.json())
        .then(json => {
          sendResponse(json);
        })
        .catch(error => {
          console.log(error);
        });
    });

    return true;
  }

  if (request.contentScriptQuery == "setToken") {
    chrome.storage.sync.set({ clubhouseToken: request.token }, () => {
      console.log(request.token + " saved");

      sendResponse("Token Saved!");
    });

    return true;
  }

  if (request.contentScriptQuery == "checkToken") {
    chrome.storage.sync.get(["clubhouseToken"], item => {
      if (item.clubhouseToken) {
        sendResponse("There is a token Saved!\nYou can replace it anytime.");
      }
      sendResponse("No token saved");
    });

    return true;
  }
});
