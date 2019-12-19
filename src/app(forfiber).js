import React from "react";
import { Canvas } from "react-three-fiber";
import FifthDimension from "./fifthdimensionfiber";
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
        <FifthDimension />
    </Provider>
);

export default class App extends React.Component {
    constructor(props) {
        super();
    }
    render() {
        return (
            <Canvas>
                <element />
            </Canvas>
        );
    }
}
