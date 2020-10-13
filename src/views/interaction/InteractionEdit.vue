<template>
  <section>
    <v-row justify="center">
      <confirm-delete-item
        :dialog="dialog"
        @remove-item-canceled="removeItemCanceled"
        @remove-item-confirmed="removeItemConfirmed"
      />
    </v-row>
    <v-card class="interaction-edit" v-if="editedInteraction">
      <v-form v-model="valid" @submit.prevent="saveInteraction">
        <div class="int-sides-active">
          <v-card-title
            class="interaction-edit-title"
          >{{editedInteraction._id? "Edit Interaction" : "New Interaction"}}</v-card-title>
          <div class="active-container">
            <label for="int-active">{{editedInteraction.isActive ? `Active` : `Not active`}}</label>
            <v-switch id="int-active" v-model="editedInteraction.isActive" />
          </div>
        </div>
        <interaction-sides
          :sides="sides"
          @updateSide1="updateSide1"
          @updateSide2="updateSide2"
          @removeSide1="removeSide1"
          @removeSide2="removeSide2"
        />
        <div class="int-rec-evi-row">
          <v-select
            :items="interaction.recommendation"
            label="Recommendation Options"
            v-model="interaction.recommendationSelected"
            @change="editedInteraction.recommendation = recommendationSelected"
          ></v-select>
          <v-select
            :items="interaction.evidenceLevel"
            label="Level of Evidence"
            v-model="editedInteraction.evidenceLevel"
          ></v-select>
        </div>
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.recommendation"
          label="Recommendation"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.note"
          label="Note"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.summary"
          label="Summary"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.reviewOfStudies.main"
          label="Review of studies main"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.reviewOfStudies.details"
          label="Review of studies details"
        />

        <div class="list-chips">
          <v-text-field
            v-model="model.indication"
            label="Indications"
            @keypress.enter.prevent="addIndication"
          />
          <v-chip-group column active-class="primary--text">
            <v-chip
              v-for="indication in editedInteraction.indications"
              :key="indication.id"
              close
              @click:close="removeItem('indication', indication.id)"
            >{{ indication.name }}</v-chip>
          </v-chip-group>
        </div>

        <v-textarea type="text" rows="1" auto-grow v-model="editedInteraction.draft" label="Draft" />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.editorDraft.infoSide1"
          label="Side 1 info"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.editorDraft.infoSide2"
          label="Side 2 info"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.editorDraft.general"
          label="General"
        />
        <!-- <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.editorDraft.gates"
          label="Gates"
        />-->

        <!-- ------------------ MISSING CRUD ARRAYS: Monitor (labTests, otherTests, symptoms) ------------------ -->
        <!-- ------------------ MISSING: references ------------------ -->
      </v-form>
      <div class="form-actions">
        <v-btn class="cancel-btn" to="/interaction/" color="normal">cancel</v-btn>
        <v-btn
          class="submit-btn"
          @click="saveInteraction"
          color="success"
          :disabled="!valid"
        >Save Interaction</v-btn>
      </div>
    </v-card>
  </section>
</template>

<script>
import { utilService } from "@/services/util.service";
import { interactionService } from "@/services/interaction.service";
import { eventBus, EV_addInteraction } from "@/services/eventBus.service";
import interactionSides from "@/cmps/interaction/edit/InteractionSides";
import confirmDeleteItem from "../../cmps/common/ConfirmDeleteItem";

