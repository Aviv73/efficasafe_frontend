<template>
  <section class="regions-selector">
    <v-switch label="US" v-model="isRegions.us" @change="updateRegions" />
    <v-switch label="CA" v-model="isRegions.ca" @change="updateRegions" />
    <v-switch label="EU" v-model="isRegions.eu" @change="updateRegions" />
  </section>
</template>

<script>
export default {
  name: "regionsSelector",
  props: {
    regions: Array,
  },
  data() {
    return {
      isRegions: {
        us: false,
        ca: false,
        eu: false,
      },
    };
  },
  methods: {
    updateRegions() {
      const newRegions = [];
      for (const region in this.isRegions) {
        if (this.isRegions[region]) {
          newRegions.push(region);
        }
      }
      this.$emit("updateRegions", JSON.parse(JSON.stringify(newRegions)));
    },
    updateIsRegions() {
      for (const key in this.isRegions) {
        this.isRegions[key] = false;
      }

      this.regions.forEach((region) => {
        this.isRegions[region] = true;
      });
    },
  },
  created() {
    this.updateIsRegions();
  },
};
</script>