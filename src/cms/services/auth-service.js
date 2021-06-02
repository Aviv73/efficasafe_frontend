


import Auth0Lock from 'auth0-lock';
import store from '../store';
import config from '../config';
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
        logo: `${window.location.origin}/img/logo-symbol.png`,
        primaryColor: '#55C595',

    },
    autoclose: true,
    avatar: null,
    hooks: {
        loggingIn: function (context, cb) {
            lock.on('authenticated', onLoggedin)
            cb();
        },
        signingUp: function (context, cb) {
            lock.on('authenticated', onSignedup)
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
const lock = new Auth0Lock(config.auth0ClientId, config.auth0BaseURL, options);

lock.on('authorization_error', function (error) {
    console.log('authorization_error', error);
})

lock.on('unrecoverable_error', function (error) {
    console.log('unrecoverable_error', error);
})



export default lock;