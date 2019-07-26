import SearchInterface from "./modules/SearchInterface";
import linkExistingComments from "./modules/commentLinker";
import Cache from "./modules/Cache";

function inject() {
  let targetTextArea =
    document.querySelector("#new_comment_field") ||
    document.querySelector("#pull_request_body");

  if (
    targetTextArea &&
    !document.querySelector("#clubhouse-search-container")
  ) {
    Cache.new();
    SearchInterface.new(targetTextArea);

    linkExistingComments();

    targetTextArea.parentNode.insertBefore(
      SearchInterface.instance.container,
      targetTextArea
    );
  }
}

/*
 * When navigating back and forth in history, GitHub will preserve the DOM changes;
 * This means that the old features will still be on the page and don't need to re-run.
 * For this reason `onAjaxedPages` will only call its callback when a *new* page is loaded.
 *
 * Alternatively, use `onAjaxedPagesRaw` if your callback needs to be called at every page
 * change (e.g. to "unmount" a feature / listener) regardless of of *newness* of the page.
 */
document.addEventListener("pjax:end", inject, false);

inject();
