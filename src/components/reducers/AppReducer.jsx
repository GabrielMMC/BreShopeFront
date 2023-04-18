const INITIAL_STATE = {
    user: {},
    cart_items: [],
    wishlist_items: [],
    token: null,
    breshop: null,
    toggled: false,
    wishlist_toggled: false,
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
        case 'breshop':
            return {
                ...state,
                breshop: action.payload,

            };

        case 'logout':
            return {
                ...state,
                token: null,
                breshop: null,
                user: {},
                cart_items: [],
                wishlist_items: [],
                search: ''

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
        case 'wishlist_items':
            return {
                ...state,
                wishlist_items: action.payload,

            };
        case 'toggle_cart':
            return {
                ...state,
                toggled: action.toggled,
            };
        case 'toggle_wishlist':
            return {
                ...state,
                wishlist_toggled: action.toggled,
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
