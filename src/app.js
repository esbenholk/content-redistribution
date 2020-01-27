import React from "react";
import Uploader from "./uploader";
import FifthDimension from "./fifthdimension";
import { useSelector } from "react-redux";

export default function App() {
    const images = useSelector(state => {
        console.log("in redux state: state.image", state.image);
        return state && state.image;
    });
    return (
        <div>
            <FifthDimension images={images} />
            <Uploader />
        </div>
    );
}
