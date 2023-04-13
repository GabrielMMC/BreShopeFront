const INITIAL_STATE = {
    user: {},
    cart_items: [],
    token: null,
    breshop: null,
    toggled: false,
    collapsed: false,
    search: '',
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
        case 'breshop':
            return {
                ...state,
                breshop: action.payload
            };
        case 'cart_items':
            return {
                ...state,
                cart_items: action.payload,

            };
        case 'toggle_cart':
            return {
                ...state,
                toggled: action.toggled,
            };
        case 'search':
            return {
                ...state,
                search: action.payload,

            };
        default:
            return { ...state };
    }
};
