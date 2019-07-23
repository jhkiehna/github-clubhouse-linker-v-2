import Cache from "./cache";

export default class Search {
  static do(searchTerm) {
    Cache.set("error_message", null);
    Cache.set("search_term", searchTerm);
    Cache.set("results", []);

    return new Promise(resolver => {
      let port = chrome.runtime.connect({ name: "search" });
      port.postMessage({ action: "searchStories", searchTerm: searchTerm });
      port.onMessage.addListener(function(msg) {
        if (msg.response === "stories") {
          if (msg.stories.length > 0) {
            Cache.set("results", msg.stories);
          } else {
            Cache.set("error_message", "No Stories Found");
          }

          resolver();
        } else {
          Cache.set("error_message", "Error communicating with ClubhouseAPI");
        }
      });
    });
  }
}

// clearResults();
// let searchTerm = searchInput.value;

// if ($CACHE.results.length && $CACHE.search_term === searchInput.value) {
//   displayCachedResults();
// } else if (searchTerm) {
//   let resultsContainer = document.createElement("div");
//   resultsContainer.setAttribute("id", "search-results-container");

//   chrome.runtime.sendMessage(
//     { contentScriptQuery: "searchStories", searchTerm: searchTerm },
//     response => {
//       $CACHE.search_term = searchTerm;
//       $CACHE.results = [];

//       if (response.data) {
//         if (response.data.length) {
//           response.data.forEach(story => {
//             chrome.runtime.sendMessage(
//               {
//                 contentScriptQuery: "fetchProject",
//                 projectId: story.project_id
//               },
//               projectResponse => {
//                 let element = document.createElement("a");
//                 element.setAttribute("style", "cursor: pointer");
//                 element.setAttribute("id", `ch${story.id}`);
//                 element.setAttribute("data-app-url", `${story.app_url}`);
//                 element.setAttribute("data-story-name", `${story.name}`);
//                 element.setAttribute("class", "search-result");
//                 element.addEventListener("click", pasteResult, false);

//                 element.innerText = story.name + " - " + projectResponse.name;
//                 $CACHE.results.push(element);

//                 resultsContainer.appendChild(element);
//               }
//             );
//           });
//         } else {
//           let element = document.createElement("p");
//           element.innerText = "Search returned no results";

//           resultsContainer.appendChild(element);
//         }
//       } else {
//         let element = document.createElement("p");
//         element.innerText = response.message
//           ? response.message
//           : "An error occurred";

//         resultsContainer.appendChild(element);
//       }

//       searchInput.parentNode.appendChild(resultsContainer);
//       resultsContainer.scrollIntoView({ block: "center" });
//     }
//   );
// }
