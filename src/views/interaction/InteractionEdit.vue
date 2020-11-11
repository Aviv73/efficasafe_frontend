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
      <v-btn
        fab
        class="submit-btn floating-btn"
        large
        elevation="5"
        @click="onSaveInteraction(false)"
        color="success"
        title="Save Interaction"
        :disabled="!isFormValid"
      >
        <v-icon>mdi-content-save-edit</v-icon>
      </v-btn>
      <v-form v-model="valid" @submit.prevent="onSaveInteraction(true)">
        <div class="int-sides-active">
          <v-card-title class="interaction-edit-title">
            {{ editedInteraction._id ? 'Edit Interaction' : 'New Interaction' }}
          </v-card-title>
          <div class="active-container">
            <label for="int-active">
              {{ editedInteraction.isActive ? `Active` : `Not active` }}
            </label>
            <v-switch id="int-active" v-model="editedInteraction.isActive" />
          </div>
        </div>
        <interaction-sides
          :sides="sides"
          @update-side="updateSide"
          @remove-side="removeSide"
          @side2-picked="setInteractionSide"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          class="draft-input"
          v-model="draftName"
          :label="editedInteraction.side2Label ? 'Draft Name*' : 'Draft Name'"
        />
        <div class="int-rec-evi-row">
          <v-select
            :items="interaction.recommendation"
            label="Recommendation Options"
            v-model="interaction.recommendationSelected"
            @change="
              editedInteraction.recommendation =
                interaction.recommendationSelected
            "
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
          label="Recommandation"
        />

        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.note"
          label="Note"
        />

        <h3>
          Summary:
          <v-btn 
            @click="handleRefsChange" 
            depressed 
            color="warning" 
            :disabled="isRefsChanged('summary')"
          >Update Refs</v-btn>
        </h3>
        <ckeditor
          :config="CKEditorConfig"
          v-model="editedInteraction.summary"
        ></ckeditor>
        <v-btn
          v-if="side1MaterialRefs.length"
          color="blue-grey"
          class="ref-table-btn ma-2 white--text"
          @click="refsTableDialog = true"
        >
          Upload References
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>

        <h3>
          Review Of Studies:
          <v-btn 
            @click="handleRefsChange" 
            depressed 
            color="warning" 
            :disabled="isRefsChanged('reviewOfStudies')"
          >Update Refs</v-btn>
        </h3>
        <ckeditor
          :config="CKEditorConfig"
          v-model="editedInteraction.reviewOfStudies"
        ></ckeditor>
        <v-btn
          v-if="side1MaterialRefs.length"
          color="blue-grey"
          class="ref-table-btn ma-2 white--text"
          @click="refsTableDialog = true"
        >
          Upload References
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>

        <div class="list-chips">
          <v-text-field
            v-model="model.indications"
            label="Indications"
            @keypress.enter.prevent="addItemToArray('indications')"
          />
          <v-chip-group column>
            <v-chip
              v-for="(indication, idx) in editedInteraction.indications"
              :key="idx"
              close
              @click:close="removeItem('indications', idx)"
              >{{ indication }}</v-chip
            >
          </v-chip-group>
        </div>

        <div class="side-link-container">
          <v-textarea
            type="text"
            rows="1"
            auto-grow
            v-model="editedInteraction.editorDraft.infoSide1"
            label="Side 1 info"
          />
          <router-link
            v-if="editedInteraction.side1Material"
            :to="`/material/${editedInteraction.side1Material._id}`"
            target="_blank"
            >View Details</router-link
          >
        </div>

        <div class="side-link-container">
          <v-textarea
            type="text"
            rows="1"
            auto-grow
            v-model="editedInteraction.editorDraft.infoSide2"
            label="Side 2 info"
          />
          <router-link
            v-if="side2Id"
            :to="`/material/${side2Id}`"
            target="_blank"
            >View Details</router-link
          >
        </div>

        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.editorDraft.general"
          label="General"
        />

        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.monitor.labTests"
          label="Lab Tests"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.monitor.otherTests"
          label="Other Tests"
        />
        <v-textarea
          type="text"
          rows="1"
          auto-grow
          v-model="editedInteraction.monitor.symptoms"
          label="Symptoms"
        />
      </v-form>
      <div class="form-actions">
        <v-btn class="cancel-btn" to="/interaction/" color="normal"
          >cancel</v-btn
        >
        <v-btn
          class="submit-btn"
          @click="onSaveInteraction(true)"
          color="success"
          :disabled="!isFormValid"
          >Save Interaction</v-btn
        >
      </div>
    </v-card>
    <v-dialog max-width="1400px" v-model="refsTableDialog">
      <reference-table
        :references="interactionRefs"
        :isInteraction="true"
        v-if="interactionRefs.length"
      />
    </v-dialog>
  </section>
