const INITIAL_STATE = {
    token: null,
    user: {},
    collapsed: false,
    toggled: true,
    currentPage: 1,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'dados':

            return {
                ...state,
                ...action.payload
            };

        case 'logout':
            return {
                ...state,
                token: null,
                user: {},
            };
        case 'user':
            return {
                ...state,
                user: action.payload,
            };
        case 'login':
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,

            };
        case 'cart_items':
            return {
                ...state,
                cart_items: action.payload,

            };
        default:
            return { ...state };
    }
};
