<template>
  <section class="cards">
    <span class="header">
      <span class="header-title font-bold">Beyond just checking interactions, efficasafe also provides:</span>
    </span>

    <div class="cards-container flex">
      <div class="home-card">
        <img src="@/client/assets/imgs/card-1.svg" alt="card" />
        <span
          >Optimization of <br />
          integrative treatments</span
        >
      </div>
      <!-- <div v-if="!isScreenNarrow" class="line-container">
        <div class="line-between"></div>
      </div> -->
      <div class="home-card">
        <img src="@/client/assets/imgs/card-2.svg" alt="card" />
        <span
          >Patient <br />
          monitoring tools</span
        >
      </div>
      <!-- <div v-if="!isScreenNarrow" class="line-container">
        <div class="line-between"></div>
      </div> -->
      <div class="home-card">
        <img src="@/client/assets/imgs/card-3.svg" alt="card" />
        <span
          >Full monographs of <br />
          drugs, herbs, and supplements</span
        >
      </div>
      <!-- <div v-if="!isScreenNarrow" class="line-container">
        <div class="line-between"></div>
      </div> -->
      <div class="home-card">
        <img src="@/client/assets/imgs/card-4.svg" alt="card" />
        <span
          >Newest updates <br />
          directly to patients records</span
        >
      </div>
    </div>
    <!-- <h2 class="home-subheader font-bold">Ensuring the most relevant data is always at your fingertips</h2> -->
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
