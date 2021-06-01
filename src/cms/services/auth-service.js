


import Auth0Lock from 'auth0-lock';
import store from '../store'
import { eventBus, EV_sign_up_modal } from './eventBus.service';


const clientId = "ECULxkc4xSBK8omj6EXcnPbyKuTvJ3Nr";
const domain = "dev-385wz0kc.us.auth0.com";

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
    eventBus.$emit(EV_sign_up_modal);
}

const lock = new Auth0Lock(clientId, domain, options);

lock.on("authorization_error", function (error) {
    console.log('authorization_error', error);
})

lock.on("unrecoverable_error", function (error) {
    console.log('unrecoverable_error', error);
})



export default lock;