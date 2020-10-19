<template>
  <section>
    <v-card class="icons-map">
      <v-card-title>Icons Map</v-card-title>
      <v-chip-group column class="icon-chips">
        <v-chip class="icon-chip text-capitalize" v-for="icon in icons" :key="icon.name">
          <v-avatar left size="16">
            <img
              class="icon-img"
              contain
              tile
              v-if="icon.path"
              :src="require(`@/assets/icons/${icon.name}.svg`)"
            />
            <v-icon v-else :color="icon.color">{{icon.mdi}}</v-icon>
          </v-avatar>
          {{icon.label}}
        </v-chip>
      </v-chip-group>
      <div class="margin-container"></div>
    </v-card>
  </section>
</template>

<script>
export default {
  name: "IconsMap",
  data() {
    return {
      iconSize: 100,
      icons: [
        {
          name: "drug",
          label: "drug",
          path: "@/assets/icons/drug",
          mdi: "",
          color: "",
        },
        {
          name: "herb",
          label: "herb",
          path: "@/assets/icons/herb",
          mdi: "",
          color: "",
        },
        {
          name: "atc",
          label: "ATC label",
          path: "@/assets/icons/atc",
          mdi: "",
          color: "",
        },
        {
          name: "other",
          label: "Other label",
          path: "@/assets/icons/other",
          mdi: "",
          color: "",
        },
        {
          name: "Active",
          label: "Active",
          path: "",
          mdi: "mdi-check-box-outline",
          color: "primary",
        },
        {
          name: "Not active",
          label: "Not active",
          path: "",
          mdi: "mdi-checkbox-blank-off-outline",
          color: "normal",
        },
      ],
    };
  },
};
</script>