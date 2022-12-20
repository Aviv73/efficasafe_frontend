<template>
  <div class="auth-modal">
    <div class="auth-modal-cover" @click.stop="closeModal()"></div>
    <div>
      <button class="auth-modal-close-btn" @click="closeModal">X</button>
      <div class="auth-modal-content txt-center">
        <img src="@/client/assets/imgs/flat-logo.png" alt="Logo" />
        <div class="auth-modal-small-title font-medium gap-lg">
          Congratulations!
          <p>You have joined the elite physicians, pharmacists, and caregivers who already enjoy full access to the most up-to-date, evidence-based interactions database.</p>
        </div>

        <button class="btn" @click="$router.push('/search')">Let`s search Interactions!</button>
        <span class="d-block days-of-trial">You now have {{ managementData.freeTrailDaysNum }} days of free trial</span>

        <p class="assistance">Subscribe and search with no time limit</p>
        <!-- <p class="desc">Join the elite physicians, pharmacists, and caregivers who already enjoy full access to the most up-to-date, evidence-based interactions database.</p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$emit('closeModal');
      this.$router.push('/');
    }
  },
  computed: {
    managementData() {
      return this.$store.getters.getManagementData;
    }
  }
};
</script>
