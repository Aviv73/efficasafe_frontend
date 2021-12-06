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
                <h4 class="checkbox-title">Title</h4>
              </div>
              <p class="checkbox-disc">Felis amet risus pellentesque venenatis a amet. Amet commodo commodo auctor ipsum nibh vulputate.</p>
            </div>
            <div class="checkbox-container">
              <div class="checkbox-header-container">
                <checkbox class="checkbox" @change="checkOpt2" :isChecked="opt2"></checkbox>
                <h4 class="checkbox-title">Title</h4>
              </div>
              <p class="checkbox-disc">Felis amet risus pellentesque venenatis a amet. Amet commodo commodo auctor ipsum nibh vulputate.</p>
            </div>
            <div class="checkbox-container">
              <div class="checkbox-header-container">
                <checkbox class="checkbox" @change="checkOpt3" :isChecked="opt3"></checkbox>
                <h4 class="checkbox-title">Title</h4>
              </div>
              <p class="checkbox-disc">Felis amet risus pellentesque venenatis a amet. Amet commodo commodo auctor ipsum nibh vulputate.</p>
            </div>
            <button @click="onSubmit">Save changes</button>
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
    },
    checkOpt2(bol){
      this.opt2 = bol
    },
    checkOpt3(bol){
      this.opt3 = bol
    },
    onSubmit(){
      console.log(this.opt1);
      console.log(this.opt2);
      console.log(this.opt3);
    }
  },
  components: {
    Checkbox
  },
};
</script>
