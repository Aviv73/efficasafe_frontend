<template>
  <section>
    <v-row justify="center">
      <confirm-delete-item
        :dialog="dialog"
        @remove-item-canceled="removeItemCanceled"
        @remove-item-confirmed="removeItemConfirmed"
      />
    </v-row>
    <div class="interaction-edit-container" :class="{ 'portal-active': isPortalActive }">
      <section class="interaction-edit" v-if="editedInteraction">
        <v-card width="90%" max-width="1200">
          <div class="floating-btns">
            <v-btn
              fab
              class="warning-btn"
              @click="handleRefsChange"
              elevation="5"
              color="warning"
              title="Update References"
              :disabled="isRefsChanged('summary') && isRefsChanged('reviewOfStudies')"
            >
              <v-icon>mdi-table-refresh</v-icon>
            </v-btn>
            <v-btn
              fab
              class="submit-btn"
              elevation="5"
              @click="onSaveInteraction(false)"
              color="success"
              title="Save Interaction"
              :disabled="!isFormValid"
            >
            <v-icon>mdi-content-save-edit</v-icon>
            </v-btn>
          </div>
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
              @show-label="showLabelDialog"
              :editedInteraction="editedInteraction"
            />
            <v-textarea
              type="text"
              rows="1"
              auto-grow
              class="draft-input"
              v-model="draftName"
              :disabled="editedInteraction._id && (!!editedInteraction.side2Label && !!editedInteraction.side2Label._id)"
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
            </h3>
            <ckeditor
              :config="CKEditorConfig"
              v-model="editedInteraction.summary"
            ></ckeditor>

            <h3>
              Review Of Studies:
            </h3>
            <ckeditor
              :config="CKEditorConfig"
              v-model="editedInteraction.reviewOfStudies"
            ></ckeditor>
            <v-btn
              :disabled="!interactionRefs.length"
              color="blue-grey"
              class="ref-table-btn ma-2 white--text"
              @click="showRefsTable"
            >
              Show References
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
              <v-btn
                class="details-btn"
                x-small
                depressed
                v-if="editedInteraction.side1Material"
                @click="showSideDetails(editedInteraction.side1Material._id)"
              >
                Show Details
              </v-btn>
            </div>

            <div class="side-link-container">
              <v-textarea
                type="text"
                rows="1"
                auto-grow
                v-model="editedInteraction.editorDraft.infoSide2"
                label="Side 2 info"
              />
              <v-btn
                class="details-btn"
                x-small
                depressed
                v-if="editedInteraction.side2Material && editedInteraction.side2Material._id"
                @click="showSideDetails(editedInteraction.side2Material._id)"
              >
                Show Details
              </v-btn>
              <v-btn
                class="details-btn icon"
                icon
                title="View label's materials"
                v-if="editedInteraction.side2Label && editedInteraction.side2Label._id"
                @click="showLabelDialog"
              >
                <v-icon color="primary">mdi-eye</v-icon>
            </v-btn>
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
        <v-dialog
          v-model="isLabelDialogActive"
          max-width="1400"
          >
          <label-peek
            v-if="editedInteraction.side2Label && editedInteraction.side2Label._id" 
            :labelId="editedInteraction.side2Label._id" 
            @close-label-dialog="isLabelDialogActive = false" 
            @view-material="showLabelMatDetails"
          />
        </v-dialog>
      </section>
    <v-card class="portal-container">
      <div class="table-container">
        <aside>
          <header>
            <v-btn icon @click="closePortal" class="close-portal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </header>
          <transition name="fade">
            <reference-table
                class="reference-table-shrink"
                :references="interactionRefs"
                :isInteraction="true"
                :isShrinked="true"
                v-if="refsTableActive"
            />
            <side-details
              :id="viewedSideId"
              v-if="sideDetailsActive"
            />
          </transition>
        </aside>
      </div>
    </v-card>
  </div>
</section>
</template>

<script>
import { interactionService } from '@/services/interaction.service';
import { labelService } from '@/services/label.service';
import { eventBus, EV_addInteraction } from '@/services/eventBus.service';
import interactionSides from '@/cmps/interaction/edit/InteractionSides';
import referenceTable from '@/cmps/common/ReferenceTable';
import confirmDeleteItem from '@/cmps/common/ConfirmDeleteItem';
import sideDetails from '@/cmps/interaction/edit/SideDetails';
import labelPeek from '@/cmps/interaction/edit/LabelPeek';
import CKEditor from 'ckeditor4-vue';

