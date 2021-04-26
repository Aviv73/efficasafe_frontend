


import Auth0Lock from 'auth0-lock';
import store from '../store'

const clientId = "ECULxkc4xSBK8omj6EXcnPbyKuTvJ3Nr";
const domain = "dev-385wz0kc.us.auth0.com";

var options = {
    languageDictionary: {
        title: 'Efficasafe'
    },

    theme: {
        labeledSubmitButton: true,
        logo: "https://i.ibb.co/ZHXvGqx/logo-symbol.png",
        primaryColor: "#4FB891",

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
    console.log('im here ', authResult)
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