const html = require("html-template-tag");
const layout = require("./layout");

module.exports = () => layout(html `
  <h1>404 Page not found</h1>
  <h2>The page doesn't exist</h2>
  <pre>Please try again</pre>
`);