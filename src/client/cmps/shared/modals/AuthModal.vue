<template>
        <div class="auth-modal">
            <div class="auth-modal-cover" @click.stop="closeModal"></div>
            <div class="auth-modal-content txt-center">
                <button @click="closeModal" class="close-modal-btn">
                    <close-icon :size="14" />
                </button>
                <img src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                <template v-if="!isShowVereficationMsg">
                    <form @submit.prevent="onRegister" class="auth-modal-field">
                        <input @focus="resetError('email')" :class="{ 'is-invalid': isInvaliedEmail }" type="text" placeholder="Email" v-model="cred.email">
                        <input @focus="resetError('pass')" :class="{ 'is-invalid': isInvaliedPassword }" type="password" placeholder="Password" v-model="cred.password">
                        <input @focus="resetError('name')" :class="{ 'is-invalid': isInvaliedName }" type="text" placeholder="Username" v-model="cred.username">
                        <div class="checkbox-container">
                            <input @change="changeCheckbox" class='checkbox' :class="{ 'is-invalid': isInvaliedName }" type="checkbox" v-model="cred.agreedToTerm">  
                            <p>I agree to the <a href="/terms-and-conditions">term and conditions</a></p>
                        </div>  
                        <button></button>
                    </form>
                    <p style="margin-bottom: 10px">or</p>
                    <div class="auth-modal-content-media-btns">
                        <a :href="googleLink" class="red" role="button">SIGN UP WITH GOOGLE</a>
                        <a :href="facebookLink" class="blue" role="button">SIGN UP WITH FACEBOOK</a>
                    </div>
                    <button @click="onRegister" class="register-btn" :class="{'invalid-btn': isInvaliedEmail || isInvaliedPassword || isInvaliedName || isNotAgreed}">{{btnTxt}}</button>
                </template>
                <template v-else>
                    <p class="auth-modal-title font-medium">Please confirm your email address</p>

                    <p class="auth-modal-sub-title font-bold">
                        An email will be sent to you shortly.
                        in order to complete registration process, please go to your
                        mail and click the confirmation link.
                    </p>

                    <p class="desc">
                        If you did not receive a confirmation email, please check
                        your spam or sales folder. Also, please verify that you entered a
                        valid email address in our sign-up form.
                    </p>

                    <p class="assistance">
                        If you need assistance, please contact us.
                    </p>
                    <button
                        class="resend-email-btn"
                        @click="onResendEmail"
                    >
                        Resend email verification
                    </button>
                </template>
            </div>
        </div>
</template>

<script>
import { userService } from '@/cms/services/user.service';
import CloseIcon from 'vue-material-design-icons/Close';

export default {
    data() {
        return {
            cred:{
                email:'',
                password:'',
                username:'',
                agreedToTerm: false,
                // agreedToMarketing: false
            },
            isShowVereficationMsg: false,
            isInvaliedEmail: false,
            isInvaliedPassword: false,
            isInvaliedName: false,
            isNotAgreed: false
        };
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        btnTxt(){
            if(this.isInvaliedEmail) return 'INVALID EMAIL'
            if(this.isInvaliedPassword) return 'PASSWORD MUST BE AT LEAST 8 CHARACTERS, WITH 1 UPPERCASE LETTER, 1 LOWERCASS LETTER AND 1 NUMBER'
            if(this.isInvaliedName) return 'USERNAME IS REQUIRED'
            if(this.isNotAgreed) return 'YOU MUST AGREE TO THE TERMS AND CONDITIONS'
            return 'SIGN UP'
        },
        googleLink(){
            return (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/auth/google' : '/auth/google'
        },
        facebookLink(){
            return (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/auth/facebook' : '/auth/facebook'
        },
    },
    methods: {
        closeModal() {
            this.$emit('closeModal');
        },
        async onRegister(){
            if(!this.verifyEmail()) this.isInvaliedEmail = true 
            if(!this.verifyPassword()) this.isInvaliedPassword = true
            if(this.cred.username === '') this.isInvaliedName = true
            if(!this.cred.agreedToTerm) this.isNotAgreed = true
            if(this.isInvaliedEmail || this.isInvaliedPassword || this.isInvaliedName || !this.cred.agreedToTerm) return
            try{
                await this.$store.dispatch({type: 'signup', cred: this.cred});
                this.isShowVereficationMsg = true
            }catch(err){
               console.log('auth failed');
            }
        },
        async onResendEmail() {
            if (!this.loggedInUser) return;
            await userService.resnedVerifcationMail(this.loggedInUser);
        },
        verifyEmail(){
            return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.cred.email)
        },
        verifyPassword(){
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(this.cred.password)
        },
        resetError(type){
            if(type === 'email') this.isInvaliedEmail = false
            if(type === 'pass') this.isInvaliedPassword = false
            if(type === 'name') this.isInvaliedName = false
        },
        changeCheckbox(){
            if(this.cred.agreedToTerm) this.isNotAgreed = false
        }
    },
    components:{
        CloseIcon
    }
};
</script>

