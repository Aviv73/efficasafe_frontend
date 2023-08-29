<template>
  <footer class="main-footer no-print">
    <img src="@/client/assets/imgs/logo-symbol.png" width="23" height="24" alt="Efficasafe logo"
      class="main-footer-logo" />
    <small class="main-footer-details">
      <span class="d-block" v-if="lastSiteUpdate"> Site Last Updated {{ lastSiteUpdate | timeFilter('LL') }} | Copyright ©
        Naturopedia LTD | All Rights Reserved </span>
      <router-link to="/terms-and-conditions" class="link">Terms and Conditions</router-link>
      | <router-link to="/privacy-statement" class="link">Privacy Statement</router-link>
      <p>Email: <a href="mailto:contact@efficasafe.com" class="link">contact@efficasafe.com</a></p>
    </small>
  </footer>
</template>

<script>
export default {
  computed: {
    manageData() {
      return this.$store.getters.getManagementData;
    },
    lastSiteUpdate() {
      if (this.manageData && this.manageData.lastDataUpdate) {
        const dateToShow = Math.max(+new Date(document.lastModified), this.manageData.lastDataUpdate);
        return new Date(dateToShow);
      }
      return new Date(document.lastModified);
    }
  }
};
</script>
