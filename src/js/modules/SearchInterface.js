import Cache from "./Cache";
import KeyInterface from "./KeyInterface";

export default class SearchInterface {
  static new(targetTextArea) {
    let container = document.createElement("div");
    let searchInput = document.createElement("input");

    container.setAttribute("id", "clubhouse-search-container");

    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("id", "search-input-box");
    searchInput.setAttribute("placeholder", "Search for clubhouse story");

    searchInput.addEventListener("keydown", KeyInterface.handle, false);
    searchInput.addEventListener(
      "blur",
      () => setTimeout(this.clearResultsContainer, 200),
      false
    );
    searchInput.addEventListener("focus", this.buildResults, false);

    container.appendChild(searchInput);

    this.instance = {
      targetTextArea: targetTextArea,
      container: container,
      searchInput: searchInput,
      resultsContainer: null,
      pastedStoryLink: null
    };
  }

  static buildError() {
    const { container } = SearchInterface.instance;

    let resultsContainer = document.createElement("div");
    resultsContainer.setAttribute("id", "search-results-container");

    let element = document.createElement("p");
    element.innerText = Cache.get("error_message");
    resultsContainer.appendChild(element);

    SearchInterface.instance.resultsContainer = resultsContainer;
    container.appendChild(resultsContainer);
    resultsContainer.scrollIntoView({ block: "center" });
  }

  static buildResults(fromCache = false) {
    const container = SearchInterface.instance.container;
    let resultsContainer = SearchInterface.instance.resultsContainer;
    const cacheResults = Cache.get("results");
    const cacheErrorMessage = Cache.get("error_message");

    SearchInterface.clearResultsContainer();

    if (fromCache && resultsContainer) {
      container.appendChild(resultsContainer);
    }

    if (cacheErrorMessage && cacheResults.length < 1) {
      SearchInterface.buildError();
    }

    if (cacheResults.length > 0) {
      resultsContainer = document.createElement("div");
      resultsContainer.setAttribute("id", "search-results-container");

      cacheResults.forEach(story => {
        let element = document.createElement("a");
        element.setAttribute("style", "cursor: pointer");
        element.setAttribute("id", `ch${story.id}`);
        element.setAttribute("data-app-url", `${story.app_url}`);
        element.setAttribute("data-story-name", `${story.name}`);
        element.setAttribute("class", "search-result");
        element.addEventListener("click", SearchInterface.pasteResult, false);

        element.innerText = story.name + " - " + story.project.name;

        resultsContainer.appendChild(element);
      });

      SearchInterface.instance.resultsContainer = resultsContainer;
      container.appendChild(resultsContainer);
      resultsContainer.scrollIntoView({ block: "center" });
    }
  }

  static pasteResult(event) {
    const {
      pastedStoryLink,
      container,
      targetTextArea
    } = SearchInterface.instance;

    if (pastedStoryLink) {
      container.parentNode.removeChild(pastedStoryLink);
      SearchInterface.instance.pastedStoryLink = null;
    }

    let storyLink = document.createElement("a");
    storyLink.setAttribute("id", "story-link");
    storyLink.setAttribute("target", "_blank");
    storyLink.setAttribute("rel", "noopener noreferrer");

    if (event) {
      targetTextArea.value = "[" + event.target.getAttribute("id") + "]";

      storyLink.setAttribute("href", event.target.getAttribute("data-app-url"));
      storyLink.innerText = `Link to Story ${event.target.getAttribute(
        "id"
      )} - ${event.target.getAttribute("data-story-name")}`;

      Cache.set("selected_element", null);
    } else {
      targetTextArea.value =
        "[" + Cache.get("selected_element").getAttribute("id") + "]";

      storyLink.setAttribute(
        "href",
        Cache.get("selected_element").getAttribute("data-app-url")
      );
      storyLink.innerText = `Link to Story ${Cache.get(
        "selected_element"
      ).getAttribute("id")} - ${Cache.get("selected_element").getAttribute(
        "data-story-name"
      )}`;
    }

    container.parentNode.insertBefore(storyLink, container.nextSibling);
    SearchInterface.instance.pastedStoryLink = storyLink;

    if (document.querySelector("#partial-new-comment-form-actions button")) {
      document
        .querySelector("#partial-new-comment-form-actions button")
        .removeAttribute("disabled");
    }
  }

  static clearResultsContainer() {
    const { container, resultsContainer } = SearchInterface.instance;

    if (resultsContainer) {
      container.removeChild(resultsContainer);

      SearchInterface.instance.resultsContainer = null;
    }
  }
}
