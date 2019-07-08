export default class Cache {
  constructor() {
    const instance = this.constructor.instance;

    if (instance) {
      return instance;
    }

    this.results = [];
    this.search_term = null;
    this.selector_position = 0;
    this.selected_element = null;

    this.constructor.instance = this;
  }
}
