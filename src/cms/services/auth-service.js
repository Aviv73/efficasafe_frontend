


import Auth0Lock from 'auth0-lock';
import store from '../store';
import { auth0ClientId, auth0BaseURL } from '../config';
import { eventBus, EV_sign_up_modal } from './eventBus.service';


const options = {
    languageDictionary: {
        title: 'Efficasafe'
    },
    container: 'effica-modal',
    auth: {
        redirect: false
    },
    theme: {
        labeledSubmitButton: true,
        logo: "https://i.ibb.co/ZHXvGqx/logo-symbol.png",
        primaryColor: "#4FB891",

    },

    autoclose: true,
    avatar: null,
    hooks: {
        loggingIn: function (context, cb) {
            console.log('Hello from the login hook!');
            lock.on("authenticated", onLoggedin)

            cb();
        },
        signingUp: function (context, cb) {
            console.log('Hello from the sign-up hook!');
            lock.on("authenticated", onSignedup)
            cb();
        }
    }


}

function onLoggedin(authResult) {
    console.log('from login', authResult)
    let { accessToken, tokenType } = authResult;
    store.commit({
        type: 'setToken',
        token: `${tokenType} ${accessToken}`,
    });
    store.dispatch({ type: 'getUserInfo' });
}


function onSignedup(authResult) {
    let { accessToken, tokenType } = authResult;
    store.commit({
        type: 'setToken',
        token: `${tokenType} ${accessToken}`,
    });
    eventBus.$emit(EV_sign_up_modal)


}

const lock = new Auth0Lock(auth0ClientId, auth0BaseURL, options);

lock.on("authorization_error", function (error) {
    console.log('authorization_error', error);
})

lock.on("unrecoverable_error", function (error) {
    console.log('unrecoverable_error', error);
})



export default lock


// authroized route
// lock.on("authenticated", function (res) {
//     axios.post('http://localhost:3000/check', res)
//         .then(res => {
//             location.reload()
//         })
// })