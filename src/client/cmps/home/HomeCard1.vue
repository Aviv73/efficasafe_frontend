<template>
  <section class="cards">
    <span class="header">
      <h1 class="header-title font-bold">
        Transforming Herb-Drug-Supplement interactions analysis <br />
        for greater efficacy and safety <br v-if="isScreenNarrow" />of integrative healthcare.
      </h1>
    </span>
    <!-- The Efficasafe Interaction-checker is based on thousands of published clinical trials, <br />
      presenting the entire picture rather than just pieces of it.
       -->

    <!-- Transforming herb-drug-supplement interactions analysis <br />
      for greater efficacy and safety of integrative healthcare. -->
    <div class="img-cards flex">
      <img src="@/client/assets/imgs/card-1.svg" alt="card" />
      <img src="@/client/assets/imgs/card-2.svg" alt="card" />
      <img src="@/client/assets/imgs/card-3.svg" alt="card" />
      <img src="@/client/assets/imgs/card-4.svg" alt="card" />
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow;
    }
  }
};
</script>

<style></style>
