<template>
  <section>
    <h1>GROUP EDIT</h1>

    <div v-if="!isMaterialSide1">
      <autocomplete
        v-if="materials"
        :items="materials"
        @emitAutocomplete="emitSelect"
        searchName="material"
      />
    </div>
    <div v-if="materialSide1">
      <v-chip class="ma-2 side-container" color="primary" label text-color="white">
        <v-avatar left>
          <v-img class="side-type-img" :src="materialType" :alt="materialSide1.type" />
        </v-avatar>
        {{materialSide1.name}}
      </v-chip>
      <interaction-edit-form
        :materialSide1="materialSide1"
        :materials="materials"
        :labels="labels"
        :frame="emptyInteraction"
      />
    </div>

    <!-- <pre>isMaterialSide1? {{isMaterialSide1}}</pre>
    <pre v-if="materialSide1 && isMaterialSide1">
      {{materialSide1}}
    </pre>-->

    <!-- Display MaterialSide1 -->
    <!-- CREATE Interactions -->
  </section>
</template>

<script>
import autocomplete from "@/cmps/Autocomplete";
import interactionEditForm from "@/cmps/interaction/edit/InteractionEditForm";
import { interactionService } from "@/services/interaction.service";

export default {
  data() {
    return {
      isMaterialSide1: true,
      materialSide1: null,
      interactionGroup: [],
      emptyInteraction: null,
    };
  },
  computed: {
    materials() {
      return this.$store.getters.materials;
    },
    labels() {
      return this.$store.getters.labels;
    },
    materialType() {
      return require(`@/assets/icons/${this.materialSide1.type}.svg`);
    },
  },
  methods: {
    async loadMaterialSide1() {
      const matId = this.$route.params.id;
      if (matId) {
        const material = await this.$store.dispatch({
          type: "loadMaterial",
          matId,
        });
        this.materialSide1 = JSON.parse(JSON.stringify(material));
      } else {
        // await this.loadMaterials();
        this.isMaterialSide1 = false;
      }
    },
    async loadMaterials() {
      this.$store.dispatch({ type: "loadMaterials" });
    },
    async loadLabels() {
      await this.$store.dispatch({ type: "loadLabels" });
    },
    async emitSelect(value) {
      const matId = value._id;
      const material = await this.$store.dispatch({
        type: "loadMaterial",
        matId,
      });
      this.materialSide1 = JSON.parse(JSON.stringify(material));
      this.isMaterialSide1 = true;

      // Another option is to push the new route with the mat id and use a watcher: loadMaterialSide1()
    },
    getEmptyInteraction() {
      const interaction = interactionService.getEmptyInteraction();
      this.emptyInteraction = JSON.parse(JSON.stringify(interaction));
    },
  },
  created() {
    this.loadMaterialSide1();
    this.loadMaterials();
    this.loadLabels();
    this.getEmptyInteraction();
  },
  components: {
    autocomplete,
    interactionEditForm,
  },
};
</script>