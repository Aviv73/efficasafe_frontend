<template>
        <div class="auth-modal">
            <div class="auth-modal-cover" @click.stop="closeModal"></div>
            <div class="auth-modal-content txt-center">
                <img src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                    <div v-if="isShowFailedMsg" class="msg failed">WRONG EMAIL OR PASSWORD.</div>
                    <div v-if="isShowSuccesseMsg" class="msg successe">You are now logged in.</div>
                    <form @submit.prevent="onRegister" class="auth-modal-field">
                        <input @input="removeFailedmsg" type="text" placeholder="Email" v-model="cred.email">
                        <input @input="removeFailedmsg" type="password" placeholder="Password" v-model="cred.password">
                        <button></button>
                    </form>
                    <div class="forgot-pass-link">
                        <a href="/email-pass">Don't remember your password?</a>
                    </div>
                    <p style="margin-bottom: 10px">or</p>
                    <div class="auth-modal-content-media-btns">
                        <button class="red">LOGIN WITH GOOGLE</button>
                        <button class="blue">LOGIN WITH FACEBOOK</button>
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

