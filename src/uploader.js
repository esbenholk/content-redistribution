import React from "react";
import axios from "./axios";

let button;

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message_to_uploader: "u r cute"
        };
        this.uploadfile = this.uploadfile.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.uploadimageurl = this.uploadimageurl.bind(this);
    }

    componentDidMount() {}
    handleChange(e) {
        console.log("file", e.target.files[0]);
        this.setState({ file: e.target.files[0] });
        button = this.uploadfile;
    }
    handleInput(e) {
        this.setState({ imageurl: e.target.value });
        button = this.uploadimageurl;
    }
    uploadimageurl() {
        let testString = this.state.imageurl;
        console.log("imageurl", this.state.imageurl);
        if (testString.includes("http")) {
            axios
                .post("/uploadimageurl", { imageurl: this.state.imageurl })
                .then(rdata => {
                    console.log("return from server to uploader", rdata);
                });
            this.setState({
                message_to_uploader: "u r cute"
            });
        } else {
            this.setState({
                message_to_uploader: "u have to use a real http addres babe"
            });
        }
    }
    uploadfile() {
        console.log("uploading file");
        var fd = new FormData();
        fd.append("file", this.state.file);
        axios
            .post("/uploadfile", fd)
            .then(({ data }) => {
                if (data.success) {
                    console.log("data", data);
                    // this.setState({
                    //     image: data.image,
                    //     uploaderIsVisible: !this.state.uploaderIsVisible,
                    //     cubeImage: data.image
                    // });
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("upload image didnt work", err);
                this.setState({
                    error: true
                });
            });
    }
    render() {
        return (
            <div className="focusSquare">
                <div id="uploaderfunctionality">
                    <p className="uploaderfunctions">
                        {" "}
                        wanna upload an image to the world? <br />
                    </p>
                    <p className="uploaderfunctions">
                        {" "}
                        upload a jpeg <br />
                        <input
                            className="uploaderfunctions"
                            id="file"
                            onChange={e => this.handleChange(e)}
                            type="file"
                            name="file"
                            accept="image/*"
                        />
                    </p>
                    <p className="uploaderfunctions">
                        {" "}
                        or insert an url <br />
                        <input id="url" onChange={e => this.handleInput(e)} />
                    </p>
                    <p className="uploaderfunctions">
                        {" "}
                        and render it to the 5th dimension{" "}
                    </p>
                    <button className="uploaderfunctions" onClick={button}>
                        {" "}
                        upload{" "}
                    </button>
                    <p className="uploaderfunctions">
                        {" "}
                        {this.state.message_to_uploader}
                    </p>
                </div>
            </div>
        );
    }
}
