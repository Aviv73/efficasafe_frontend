<template>
  <section class="label-details container" v-if="label">
    <confirm-delete
      v-model="dialog"
      type="Label"
      :dialog="dialog"
      @delete-confirm="removeLabel"
      @delete-cancel="dialog = false"
    />
    <div class="action-container">
      <v-btn color="primary" to="/label">
        <v-icon small left>mdi-arrow-left</v-icon>Back to Labels
      </v-btn>
      <v-btn color="primary" :to="{path:'/interaction',query:{label:`${label._id}`}}">
        <v-icon small left>mdi-view-list</v-icon>Interactions
      </v-btn>
      <v-btn color="primary" :to="{path:'/material',query:{label:`${label._id}`}}">
        <v-icon small left>mdi-view-list</v-icon>Related Materials
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" :to="`/label/edit/${label._id}`">
        <v-icon small left>mdi-pencil</v-icon>Edit
      </v-btn>
      <v-btn color="error" v-if="label.src !== 'atc'" @click="displayDialog">
        <v-icon small left>mdi-delete</v-icon>Delete
      </v-btn>
    </div>
    <v-card class="info-container">
      <v-card-title class="label-details-title">{{label.name}}</v-card-title>

      <span class="info-title">Label Color:</span>
      <div class="color-circle" :style="{ backgroundColor: label.color}"></div>

      <span class="info-title">Source:</span>
      <span class="info-value">{{label.src}}</span>

      <span class="info-title">ATC code:</span>
      <span class="info-value">{{label.atc}}</span>

      <span class="info-title">Parent label:</span>
      <router-link
        v-if="label.parentLabel"
        :to="`/label/${label.parentLabel._id}`"
      >{{label.parentLabel.name}}</router-link>
    </v-card>
    <icons-map />
  </section>
</template>

<script>
import confirmDelete from "@/cmps/general/ConfirmDelete";
import iconsMap from "@/cmps/general/IconsMap";

export default {
  data() {
    return {
      label: null,
      dialog: false,
    };
  },
  watch: {
    "$route.params.id": function () {
      this.loadLabel();
    },
  },
  computed: {
    labels() {
      return this.$store.getters.labels;
    },
  },
  methods: {
    async loadLabel() {
      const labelId = this.$route.params.id;
      if (labelId) {
        const label = await this.$store.dispatch({
          type: "loadLabel",
          labelId,
        });
        this.label = label;
      }
    },
    async removeLabel() {
      if (this.label.src === "atc") return;

      const label = JSON.parse(JSON.stringify(this.label));
      const labelId = label._id;
      const saveToArchive = this.$store.dispatch({
        type: "saveLabelToArchive",
        label,
      });
      const removeLabel = this.$store.dispatch({
        type: "removeLabel",
        labelId,
      });
      Promise.all([saveToArchive, removeLabel]).then(() => {
        this.$router.push("/label");
      });
    },
    displayDialog() {
      this.dialog = true;
    },
  },
  created() {
    this.loadLabel();
  },
  components: {
    confirmDelete,
    iconsMap,
  },
};
</script>