export default {
  data() {
    return {
      editedInteraction: null,
      itemToRemove: null,
      valid: true,
      dialog: false,
      model: {
        indication: "",
      },
      interaction: {
        type: [
          {
            text: "Material - Material",
            value: "direct",
          },
          {
            text: "Material - Label",
            value: "indirect",
          },
        ],
        recommendationSelected: "",
        recommendation: [
          "Coadministration should be avoided",
          "Coadministration is not advised",
          "Caution should be taken",
          "Coadministration is not contraindicated but caution should be taken",
          "Coadministration is possible but caution should be taken",
          "Coadministration is not contraindicated",
          "Coadministration is possible",
          "Coadministration is advised",
        ],
        evidenceLevel: ["A", "B", "C", "D", "E", "F", "1", "2"],
      },
    };
  },
  computed: {
    // ColorOfRecommendation() {
    //   switch (this.editedInteraction.recommendation) {
    //     case "Coadministration should be avoided":
    //       return "#ffb4b4";
    //     case "Coadministration is not advised":
    //       return "#ffb4b4";
    //     case "Caution should be taken":
    //       return "#ffe6b4";
    //     case "Coadministration is not contraindicated but caution should be taken":
    //       return "#ffe6b4";
    //     case "Coadministration is possible but caution should be taken":
    //       return "#ffe6b4";
    //     case "Coadministration is not contraindicated":
    //       return "#b4ffb4";
    //     case "Coadministration is possible":
    //       return "#b4ffb4";
    //     case "Coadministration is advised":
    //       return "#b4ffb4";
    //     default:
    //       return "white";
    //   }
    // },
    sides() {
      const interaction = this.editedInteraction;
      return {
        side1: {
          material: interaction.side1MaterialId,
          label: interaction.side1LabelId,
          name: "side 1",
        },
        side2: {
          material: interaction.side2MaterialId,
          label: interaction.side2LabelId,
          name: "side 2",
        },
      };
    },
  },
  methods: {
    removeSide1() {
      this.editedInteraction.side1MaterialId = null;
      this.editedInteraction.side1LabelId = null;
    },
    removeSide2() {
      this.editedInteraction.side2MaterialId = null;
      this.editedInteraction.side2LabelId = null;
    },
    updateSide1(payload) {
      if (payload.isMaterial) {
        this.editedInteraction.side1MaterialId = payload.item;
      } else {
        this.editedInteraction.side1LabelId = payload.item;
      }
    },
    updateSide2(payload) {
      if (payload.isMaterial) {
        this.editedInteraction.side2MaterialId = payload.item;
      } else {
        this.editedInteraction.side2LabelId = payload.item;
      }
    },
    async loadInteraction() {
      try {
        const intId = this.$route.params.id;
        var interaction = null;
        if (intId) {
          interaction = await this.$store.dispatch({
            type: "loadInteraction",
            intId,
          });
        } else {
          interaction = interactionService.getEmptyInteraction();
        }
        this.editedInteraction = JSON.parse(JSON.stringify(interaction));
      } catch (err) {
        console.log("ERROR", err);
      }
    },
    async saveInteraction() {
      try {
        const interaction = JSON.parse(JSON.stringify(this.editedInteraction));
        await this.$store.dispatch({
          type: "saveInteraction",
          interaction,
        });
        eventBus.$emit(EV_addInteraction, {
          name: "",
          type: "interaction",
          _id: this.editedInteraction._id,
        });
        this.$router.push("/interaction");
      } catch (err) {
        console.log("Error:", err);
      }
    },
    addIndication() {
      if (!this.model.indication) return;

      const indications = this.model.indication.split(",");
      indications.forEach((indication) => {
        let newIndication = {
          id: utilService.makeId(10),
          name: indication,
        };
        this.editedInteraction.indications.push(newIndication);
      });

      this.model.indication = "";
    },
    removeIndication(indicationId) {
      const idx = this.editedInteraction.indications.findIndex(
        (currIndication) => currIndication.id === indicationId
      );
      if (idx !== -1) {
        this.editedInteraction.indications.splice(idx, 1);
      }
    },
    removeItem(type, id) {
      this.itemToRemove = {
        type,
        id,
      };
      this.dialog = true;
    },
    removeItemCanceled() {
      this.dialog = false;
      this.itemToRemove = null;
    },
    removeItemConfirmed() {
      if (this.itemToRemove.type === "indication") {
        this.removeIndication(this.itemToRemove.id);
        this.dialog = false;
        this.itemToRemove = null;
      }
    },
  },
  created() {
    this.loadInteraction();
  },
  components: {
    interactionSides,
    confirmDeleteItem,
  },
};
</script>