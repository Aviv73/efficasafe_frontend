<template>
    <section class="manage-emails-page">
        <img class="logo" src="@/client/assets/imgs/logo.png" alt="Logo" />
        <h3 class="manage-emails-page-title">Manage your email prefrences</h3>
        <div v-if="!loggedInUser" class="login-container">
            <h3 class="login-req">You must be logged in to continue</h3>
            <div>
                <button class="signup-btn" @click="onOpenSignup">Sign Up</button>
                or
                <button class="signup-btn" @click="onOpenLogin">Login</button>
            </div>
        </div>
        <template v-else>
          <p class="manage-emails-page-email">{{loggedInUser.email}}</p>
          <div class="line"></div>
          <section class="checkboxes-container">
            <div class="checkbox-container">
              <div class="checkbox-header-container">
                <checkbox class="checkbox" @change="checkOpt1" :isChecked="opt1"></checkbox>
                <h4 class="checkbox-title">Educational</h4>
              </div>
              <p class="checkbox-disc">Learn more about interactions mechanisms, get the latest interactions updates, and explore case studies, so you can stay on top of things.</p>
            </div>
            <div class="checkbox-container">
              <div class="checkbox-header-container">
                <checkbox class="checkbox" @change="checkOpt2" :isChecked="opt2"></checkbox>
                <h4 class="checkbox-title">News and announcements</h4>
              </div>
              <p class="checkbox-disc">Stay updated on new site features we’ve developed to help improve your experience and productivity.</p>
            </div>
            <div class="checkbox-container">
              <div class="checkbox-header-container">
                <checkbox class="checkbox" @change="checkOpt3" :isChecked="opt3"></checkbox>
                <h4 class="checkbox-title">Offers and promotions</h4>
              </div>
              <p class="checkbox-disc">Get exclusive deals and upgrades, so you can save more on the tools you need.</p>
            </div>
            <div class="line" style="margin-bottom: 32px"></div>
            <div class="checkbox-container">
              <div class="checkbox-header-container">
                <checkbox class="checkbox" @change="onUnsubscribe" :isChecked="isUnsubscribe"></checkbox>
                <h4 class="checkbox-title">Unsubscribe from all emails</h4>
              </div>
              <p class="checkbox-disc">Note: You will always receive transactional emails related to your account.</p>
            </div>
            <div class="btn-container">
              <button @click="onSubmit">Save changes</button>
              <button class="cancel-btn" @click="$router.push('/')">Cancel</button>
            </div>
          </section>
        </template>
    </section>
</template>

<script>

import { eventBus, EV_open_singup, EV_open_login } from '@/cms/services/eventBus.service';
import Checkbox from "@/client/cmps/common/Checkbox";

export default {

  data() {
    return {
      opt1: true,
      opt2: true,
      opt3: true,
      isUnsubscribe: false
    };
  },
  computed:{
    loggedInUser() {
        return this.$store.getters.loggedInUser;
    },
  },
  methods:{
    onOpenSignup(){
        eventBus.$emit(EV_open_singup)
    },
    onOpenLogin(){
        eventBus.$emit(EV_open_login)
    },
    checkOpt1(bol){
      this.opt1 = bol
      if(bol){
        this.isUnsubscribe = false
      }
    },
    checkOpt2(bol){
      this.opt2 = bol
      if(bol){
        this.isUnsubscribe = false
      }
    },
    checkOpt3(bol){
      this.opt3 = bol
      if(bol){
        this.isUnsubscribe = false
      }
    },
    onUnsubscribe(bol){
      this.opt1 = !bol
      this.opt2 = !bol
      this.opt3 = !bol
      this.isUnsubscribe = bol
    },
    onSubmit(){
      console.log(this.opt1);
      console.log(this.opt2);
      console.log(this.opt3);
      console.log(this.isUnsubscribe);
    }
  },
  components: {
    Checkbox
  },
};
</script>
