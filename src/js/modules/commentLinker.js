export default function linkExistingComments() {
  let elements = [...document.querySelectorAll("td.js-comment-body p")];
  let regex = /(?<=^\[\w*\s*(ch))\d*\b/g;

  elements
    .map(element => {
      let matches = element.innerText.match(regex);
      return matches && matches.length
        ? { storyId: matches[0], element: element }
        : null;
    })
    .filter(object => object !== null)
    .forEach(object => {
      chrome.runtime.sendMessage(
        {
          contentScriptQuery: "fetchStory",
          storyId: object.storyId
        },
        storyResponse => {
          let storyLink = document.createElement("a");
          storyLink.setAttribute("href", storyResponse.app_url);
          storyLink.setAttribute("target", "_blank");
          storyLink.setAttribute("rel", "noopener noreferrer");
          storyLink.innerText = `Link to story ${storyResponse.id} - ${
            storyResponse.name
          }`;

          object.element.parentNode.appendChild(storyLink);
        }
      );
    });
}
