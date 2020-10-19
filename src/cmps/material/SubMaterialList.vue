<template>
  <section class="sub-material-list" v-if="subMats.length">
    <div class="list-container" v-for="subMat in subMats" :key="subMat._id">
      <router-link class="item-preview" :to="`/material/${subMat._id}`">{{ subMat.name }}</router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: "subMaterialList",
  props: {
    subMats: Array
  }
};
</script>