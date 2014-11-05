var espressologic;

espressologic = require('espressologic');

//Export the espressologic API object
//@ex used in routes.index.js for making all our application's REST calls
module.exports = espressologic.connect('http://localhost:8080/KahunaService/rest/el-local/demo/v1', 'demo_full');