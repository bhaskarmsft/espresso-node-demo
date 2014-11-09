Entrospect
==========

A sample application built on an [Espresso Logic](http://espressologic.com/) API. This small app demonstrates how the [Espresso Logic SDK](https://www.npmjs.org/package/espressologic) package interacts with rules and resources defined in Logic Designer.

Entrospect operates as a simple customer orders portal, and all the SDK interactions are viewable in [routes/index.js](https://github.com/EspressoLogicCafe/entrospect/blob/master/routes/index.js). 
###Getting Started

    > npm install entrospect
    > npm start entrospect

Then visit:

    http://localhost:3000


And you should be up and running with the read only evaluation API. To use a broader access API, please [sign up for your own evaluation account](http://www.espressologic.com/) and point the final line of [config.js](https://github.com/EspressoLogicCafe/entrospect/blob/master/config.js) to your own evaluation project API.