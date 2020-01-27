import * as io from "socket.io-client";

import { images, newImage } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("images_for_5thdimension", imageArray => {
            store.dispatch(images(imageArray));
            console.log("have images on client side");
        });

        socket.on("new_imagefile_added", imageForImageArray => {
            console.log("imageForImageArray", imageForImageArray);
            store.dispatch(newImage(imageForImageArray.image));
        });
    }
};
