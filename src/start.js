import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import Uploader from "./uploader";
import FifthDimension from "./fifthdimension";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

import { init } from "./sockets";
import reducer from "./reducers";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

init(store);
let element = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(element, document.querySelector("main"));
