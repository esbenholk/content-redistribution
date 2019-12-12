////////if first passed argment is undefined, it replaces it with right assignement (in this case empty object)

export default function(state = {}, action) {
    if (action.type == "new_image") {
        state = {
            ...state,
            image: action.image
        };
    }

    return state;
}
