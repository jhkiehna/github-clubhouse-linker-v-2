import Search from "./search";
import Cache from "./cache";

export default class SearchContainer {
  static new() {
    let container = document.createElement("div");
    let searchInput = document.createElement("input");

    container.setAttribute("id", "clubhouse-search-container");

    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("id", "search-input-box");
    searchInput.setAttribute("placeholder", "Search for clubhouse story");

    searchInput.addEventListener("keydown", this.keyHandler, false);
    searchInput.addEventListener(
      "blur",
      () => setTimeout(this.clearResultsContainer, 200),
      false
    );
    searchInput.addEventListener("focus", this.buildResults, false);

    container.appendChild(searchInput);

    this.instance = {
      container: container,
      input: searchInput,
      resultsContainer: null
    };
  }

  static keyHandler(event) {
    if (event.keyCode == 13) {
      if (
        Cache.get("results").length > 0 &&
        Cache.get("search_term") === event.target.value
      ) {
        SearchContainer.buildResults();
      } else {
        Search.do(this.value).then(() => {
          SearchContainer.buildResults();
        });
      }
    }
  }

  static getContainer() {
    if (!this.instance.container) return;

    return this.instance.container;
  }

  static buildResults() {
    SearchContainer.clearResultsContainer();

    if (Cache.get("error_message") || Cache.get("results").length > 0) {
      let resultsContainer = document.createElement("div");
      resultsContainer.setAttribute("id", "search-results-container");

      if (Cache.get("results").length > 0) {
        Cache.get("results").forEach(story => {
          let element = document.createElement("a");
          element.setAttribute("style", "cursor: pointer");
          element.setAttribute("id", `ch${story.id}`);
          element.setAttribute("data-app-url", `${story.app_url}`);
          element.setAttribute("data-story-name", `${story.name}`);
          element.setAttribute("class", "search-result");
          element.addEventListener("click", this.pasteResult, false);

          element.innerText = story.name + " - " + story.project.name;

          resultsContainer.appendChild(element);
        });
      } else {
        let element = document.createElement("p");
        element.innerText = Cache.get("error_message");
        resultsContainer.appendChild(element);
      }

      SearchContainer.instance.resultsContainer = resultsContainer;
      SearchContainer.getContainer().appendChild(resultsContainer);
      resultsContainer.scrollIntoView({ block: "center" });
    }
  }

  static pasteResult(event) {
    return;
  }

  static clearResultsContainer() {
    if (SearchContainer.instance.resultsContainer) {
      SearchContainer.getContainer().removeChild(
        SearchContainer.instance.resultsContainer
      );
      SearchContainer.instance.resultsContainer = null;
    }
  }
}
