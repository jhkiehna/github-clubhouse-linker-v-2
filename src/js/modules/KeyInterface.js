import SearchInterface from "./SearchInterface";
import Search from "./Search";
import Cache from "./Cache";

export default class KeyInterface {
  static handle(event) {
    const results = Cache.get("results");
    const term = Cache.get("search_term");
    const { container, resultsContainer } = SearchInterface.instance;

    if (
      container.hasChildNodes(resultsContainer) &&
      (event.keyCode == 38 || event.keyCode == 40)
    ) {
      event.preventDefault();
      KeyInterface.handleSelect(event.keyCode);
    }

    if (event.keyCode == 13) {
      event.preventDefault();

      if (Cache.get("selected_element")) {
        SearchInterface.pasteResult();
        Cache.set("selected_element", null);
        Cache.set("selector_position", 0);
        SearchInterface.clearResultsContainer();
      } else {
        if (results.length > 0 && term === event.target.value) {
          SearchInterface.buildResults((fromCache = true));
        } else {
          Search.do(this.value).then(() => {
            SearchInterface.buildResults();
          });
        }
      }
    }
  }

  static handleSelect(keyCode) {
    let selectorPosition = Cache.get("selector_position");
    let previousSelectedElement = Cache.get("selected_element");
    let resultsContainer = SearchInterface.instance.resultsContainer;
    let totalElements = resultsContainer.children.length;
    resultsContainer.children[selectorPosition].setAttribute(
      "class",
      "search-result"
    );

    if (keyCode == 38) {
      if (previousSelectedElement) {
        Cache.set("selector_position", selectorPosition - 1);
      }
      if (Cache.get("selector_position") < 0) {
        Cache.set("selector_position", totalElements - 1);
      }
    }

    if (keyCode == 40) {
      if (previousSelectedElement) {
        Cache.set("selector_position", selectorPosition + 1);
      }
      if (Cache.get("selector_position") > totalElements - 1) {
        Cache.set("selector_position", 0);
      }
    }

    console.log(Cache.get("selector_position"));

    let selectedElement =
      resultsContainer.children[Cache.get("selector_position")];
    selectedElement.setAttribute("class", "search-result-selected");
    selectedElement.parentNode.scrollTop = selectedElement.offsetTop;

    Cache.set("selected_element", selectedElement);
  }
}
