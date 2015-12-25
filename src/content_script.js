console.log("'send body to': content_script.js")

var data = {
  command: 'post_body',
  html: $("body").html()
}
chrome.runtime.connect().postMessage(data);
