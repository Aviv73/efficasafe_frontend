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
          <v-card-title class="interaction-edit-title">{{
            editedInteraction._id ? 'Edit Interaction' : 'New Interaction'
          }}</v-card-title>
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
          v-model="editedInteraction.side2DraftName"
          label="Draft Name"
        />
        <div class="int-rec-evi-row">
          <v-select
            :items="interaction.recommendation"
            label="Recommendation Options"
            v-model="interaction.recommendationSelected"
            @change="editedInteraction.recommendation = interaction.recommendationSelected"
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

        <h3>Summery:</h3>
        <ckeditor
          :config="CKEditorConfig"
          v-model="editedInteraction.summary"
        ></ckeditor>

        <h3>Review Of Studies:</h3>
        <ckeditor
          :config="CKEditorConfig"
          v-model="editedInteraction.reviewOfStudies"
        ></ckeditor>

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
          <a v-if="editedInteraction.side1Material" :href="`/material/${editedInteraction.side1Material._id}`" target="_blank">View Details</a>
        </div>

        <div class="side-link-container">
          <v-textarea
            type="text"
            rows="1"
            auto-grow
            v-model="editedInteraction.editorDraft.infoSide2"
            label="Side 2 info"
          />
          <a v-if="side2Id" :href="`/material/${side2Id}`" target="_blank">View Details</a>
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

        <reference-table
          :references="interactionRefs"
          v-if="interactionRefs.length"
        />
      </v-form>
      <div class="form-actions">
        <v-btn class="cancel-btn" to="/interaction/" color="normal"
          >cancel</v-btn
        >
        <v-btn
          class="submit-btn"
          @click="saveInteraction"
          color="success"
          :disabled="!isFormValid"
          >Save Interaction</v-btn>

      </div>
    </v-card>
  </section>
</template>

<script>
import { interactionService } from '@/services/interaction.service';
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
      },
      interactionRefs: [],
    };
  },
  computed: {
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
      return this.editedInteraction.side1Material &&
          (this.editedInteraction.side2Material || 
          this.editedInteraction.side2Label || 
          this.editedInteraction.side2DraftName);
    },
    side2Id() {
      if (this.editedInteraction.side2Material) return this.editedInteraction.side2Material._id;
      if (this.editedInteraction.side2Label) return this.editedInteraction.side2Label._id;
      return '';
    }
  },
  methods: {
    setInteractionSide(sides) {
      //// if draftName make custom label with them in an array ?
      //// else just make interactions as long as sides ?
      console.log('Sides:', sides);
    },
    async getReferences() {
      const matId = this.editedInteraction.side1Material._id;
      const material = await this.$store.dispatch({
        type: 'loadMaterial',
        matId,
      });
      this.interactionRefs = material.refs.filter((ref) =>
        this.editedInteraction.refs.includes(ref.draftIdx)
      );
    },
    removeSide() {
      this.editedInteraction.side1Material = null;
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
      if (this.interactionRefs.length) {
        this.editedInteraction.evidenceLevel = interactionService.calculateEvidenceLevel(this.interactionRefs);
      }
    },
    async saveInteraction() {
      /// if there is a custom label with children inside make an array of interactions
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
        this.$router.push('/interaction');
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