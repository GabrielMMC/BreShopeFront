const INITIAL_STATE = {
    user: {},
    cart_notify: 0,
    wishlist_items: [],
    token: null,
    breshop: null,
    toggled: false,
    wishlist_toggled: false,
    collapsed: false,
    search: '',
    linkIsAllowed: true
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
                cart_notify: 0,
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
        case 'breshop':
            return {
                ...state,
                breshop: action.payload
            };
        case 'cart_notify':
            return {
                ...state,
                cart_notify: action.payload,

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
        case 'link':
            return {
                ...state,
                linkIsAllowed: action.payload,
            };
        default:
            return { ...state };
    }
};
