export default class SearchContainer {
  constructor() {
    const instance = this.constructor.instance;

    if (instance) {
      return instance;
    }

    this.makeNew();

    this.constructor.instance = this;
  }

  makeNew() {
    this.container = document.createElement("div");
    this.searchInput = document.createElement("input");

    this.container.setAttribute("id", "clubhouse-search-container");

    this.searchInput.setAttribute("type", "text");
    this.searchInput.setAttribute("id", "search-input-box");
    this.searchInput.setAttribute("placeholder", "Search for clubhouse story");

    this.searchInput.addEventListener("keydown", this.keyHandler, false);
    // searchInput.addEventListener("blur", clearSearch, false);
    // searchInput.addEventListener("focus", displayCachedResults, false);

    this.container.appendChild(this.searchInput);
  }

  keyHandler(event) {
    // if (document.querySelector("#search-results-container")) {
    //   if (event.keyCode == 38 || event.keyCode == 40) {
    //     event.preventDefault();
    //     select(event.keyCode);
    //   }
    // }

    if (event.keyCode == 13) {
      console.log("enter pressed");
      // event.preventDefault();
      // if ($CACHE.selected_element) {
      //   pasteResult();
      // } else {
      //   search();
      // }
    }
  }

  static getContainer() {
    if (!this.instance.container) {
      return null;
    }

    return this.instance.container;
  }
}
