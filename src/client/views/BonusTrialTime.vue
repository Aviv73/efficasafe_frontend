<template>
  <section class="bonus-trial-page">
    <div v-show="!user" class="login-container">
        <h3 class="login-req">You must be logged in to continue</h3>
        <div>
            <button class="login-btn" @click="onOpenLogin">Login</button>
        </div>
    </div>
    <template v-if="user">
        <div class="loader-container">
            <loader/>
        </div>
    </template>
  </section>
</template>

<script>

import Loader from '@/client/cmps/common/icons/Loader';
import { manageService } from '@/cms/services/manage.service'
import { eventBus, EV_open_login } from '@/cms/services/eventBus.service';

export default {
  data() {
    return {
      user: null,
      trialDaysToAdd: null
    };
  },
  computed: {
    loggedInUser(){
        return this.$store.getters.loggedInUser;
    },
  },
  methods: {
    onOpenLogin(){
        eventBus.$emit(EV_open_login)
    },
    async addTrialTimeToUser(){
        if(this.user.gotBonusTrial) return this.$router.push('/')
        const timeToAdd = 1000 * 60 * 60 * 24 * this.trialDaysToAdd
        this.user.trialTime = Date.now() + timeToAdd
        this.user.gotBonusTrial = true
        await this.$store.dispatch({ type: 'updateLoggedInUser', user: this.user });
        await this.$store.dispatch({ type: 'updateAutoPilotContact', user: this.user});
        this.$router.push('/?trailAdded=true')
    }
  },
  watch:{
      async loggedInUser(newUser){
          this.user = newUser
          await this.addTrialTimeToUser()
      }
  },
  async created() {
      const managementData = await manageService.list()
      this.trialDaysToAdd = +managementData.freeTrailDaysNum
      if(this.loggedInUser){
          this.user = JSON.parse(JSON.stringify(this.loggedInUser))
          await this.addTrialTimeToUser()
      }
  },
  components:{
      Loader
  }
};
</script>