export default {
  data() {
    return {
      editedInteraction: null,
      itemToRemove: null,
      valid: true,
      dialog: false,
      isPortalActive: false,
      refsTableActive: false,
      sideDetailsActive: false,
      isLabelDialogActive: false,
      viewedSideId: '',
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
          'Avoid coadministration',
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
      } else this.interactionRefs = [];
    }
  },
  computed: {
    interactions() {
      return this.$store.getters.interactions;
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
      }
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
    }
  },
  methods: {
    showLabelMatDetails(material) {
      this.showSideDetails(material._id);
      this.isLabelDialogActive = false;
    },
    showLabelDialog() {
      this.isLabelDialogActive = true;
    },
    closePortal() {
      this.isPortalActive = false;
      this.sideDetailsActive = false;
      this.refsTableActive = false;
    },
    showSideDetails(id) {
      this.isPortalActive = true;
      this.refsTableActive = false;
      this.sideDetailsActive = true;
      this.viewedSideId = id;
    },
    showRefsTable() {
      this.isPortalActive = true;
      this.refsTableActive = true;
      this.sideDetailsActive = false;
    },
    isRefsChanged(property) {
      const refsOrder = interactionService.getRefsOrder(this.editedInteraction[property]);
      return !refsOrder.length;
    },
    handleRefsChange() {
      this.setInteractionRefs();
      this.makeRefsSub();
      this.calculateEvidenceLevel();
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
      this.editedInteraction.refs = sortedRefs.map(ref => ref && ref.draftIdx);
    },
    setInteractionSide(sidesData) {
      const { materials, primaryMaterialIds } = sidesData;
      if (materials.length === 1) {
        this.editedInteraction.side2Label = null;
        const { _id, name, type } = materials[0];
        this.editedInteraction.side2Material = {
          _id,
          name,
          type
        };
      } else {
        this.editedInteraction.side2Material = null;
        this.relatedMaterials = materials;
        this.editedInteraction.side2Label = labelService.getEmptyLabel();
        this.editedInteraction.side2Label.name = this.editedInteraction.side2DraftName;
        this.editedInteraction.side2Label.primaryMaterialIds = [ ...primaryMaterialIds ];
      }
    },
    async getReferences() {
      const matId = this.editedInteraction.side1Material._id;
      const material = await this.$store.dispatch({
        type: 'loadMaterial',
        matId,
      });
      this.side1MaterialRefs = [ ...material.refs ];
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
        } else {
          this.editedInteraction = interactionService.getEmptyInteraction();
        }
      } catch (err) {
        console.log('ERROR', err);
      }
    },
    calculateEvidenceLevel() {
      if (this.interactionRefs.length) {
        this.editedInteraction.evidenceLevel = interactionService.calculateEvidenceLevel(
          this.interactionRefs
        );
      }
    },
    async onSaveInteraction(isRouteChange) {
      const { side2Label } = this.editedInteraction;
      if (!this.editedInteraction.side2Material && side2Label && !side2Label._id) {
        this.editedInteraction.side2Label.name = `${this.editedInteraction.side1Material.name} & ${this.editedInteraction.side2DraftName}`;
        try {
          const savedLabel = await this.$store.dispatch({ type: 'saveLabel', label: this.editedInteraction.side2Label });
          const relatedMaterialIds = this.relatedMaterials.map(mat => mat._id);
          const data = {
            ids: relatedMaterialIds,
            label: savedLabel
          }
          await this.$store.dispatch({ type: 'updateMaterials', data });
          this.editedInteraction.side2Label = savedLabel;
          this.saveInteraction(isRouteChange);
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
        if (interaction.side1Material && (interaction.side2Material || interaction.side2Label)) {
          interaction.isActive = true;
        }
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
    async getRelatedMaterials() {
      if (this.editedInteraction.side2Label) {
        const criteria = { labelId: this.editedInteraction.side2Label._id };
        const materials = await this.$store.dispatch({ type: 'getMaterials', criteria });
        this.relatedMaterials = materials;
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
    }
  },
  async created() {
    await this.loadInteraction();
    if (this.editedInteraction.side1Material) {
      this.setInteractionRefs();
      this.calculateEvidenceLevel();
    }
    this.getRelatedMaterials();
  },
  components: {
    interactionSides,
    confirmDeleteItem,
    referenceTable,
    sideDetails,
    labelPeek,
    ckeditor: CKEditor.component,
  },
};
</script>