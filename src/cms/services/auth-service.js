


import Auth0Lock from 'auth0-lock';
import store from '../store'

const clientId = "2hXxEV8p6hFWXRYi08dth8nNzDW1POeo";
const domain = "dev-kv5bhrqe.us.auth0.com";

var options = {
    languageDictionary: {
        title: 'Efficasafe'
    },
    theme: {
        labeledSubmitButton: true,
        logo: "https://i.ibb.co/ZHXvGqx/logo-symbol.png",
        primaryColor: "green",

    },
    autoclose: true,
    avatar: null,

}

const lock = new Auth0Lock(clientId, domain, options);

lock.on("authorization_error", function (error) {
    console.log('authorization_error', error);
})

lock.on("unrecoverable_error", function (error) {
    console.log('unrecoverable_error', error);
})

lock.on("authenticated", function (authResult) {
    let { accessToken, tokenType } = authResult;
    store.commit({ type: "setToken", token: `${tokenType} ${accessToken}` })
    store.dispatch({ type: "getUserInfo" })
});

export default lock


// authroized route
// lock.on("authenticated", function (res) {
//     axios.post('http://localhost:3000/check', res)
//         .then(res => {
//             location.reload()
//         })
// })