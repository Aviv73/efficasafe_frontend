<template>
  <div class="container">
    <section class="entity-not-found">
        <h2 class="text-capitalize headline pb-4">{{ entity }} not found</h2>
        <img :src="errIconUrl" alt="Error sign icon" class="pb-2" />
        <p>It looks like you've got a broken link or {{ entity }} doesn't exists anymore</p>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    entity: {
      type: String,
      required: true,
    }
  },
  computed: {
    errIconUrl() {
        return require('@/assets/warning.svg');
    }
  }
};
</script>