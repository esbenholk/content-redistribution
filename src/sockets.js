import * as io from "socket.io-client";

import { newImage } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("images_for_5thdimension", imageArray => {
            console.log("socket receives image array:", imageArray);
            store.dispatch(newImage(imageArray));
        });
    }
};
