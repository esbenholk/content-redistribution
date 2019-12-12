import React from "react";
import axios from "./axios";
import Uploader from "./uploader";
import FifthDimension from "./fifthdimension";

export default class App extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div>
                <FifthDimension />
                <Uploader upload={this.upload} />
            </div>
        );
    }
}
