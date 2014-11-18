var espressologic;

espressologic = require('espressologic');

//Export the espressologic API object
//@ex used in routes.index.js for making all our application's REST calls
//module.exports = espressologic.connect('https://eval.espressologic.com/rest/livedemo/demo/v1', 'readonly'); //API key
module.exports = espressologic.connect('https://eval.espressologic.com/rest/rmbgo/demo/v1', 'demo', 'Password1'); //username/password