<template>
        <div class="auth-modal">
            <div class="auth-modal-cover" @click.stop="closeModal"></div>
            <div class="auth-modal-content txt-center">
                <img src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                <p style="padding: 0 10px 5px 10px">We have upgraded our registration system, if you are a returning user,</p>
                <p style="padding: 0 10px 5px 10px">please signup again</p>
                <button @click="$emit('openAuthModal')" style="padding: 10px 10px 20px 10px; color:#4a4aca; text-decoration: underline" >SIGN UP</button>
                    <div v-if="isShowFailedMsg" class="msg failed">WRONG EMAIL OR PASSWORD.</div>
                    <div v-if="isShowSuccesseMsg" class="msg successe">You are now logged in.</div>
                    <form @submit.prevent="onRegister" class="auth-modal-field">
                        <input @input="removeFailedmsg" type="text" placeholder="Email" v-model="cred.email">
                        <input @input="removeFailedmsg" type="password" placeholder="Password" v-model="cred.password">
                        <button></button>
                    </form>
                    <div class="forgot-pass-link">
                        <a href="/email-pass">Forgot password?</a>
                    </div>
                    <p style="margin-bottom: 10px">or</p>
                    <div class="auth-modal-content-media-btns">
                        <a :href="googleLink" class="red" role="button">LOGIN WITH GOOGLE</a>
                        <a :href="facebookLink" class="blue" role="button">LOGIN WITH FACEBOOK</a>
                    </div>
                    <button @click="onRegister" class="register-btn">LOGIN</button>
            </div>
        </div>
</template>

<script>

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
        facebookLink(){
            return (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/auth/facebook' : '/auth/facebook'
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
        
    }
};
</script>

