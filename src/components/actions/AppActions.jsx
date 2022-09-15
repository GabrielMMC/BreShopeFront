export const login = (data) => (
    {
        type: 'login',
        payload: data
    }
);

export const logout = () => (
    {
        type: 'logout',
        payload: ''
    }
);



export const mudarUser = (data) => (
    {
        type: 'user',
        payload: data
    }
);


export const mudarDados = (data) => (
    {
        type: 'dados',
        payload: data
    }
);
