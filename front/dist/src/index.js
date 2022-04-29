"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const App_1 = require("./App");
const reactRootElementId = 'app-root';
if (!document.getElementById(reactRootElementId)) {
    let el = document.createElement('div');
    el.setAttribute('id', reactRootElementId);
    document.body.append(el);
}
const reactRootElement = document.getElementById(reactRootElementId);
(0, react_dom_1.render)((0, react_1.createElement)(App_1.App, {}, []), reactRootElement);
//# sourceMappingURL=index.js.map