export function newImage(newImage) {
    console.log("new image in actions", newImage);
    return {
        type: "new_image",
        image: newImage
    };
}
