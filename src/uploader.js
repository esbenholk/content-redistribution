import React from "react";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        document.addEventListener("click", function() {
            console.log("uploader document clicked");
        });
    }
    render() {
        return (
            <div className="focusSquare">
                <div id="uploaderfunctionality">
                    <input
                        className="uploaderfunctions"
                        id="file"
                        onChange={e => this.handleChange(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                    <button
                        className="uploaderfunctions"
                        onClick={this.props.upload}
                    >
                        {" "}
                        upload{" "}
                    </button>
                </div>
            </div>
        );
    }
}
