export default class Cache {
  static new() {
    this.instance = {
      results: [],
      search_term: null,
      selector_position: 0,
      selected_element: null,
      error_message: null
    };
  }

  static get(prop) {
    if (!this.instance) return;

    return this.instance[prop];
  }

  static set(prop, value) {
    console.log(prop, value);
    if (!this.instance) return;

    console.log("after return");

    this.instance[prop] = value;

    return this.instance[prop];
  }
}
