// src/authProvider.js
const authProvider = {
    login: ({ username, password }) => {
        // Replace this with your API call for login
        const request = new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email:username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        return fetch(request)
            .then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((auth) => {
                localStorage.setItem('auth', JSON.stringify(auth));
            });
    },
    logout: () => {
        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: () =>
        localStorage.getItem('auth') ? Promise.resolve() : Promise.reject(),
    getPermissions: () => Promise.resolve(),
};

export default authProvider;
