<template>
        <div class="auth-modal">
            <div class="auth-modal-cover" @click.stop="closeModal"></div>
            <div class="auth-modal-content txt-center">
                <div class="auth-modal-content-container">
                    <button @click="closeModal" class="close-modal-btn">
                        <close-icon :size="14" />
                    </button>
                    <img src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                    <p style="padding: 0 10px 5px 10px; margin-block-end: 18px; font-weight: 500;">We have upgraded our registration system, if you are a returning user, please <span @click="$emit('openAuthModal')" style="text-decoration: underline; cursor: pointer;">signup</span>  again</p>
                        <div v-if="isShowFailedMsg" class="msg failed">WRONG EMAIL OR PASSWORD.</div>
                        <div v-if="isShowSuccesseMsg" class="msg successe">You are now logged in.</div>
                        <form @submit.prevent="onRegister" class="auth-modal-field">
                            <input @input="removeFailedmsg" type="text" placeholder="Email" v-model="cred.email">
                            <input @input="removeFailedmsg" type="password" placeholder="Password" v-model="cred.password">
                            <div class="forgot-pass-link">
                                <a href="/email-pass">Forgot password?</a>
                            </div>
                            <button @click="onRegister" class="register-btn">Login</button>
                        </form>
                        <div class="or-container">
                            <div class="line"></div>
                            <p style="margin-bottom: 10px">or Login with</p>
                            <div class="line"></div>
                        </div>
                        <div class="auth-modal-content-media-btns">
                            <a :href="googleLink" class="blue" role="button">
                                <img src="@/client/assets/imgs/google.jpeg" alt="Logo" />
                                Login with google
                            </a>
                        </div>
                </div>
            </div>
        </div>
</template>

<script>

import CloseIcon from 'vue-material-design-icons/Close';

export default {
    data() {
        return {
            cred:{
                email:'',
                password:'',
            },
            isShowFailedMsg: false,
            isShowSuccesseMsg: false
        };
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        googleLink(){
            return (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/auth/google' : '/auth/google'
        },
    },
    methods: {
        closeModal() {
            this.$emit('closeModal');
        },
        async onRegister(){
            try{
                await this.$store.dispatch({type: 'login', cred: this.cred});
                this.isShowSuccesseMsg = true
                setTimeout(() => {
                    this.closeModal()
                },1500)
            }catch(err){
                 this.isShowFailedMsg = true
            }
        },
        removeFailedmsg(){
            this.isShowFailedMsg = false
        }
        
    },
    components:{
        CloseIcon
    }
};
</script>

