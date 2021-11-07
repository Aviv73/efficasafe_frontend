<template>
        <div class="auth-modal">
            <div class="auth-modal-cover" @click.stop="closeModal"></div>
            <div class="auth-modal-content txt-center">
                <div class="auth-modal-content-container">
                    <button @click="closeModal" class="close-modal-btn">
                        <close-icon :size="14" />
                    </button>
                    <img src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
                    <div v-if="showFreeSearchesMsg" class="searches-msg">
                        <h3>No free searches left</h3>
                        <h4>Want to enjoy efficasafe free trial for</h4>
                        <h4>another {{managementData.freeTrailDaysNum}} days?</h4>
                        <p><span>No problem!</span> just sign up and continue searching</p>
                    </div>
                    <div v-if="isEmailExists" class="msg failed">This email already exists</div>
                    <template v-if="!isShowVereficationMsg">
                        <form @submit.prevent="onRegister" class="auth-modal-field">
                            <eye-icon v-if="!isShowPass" @click="isShowPass = !isShowPass" class="eye-icon"></eye-icon>
                            <eye-off-icon v-else @click="isShowPass = !isShowPass" class="eye-icon"></eye-off-icon>
                            <input @focus="resetError('email')" :class="{ 'is-invalid': isInvaliedEmail }" type="text" placeholder="Email" v-model="cred.email">
                            <input @focus="resetError('pass')" :class="{ 'is-invalid': isInvaliedPassword }" :type="passInputType" placeholder="Password" v-model="cred.password">
                            <input @focus="resetError('name')" :class="{ 'is-invalid': isInvaliedName }" type="text" placeholder="Username" v-model="cred.username">
                            <div class="checkbox-container">
                                <input @change="changeCheckbox" class='checkbox' :class="{ 'is-invalid': isInvaliedName }" type="checkbox" v-model="cred.agreedToTerm">  
                                <p>I agree to the <a href="/terms-and-conditions">terms and conditions</a></p>
                            </div>  
                            <button @click="onRegister" :disabled="isBtnDisabled" class="register-btn" :class="{'invalid-btn': isInvaliedEmail || isInvaliedPassword || isInvaliedName || isNotAgreed, 'disabled': isBtnDisabled}">{{btnTxt}}</button>
                        </form>
                        <div class="or-container">
                            <div class="line"></div>
                            <p style="margin-bottom: 10px">or Signup with</p>
                            <div class="line"></div>
                        </div>
                        <div class="auth-modal-content-media-btns">
                            <a :href="googleLink" class="blue" role="button">
                                <img src="@/client/assets/imgs/google.jpeg" alt="Logo" />
                                Signup with google 
                            </a>
                        </div>
                        
                    </template>
                    <template v-else>
                        <p class="auth-modal-title font-medium">Please confirm your email address</p>

                        <p class="auth-modal-sub-title font-bold">
                            An email has been sent to you.
                            in order to complete the registration process, please go to your
                            mail and click the confirmation link.
                        </p>

                        <p class="desc mt">
                            If you can't find the confirmation email, please check
                            your spam or sales folder. 
                        </p>
                        <p class="desc">
                            In addition, please verify that you entered a
                            valid email address. you can find your email in your account in the
                            upper left corner.
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
        </div>
</template>

<script>
import { userService } from '@/cms/services/user.service';
import { eventBus, EV_email_exists, EV_show_user_msg } from '@/cms/services/eventBus.service';
import CloseIcon from 'vue-material-design-icons/Close';
import EyeIcon from 'vue-material-design-icons/Eye';
import EyeOffIcon from 'vue-material-design-icons/EyeOff';

export default {
    props: {
        showFreeSearchesMsg: {
            type: Boolean,
            default: false
        },
        showValidateMsg: {
            type: Boolean,
            default: false
        },
    },
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
            isNotAgreed: false,
            isEmailExists: false,
            isBtnDisabled: false,
            isShowPass: false
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
            return 'Signup'
        },
        googleLink(){
            return (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/auth/google' : '/auth/google'
        },
        passInputType(){
            if(!this.isShowPass) return 'password'
            return 'text'
        },
        managementData(){
            return this.$store.getters.getManagementData;
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
                this.isBtnDisabled = true
                await this.$store.dispatch({type: 'signup', cred: this.cred});
                if(!this.isEmailExists){
                    if(this.$route.name !== 'Payment') this.isShowVereficationMsg = true
                    else this.closeModal()
                }
                this.isBtnDisabled = false
            }catch(err){
               console.log('auth failed');
            }
        },
        async onResendEmail() {
            if (!this.loggedInUser) return;
            try{
                await userService.resnedVerifcationMail(this.loggedInUser);
                eventBus.$emit(EV_show_user_msg, 'An email has been sent to you', 5000);
            }catch(err){
                console.log(err);
            }
        },
        verifyEmail(){
            return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.cred.email)
        },
        verifyPassword(){
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(this.cred.password)
        },
        resetError(type){
            if(type === 'email') {
                this.isInvaliedEmail = false
                this.isEmailExists = false
            }
            if(type === 'pass') this.isInvaliedPassword = false
            if(type === 'name') this.isInvaliedName = false
        },
        changeCheckbox(){
            if(this.cred.agreedToTerm) this.isNotAgreed = false
        },
        showEmailExistsMsg(){
            this.isEmailExists = true
        }
    },
    created(){
        if(this.showValidateMsg) this.isShowVereficationMsg = true
        eventBus.$on(EV_email_exists, this.showEmailExistsMsg)
    },
    components:{
        CloseIcon,
        EyeIcon,
        EyeOffIcon
    }
};
</script>

