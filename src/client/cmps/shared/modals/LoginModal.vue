<template>
        <div class="auth-modal">
            <div class="auth-modal-cover" @click.stop="closeModal"></div>
            <div class="auth-modal-content txt-center">
                <div class="auth-modal-content-container">
                    <button @click="closeModal" class="close-modal-btn">
                        <close-icon :size="14" />
                    </button>
                    <img class="logo" src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                    <p @click="openSignupModal" class="signup-link">Don't have an account? signup now</p>
                    <div v-if="wrongProviderMsg || isShowFailedMsg" class="msg failed">{{wrongProviderMsg || 'WRONG EMAIL OR PASSWORD.'}}</div>
                    <div v-if="isShowSuccesseMsg" class="msg successe">You are now logged in.</div>
                    <form @submit.prevent="onRegister" class="auth-modal-field">
                        <eye-icon v-if="!isShowPass" @click="isShowPass = !isShowPass" class="eye-icon"></eye-icon>
                        <eye-off-icon v-else @click="isShowPass = !isShowPass" class="eye-icon"></eye-off-icon>
                        <input @input="removeFailedmsg" type="text" placeholder="Email" v-model="cred.email">
                        <input @input="removeFailedmsg" :type="passInputType" placeholder="Password" v-model="cred.password">
                        <div class="forgot-pass-link">
                            <a href="/email-pass">Forgot password?</a>
                        </div>
                        <button v-if="!isLoading" class="register-btn">Login</button>
                        <button v-else class="register-btn disabled">
                            <loader class="loader"/>
                        </button>
                    </form>
                    <div class="or-container">
                        <div class="line"></div>
                        <p style="margin-bottom: 10px">or Login with</p>
                        <div class="line"></div>
                    </div>
                    <div class="auth-modal-content-media-btns">
                        <a :href="googleLink" class="blue" role="button">
                            <img src="@/client/assets/imgs/google.svg" alt="Logo" />
                            Login with google
                        </a>
                        <!-- <a :href="facebookLink" class="blue" role="button">
                            <img class="facebook-img" src="@/client/assets/imgs/facebook.svg" alt="Logo" />
                            Login with facebook 
                        </a> -->
                    </div>
                </div>
            </div>
        </div>
</template>

<script>

import { eventBus, EV_wrong_provider, EV_open_signup } from '@/cms/services/eventBus.service';
import Loader from '@/client/cmps/common/icons/Loader';
import CloseIcon from 'vue-material-design-icons/Close';
import EyeIcon from 'vue-material-design-icons/Eye';
import EyeOffIcon from 'vue-material-design-icons/EyeOff';

export default {
    props: {
        showNotSameProviderMsg: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isLoading: false,
            cred:{
                email:'',
                password:'',
            },
            isShowFailedMsg: false,
            wrongProviderMsg: null,
            isShowSuccesseMsg: false,
            isShowPass: false
        };
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        googleLink(){
            if(window.AutopilotAnywhere && window.AutopilotAnywhere.sessionId) return (process.env.NODE_ENV === 'development') ? `http://localhost:3000/auth/google?q=${window.AutopilotAnywhere.sessionId}` : `/auth/google?q=${window.AutopilotAnywhere.sessionId}`
            return (process.env.NODE_ENV === 'development') ? `http://localhost:3000/auth/google` : `/auth/google`
        },
        // facebookLink(){
        //     if(window.AutopilotAnywhere && window.AutopilotAnywhere.sessionId) return (process.env.NODE_ENV === 'development') ? `http://localhost:3000/auth/facebook?q=${window.AutopilotAnywhere.sessionId}` : `/auth/facebook?q=${window.AutopilotAnywhere.sessionId}`
        //     return (process.env.NODE_ENV === 'development') ? `http://localhost:3000/auth/facebook` : `/auth/facebook`
        // },
        passInputType(){
            if(!this.isShowPass) return 'password'
            return 'text'
        }
    },
    methods: {
        closeModal() {
            this.$emit('closeModal');
        },
        openSignupModal(){
            eventBus.$emit(EV_open_signup);
            this.$emit('closeModal');
        },
        async onRegister(){
            if(this.isLoading){
                return
            }
            this.isLoading = true
            try{
                if(window.AutopilotAnywhere && window.AutopilotAnywhere.sessionId) this.cred.autoPilotSessionId = window.AutopilotAnywhere.sessionId
                this.cred.email = this.cred.email.trim()
                await this.$store.dispatch({type: 'login', cred: this.cred});
                this.isShowSuccesseMsg = true
                setTimeout(() => {
                    this.closeModal()
                },1500)
            }catch(err){
                 this.isShowFailedMsg = true
            }finally{
                this.isLoading = false
            }
        },
        removeFailedmsg(){
            this.isShowFailedMsg = false
            this.wrongProviderMsg = null
        },
        showWrongProviderMsg(msg){
            this.wrongProviderMsg = msg.toUpperCase()
        }
        
    },
    created(){
        eventBus.$on(EV_wrong_provider, this.showWrongProviderMsg);
        if(this.showNotSameProviderMsg) this.showWrongProviderMsg('This email signed up through a different login method')
    },
    components:{
        CloseIcon,
        EyeIcon,
        EyeOffIcon,
        Loader
    }
};
</script>

