export function images(images) {
    return {
        type: "entire_imageArray_onLoad",
        image: images
    };
}

export function newImage(newImage) {
    return {
        type: "newImage_for_imageArray_upload",
        image: newImage
    };
}
