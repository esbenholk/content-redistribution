////////if first passed argment is undefined, it replaces it with right assignement (in this case empty object)

export default function(state = {}, action) {
    if (action.type == "entire_imageArray_onLoad") {
        state = {
            ...state,
            image: action.image
        };
    }
    if (action.type == "newImage_for_imageArray_upload") {
        const images = [...state.image.images, action.image];
        state = {
            ...state,
            image: { ...state.image, images }
        };
    }

    return state;
}
