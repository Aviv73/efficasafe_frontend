import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);

extend('password', val => {
    const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return reg.test(val);
});

extend('confirmPassword', (passConfirm, [ pass ]) => {
    return passConfirm === pass;
},
{
    paramNames: ['pass']
});

extend('phone', val => {
    const reg = /\+?([\d|(][h|(\d{3})|. |\-|\d]{4,}\d)/;
    return reg.test(val);
});
