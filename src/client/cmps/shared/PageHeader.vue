<template>
  <header class="page-header flex-center">
    <router-link to="/">
      <img class="logo" :src="require('@/client/assets/imgs/flat-logo.png')" alt="Logo" />
    </router-link>
    <span v-if="!isMobile" class="page-header-link">
      <button class="flex-align-center font-medium" @click="$router.go(-1)">
        <chevron-left-icon title="" />
        Back
      </button>
    </span>
  </header>
</template>

<script>
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft';

export default {
  components: {
    ChevronLeftIcon
  },
  computed: {
    isMobile() {
      return this.$store.getters.isScreenMobile;
    }
  }
};
</script>
