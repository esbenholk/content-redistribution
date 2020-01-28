import React from "react";
import Uploader from "./uploader";
import Musicplayer from "./musicplayer";
import FifthDimension from "./fifthdimension";
import { useSelector } from "react-redux";

export default function App() {
    const images = useSelector(state => {
        return state && state.image;
    });
    return (
        <div>
            <FifthDimension images={images} />
            <Uploader />
            <Musicplayer />
        </div>
    );
}