</template>

<script>
import { interactionService } from '@/services/interaction.service';
import { labelService } from '@/services/label.service';
import { eventBus, EV_addInteraction } from '@/services/eventBus.service';
import interactionSides from '@/cmps/interaction/edit/InteractionSides';
import referenceTable from '@/cmps/common/ReferenceTable';
import confirmDeleteItem from '@/cmps/common/ConfirmDeleteItem';
import CKEditor from 'ckeditor4-vue';

export default {
  data() {
    return {
      editedInteraction: null,
      itemToRemove: null,
      valid: true,
      dialog: false,
      refsTableDialog: false,
      relatedMaterials: [],
      model: {
        indications: '',
        labTests: '',
        otherTests: '',
        symptoms: '',
      },
      interaction: {
        recommendationSelected: '',
        recommendation: [
          'Coadministration should be avoided',
          'Coadministration is not advised',
          'Caution should be taken',
          'Coadministration is not contraindicated but caution should be taken',
          'Coadministration is possible but caution should be taken',
          'Coadministration is not contraindicated',
          'Coadministration is possible',
          'Coadministration is advised',
        ],
        evidenceLevel: ['A', 'B', 'C', 'D', 'E', 'F', '1', '2'],
      },
      CKEditorConfig: {
        extraPlugins: 'autogrow',
        autoGrow_minHeight: 50,
        removeButtons: '',
      },
      side1MaterialRefs: [],
      interactionRefs: []
    };
  },
  watch: {
    'editedInteraction.side1Material'() {
      if (this.editedInteraction.side1Material) {
        this.getReferences();
      }
    }
  },
  computed: {
    interactions() {
      return this.$store.getters.interactions;
    },
    unsavedInteraction() {
      return this.$store.getters.interaction(this.$route.params.id);
    },
    draftName: {
      get() {
        return this.editedInteraction.side2DraftName;
      },
      set(val) {
        this.editedInteraction.side2DraftName = val;
        if (this.editedInteraction.side2Label) {
          this.editedInteraction.side2Label.name = val;
        }
      },
    },
    sides() {
      const interaction = this.editedInteraction;
      return {
        side1: {
          material: interaction.side1Material,
          name: 'side 1',
        },
        side2: {
          material: interaction.side2Material,
          label: interaction.side2Label,
          name: 'side 2',
        },
      };
    },
    isFormValid() {
      return (
        this.editedInteraction.side1Material &&
        (this.editedInteraction.side2Material ||
          (this.editedInteraction.side2Label &&
            this.editedInteraction.side2DraftName) ||
          this.editedInteraction.side2DraftName)
      );
    },
    side2Id() {
      if (this.editedInteraction.side2Material)
        return this.editedInteraction.side2Material._id;
      if (this.editedInteraction.side2Label)
        return this.editedInteraction.side2Label._id;
      return '';
    },
  },
  methods: {
    isRefsChanged(property) {
      if (!this.unsavedInteraction) return false;
      return this.editedInteraction[property] === this.unsavedInteraction[property];
    },
    handleRefsChange() {
      this.setInteractionRefs();
      this.makeRefsSub();
    },
    makeRefsSub() {
      const regex = /\(([\d- ,\d]+)\)|<sub>\(([\d- ,\d]+)\)<\/sub>/g;
      const summaryMatches = this.editedInteraction.summary.match(regex);
      const reviewOfStudiesMatches = this.editedInteraction.reviewOfStudies.match(regex);

      if (summaryMatches) {
        summaryMatches.forEach((match) => {
          const strToDisplay = `<sub>${interactionService.formatRefStrs(match)}</sub>`;
          this.editedInteraction.summary = this.editedInteraction.summary.replaceAll(
            match,
            strToDisplay
          );
        });
      }
      if (reviewOfStudiesMatches) {
        reviewOfStudiesMatches.forEach((match) => {
          const strToDisplay = `<sub>${interactionService.formatRefStrs(match)}</sub>`;
          this.editedInteraction.reviewOfStudies = this.editedInteraction.reviewOfStudies.replaceAll(
            match,
            strToDisplay
          );
        });
      }
    },
    setInteractionRefs() {
      const txt = `${this.editedInteraction.summary} ${this.editedInteraction.reviewOfStudies}`;
      const sortedRefs = interactionService.getSortedRefs(
        txt,
        this.side1MaterialRefs
      );
      this.interactionRefs = sortedRefs;
      this.editedInteraction.refs = sortedRefs.map(ref => ref.draftIdx);
    },
    setInteractionSide(sides) {
      if (sides.length === 1) {
        const { _id, name, type } = sides[0];
        this.editedInteraction.side2Material = {
          _id,
          name,
          type,
        };
      } else {
        this.relatedMaterials = sides;
        this.editedInteraction.side2Label = {
          name: this.editedInteraction.side2DraftName,
        };
      }
    },
    async getReferences() {
      const matId = this.editedInteraction.side1Material._id;
      const material = await this.$store.dispatch({
        type: 'loadMaterial',
        matId,
      });
      this.side1MaterialRefs = [ ...material.refs ];
      this.setInteractionRefs();
      this.makeRefsSub();
    },
    removeSide(sideNum) {
      let side = `side${sideNum}Material`;
      if (this.editedInteraction.side2Label && sideNum === 2) {
        side = 'side2Label';
      }
      this.editedInteraction[side] = null;
    },
    updateSide(payload) {
      this.editedInteraction.side1Material = payload;
    },
    async loadInteraction() {
      try {
        const intId = this.$route.params.id;
        if (intId) {
          var interaction = await this.$store.dispatch({
            type: 'loadInteraction',
            intId,
          });
          this.editedInteraction = JSON.parse(JSON.stringify(interaction));
          await this.getReferences();
          this.calculateEvidenceLevel();
        } else {
          this.editedInteraction = interactionService.getEmptyInteraction();
        }
      } catch (err) {
        console.log('ERROR', err);
      }
    },
    calculateEvidenceLevel() {
      if (this.side1MaterialRefs.length) {
        this.editedInteraction.evidenceLevel = interactionService.calculateEvidenceLevel(
          this.side1MaterialRefs
        );
      }
    },
    async onSaveInteraction(isRouteChange) {
      const { side2Label } = this.editedInteraction;
      if (!this.editedInteraction.side2Material && side2Label) {
        if (!side2Label._id) {
          var newLabel = labelService.getEmptyLabel();
          newLabel.name = `${this.editedInteraction.side1Material.name} & ${this.editedInteraction.side2Label.name}`;
        } else {
          /// it's edit -> then it's a different code (no need to get empty and name is allready right)
          /// (maybe allways take second part of label name from side2DraftName)
          /// need to check materials related against this.relatedMaterials
        }

        try {
          // const savedLabel = await this.$store.dispatch({ type: 'saveLabel', label: newLabel });
          // const relatedMaterialIds = this.relatedMaterials.map(mat => mat._id);
          // /// update this.relatedMaterials labels with minimal label obj with _id
          // console.log(savedLabel, relatedMaterialIds);
          /// add the interaction with side2Label minimal obj with _id
        } catch (err) {
          console.log('Error:', err);
        }
      } else {
        this.saveInteraction(isRouteChange);
      }
    },
    async saveInteraction(isRouteChange) {
      try {
        const interaction = JSON.parse(JSON.stringify(this.editedInteraction));
        await this.$store.dispatch({
          type: 'saveInteraction',
          interaction,
        });
        eventBus.$emit(EV_addInteraction, {
          name: '',
          type: 'interaction',
          _id: this.editedInteraction._id,
        });
        if (isRouteChange) this.$router.push('/interaction');
      } catch (err) {
        console.log('Error:', err);
      }
    },
    addItemToArray(arrName) {
      if (!this.model[arrName]) return;

      const items = this.model[arrName].split(',');
      items.forEach((item) => {
        this.editedInteraction[arrName].push(item.trim());
      });
      this.model[arrName] = '';
    },
    removeItemFromArray(arrName, itemIdx) {
      this.editedInteraction[arrName].splice(itemIdx, 1);
    },
    removeItem(arrName, idx) {
      this.itemToRemove = {
        arrName,
        idx,
      };
      this.dialog = true;
    },
    removeItemCanceled() {
      this.dialog = false;
      this.itemToRemove = null;
    },
    removeItemConfirmed() {
      this.removeItemFromArray(
        this.itemToRemove.arrName,
        this.itemToRemove.idx
      );
      this.dialog = false;
      this.itemToRemove = null;
    },
  },
  created() {
    this.loadInteraction();
  },
  components: {
    interactionSides,
    confirmDeleteItem,
    referenceTable,
    ckeditor: CKEditor.component,
  },
};
</script>