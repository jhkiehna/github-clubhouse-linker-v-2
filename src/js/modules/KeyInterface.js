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
          SearchInterface.instance.searchInput.setAttribute(
            "class",
            "search-loading"
          );

          Search.do(this.value).then(() => {
            SearchInterface.buildResults();
            SearchInterface.instance.searchInput.setAttribute("class", "");
          });
        }
      }
    }
  }

  static handleSelect(keyCode) {
    const resultsContainer = SearchInterface.instance.resultsContainer;
    let previousSelectedElement = Cache.get("selected_element");

    if (previousSelectedElement) {
      const totalElements = resultsContainer.children.length;
      let selectorPosition = Cache.get("selector_position");
      previousSelectedElement.setAttribute("class", "search-result");

      if (keyCode == 38) {
        selectorPosition--;
        Cache.set("selector_position", selectorPosition);
      }
      if (keyCode == 40) {
        selectorPosition++;
        Cache.set("selector_position", selectorPosition);
      }

      if (selectorPosition < 0)
        Cache.set("selector_position", totalElements - 1);
      if (selectorPosition > totalElements - 1)
        Cache.set("selector_position", 0);
    }

    let selectedElement =
      resultsContainer.children[Cache.get("selector_position")];
    selectedElement.setAttribute("class", "search-result-selected");
    selectedElement.parentNode.scrollTop = selectedElement.offsetTop;

    Cache.set("selected_element", selectedElement);
  }
}
