import Cache from "./Cache";

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
