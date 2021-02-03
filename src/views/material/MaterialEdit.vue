<template>
  <section class="container">
      <confirm-delete-item
        :dialog="dialog"
        @remove-item-canceled="removeItemCanceled"
        @remove-item-confirmed="removeItemConfirmed"
      />
      <v-dialog v-model="refDialog" persistent max-width="600">
        <v-card>
          <v-card-title class="primary headline" style="color:white; font-weight:bold;">
            <v-icon dark left>mdi-plus-circle</v-icon>Add / Edit Reference
          </v-card-title>
          <v-form @submit.prevent="editRef" class="ref-form">
            <v-textarea
              type="text"
              rows="1"
              label="Text*"
              v-model="editedRef.txt"
              auto-grow
              required
              :rules="[(v) => !!v || 'Reference text is required']"
            />
            <v-select 
              type="text"
              label="Type*"
              :items="$options.refTypes"
              v-model="editedRef.type"
              clearable
              required
              :rules="[(v) => !!v || 'Reference type is required']"
            />
            <v-text-field 
              type="text"
              label="Link"
              v-model="editedRef.link"
              required
            />
            <v-text-field 
              type="text"
              label="Pubmed Id"
              v-model="editedRef.pubmedId"
            />
            <div class="ref-form-actions">
              <v-btn class="cancel-btn" @click="closeRefDialog" color="normal">cancel</v-btn>
              <v-btn
                type="submit"
                class="submit-btn"
                color="success"
                :disabled="!isRefValid"
              >Save Reference</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="pathwayDialog" persistent max-width="600">
        <v-card>
          <v-card-title class="primary headline" style="color:white; font-weight:bold;">
            <v-icon dark left>mdi-plus-circle</v-icon>Add / Edit Pathway
          </v-card-title>
          <v-form @submit.prevent="editPathway" class="pathway-form">
            <v-text-field 
              type="text"
              label="Enzyme*"
              v-model="editedPathway.enzyme"
              required
            />
            <h4>Influence</h4>
            <ckeditor
              v-model="editedPathway.influence"
              :config="CKEditorConfig"
            ></ckeditor>
            <v-text-field 
              type="text"
              label="References (provide space seperated values)"
              v-model="editedPathwayReferences"
            />
            <v-text-field 
              type="text"
              label="Full References (provide space seperated values)"
              v-model="editedPathwayFullReferences"
            />
            <div class="pathway-form-actions">
              <v-btn class="cancel-btn" @click="closePathwayDialog" color="normal">cancel</v-btn>
              <v-btn
                type="submit"
                class="submit-btn"
                color="success"
                :disabled="!isPathwayValid"
              >Save Pathway</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dBankRefDialog" persistent max-width="600">
        <d-bank-ref-edit
          :editedRef="editedDBankRef"
          @d-bank-ref-dialog-close="closeDBankRefDialog"
          @d-bank-ref-saved="saveDBankRef"
        />
      </v-dialog>
    <div>
      <v-card class="material-edit" v-if="editedMaterial" width="90%" max-width="1200">
        <v-form v-model="valid" @submit.prevent="saveMaterial">
          <v-text-field
            type="text"
            v-model="editedMaterial.name"
            label="Material name*"
            required
            :rules="[(v) => !!v || 'Material Name is required']"
          />

          <div class="side-by-side-row">
            <v-select
              class="mat-type"
              v-model="editedMaterial.type"
              :items="materialType"
              :rules="[(v) => !!v || 'Material type is required']"
              label="Type*"
              required
            ></v-select>
            
            <v-text-field
              type="text"
              v-model="editedMaterial.drugBankId"
              label="DrugBank ID"
            />
          </div>

           <div class="list-chips">
             <v-text-field
              type="text"
              v-model="model.atcIds"
              label="ATC Codes"
              @keypress.enter.prevent="addItemToArray('atcIds')"
            />
            <v-chip-group column>
                <v-chip
                  v-for="(atcId, idx) in editedMaterial.atcIds"
                  :key="idx"
                  close
                  @click:close="removeItem('atcIds', idx)"
                >
                {{ atcId }}
                </v-chip>
            </v-chip-group>
           </div>

          <h3>Description:</h3>
          <ckeditor
            v-model="editedMaterial.desc"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3 class="text-capitalize">DrugBank's description</h3>
          <ckeditor
            v-model="editedMaterial.dBankDesc"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3 class="text-capitalize">DrugBank's clinical description</h3>
          <ckeditor
            v-model="editedMaterial.dBankClinicalDesc"
            :config="CKEditorConfig"
          ></ckeditor>

          <v-text-field
            v-model="editedMaterial.botanicalFamily"
            label="Botanical Family"
          />

          <v-text-field
            v-model="editedMaterial.plantPartUsed"
            label="Plant Part Used"
          />

          <div class="list-chips">
            <v-text-field
              v-model="model.aliases"
              label="Aliases"
              @keypress.enter.prevent="addItemToArray('aliases')"
            />
            <v-chip-group column>
              <v-chip
                v-for="(alias, idx) in editedMaterial.aliases"
                :key="idx"
                close
                @click:close="removeItem('aliases', idx)"
                >{{ alias }}</v-chip
              >
            </v-chip-group>
          </div>

          <div class="list-chips">
            <v-text-field
              v-model="model.dBankAliases"
              label="DrugBank's Aliases"
              @keypress.enter.prevent="addItemToArray('dBankAliases')"
            />
            <v-chip-group column>
              <v-chip
                v-for="(alias, idx) in editedMaterial.dBankAliases"
                :key="idx"
                close
                @click:close="removeItem('dBankAliases', idx)"
                >{{ alias }}</v-chip
              >
            </v-chip-group>
          </div>

          <div class="list-chips">
            <v-text-field
              type="text"
              v-model="model.qualities"
              label="Qualities"
              @keypress.enter.prevent="addItemToArray('qualities')"
            />
            <v-chip-group column>
              <v-chip
                v-for="(quality, idx) in editedMaterial.qualities"
                :key="idx"
                close
                @click:close="removeItem('qualities', idx)"
                >{{ quality }}</v-chip
              >
            </v-chip-group>
          </div>

          <div class="list-chips">
            <v-text-field
              v-model="model.medicinalActions"
              label="Medicinal Actions"
              @keypress.enter.prevent="addItemToArray('medicinalActions')"
            />
            <v-chip-group column>
              <v-chip
                v-for="(action, idx) in editedMaterial.medicinalActions"
                :key="idx"
                close
                @click:close="removeItem('medicinalActions', idx)"
                >{{ action }}</v-chip
              >
            </v-chip-group>
          </div>

          <div class="list-chips">
            <v-text-field
              v-model="model.indications"
              label="Indications"
              @keypress.enter.prevent="addItemToArray('indications')"
            />
            <v-chip-group column>
              <v-chip
                v-for="(indication, idx) in editedMaterial.indications"
                :key="idx"
                close
                @click:close="removeItem('indications', idx)"
                >{{ indication }}</v-chip
              >
            </v-chip-group>
          </div>

          <div class="list-chips">
            <v-text-field
              v-model="model.dBankIndications"
              label="DrugBank's Indications"
              @keypress.enter.prevent="addItemToArray('dBankIndications')"
            />
            <v-chip-group column>
              <v-chip
                v-for="(indication, idx) in editedMaterial.dBankIndications"
                :key="idx"
                close
                @click:close="removeItem('dBankIndications', idx)"
                >{{ indication }}</v-chip
              >
            </v-chip-group>
          </div>

          <h3>Dosage:</h3>
          <ckeditor
            v-model="editedMaterial.dosage"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Sensitivities:</h3>
          <ckeditor
            v-model="editedMaterial.sensitivities"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Adverse Reactions:</h3>
          <ckeditor
            v-model="editedMaterial.adverseReactions"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Overdosage:</h3>
          <ckeditor
            v-model="editedMaterial.overdosage"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Precautions:</h3>
          <ckeditor
            v-model="editedMaterial.precautions"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Mechanism Of Action:</h3>
          <ckeditor
            v-model="editedMaterial.mechanismOfAction"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Contraindications:</h3>
          <ckeditor
            v-model="editedMaterial.contraindications"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Toxicity:</h3>
          <ckeditor
            v-model="editedMaterial.toxicity"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Pregnancy:</h3>
          <ckeditor
            v-model="editedMaterial.pregnancy"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Lactation:</h3>
          <ckeditor
            v-model="editedMaterial.lactation"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Effect on drug metabolism:</h3>
          <ckeditor
            v-model="editedMaterial.effectOnDrugMetabolism"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Detailed Pharmacology:</h3>
          <ckeditor
            v-model="editedMaterial.detailedPharmacology"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3>Active Constituents:</h3>
          <ckeditor
            v-model="editedMaterial.activeConstituents"
            :config="CKEditorConfig"
          ></ckeditor>

          <div class="list-chips">
            <autocomplete 
              placeholder="Search label"
              :isLabel="true"
              @emitAutocomplete="addObjToArray($event, 'labels')"
            />
            <v-chip-group column>
              <v-chip
                v-for="(label, idx) in editedMaterial.labels"
                :key="label._id"
                close
                @click:close="removeItem('labels', idx)"
              >
                {{ label.name }}
              </v-chip>
            </v-chip-group>
          </div>

          <h3 class="text-center mb-2">References</h3>
          <reference-table
            class="ref-table mb-6"
            :isEdit="true"
            @edit-ref="openRefDialog"
            :references="editedMaterial.refs"
          />
          
          <d-bank-refs-table 
            :refs="editedMaterial.dBankRefs"
            :isEdit="true"
            @edit-ref="openDBankRefDialog"
          />

          <div class="list-chips">
            <v-text-field
              v-model="model.brands"
              label="Brands"
              @keypress.enter.prevent="addItemToArray('brands')"
            />
            <v-chip-group column>
              <v-chip
                v-for="(brand, idx) in editedMaterial.brands"
                :key="idx"
                close
                @click:close="removeItem('brands', idx)"
                >{{ brand }}</v-chip
              >
            </v-chip-group>
          </div>

          <div class="list-chips">
            <v-text-field
              v-model="model.compounds"
              label="Compounds"
              @keypress.enter.prevent="addItemToArray('compounds')"
            />
            <v-chip-group column>
                <v-chip
                  v-for="(compound, idx) in editedMaterial.compounds"
                  :key="idx"
                  close
                @click:close="removeItem('compounds', idx)"
                >
                {{ compound }}
                </v-chip>
            </v-chip-group>
          </div>

          <div>
            <label for="mat-regions">Regions:</label>
            <regions-selector
              :regions="editedMaterial.regions"
              @updateRegions="updateRegions"
            />
          </div>
          
          <pathway-table 
            :items="editedMaterial.pathways"
            :isEdit="true"
            :isHerb="editedMaterial.type === 'herb'"
            @edit-pathway="openPathwayDialog"
          />
        </v-form>
        <div class="form-actions">
          <v-btn class="cancel-btn" to="/material/" color="normal">cancel</v-btn>
          <v-btn
            class="submit-btn"
            @click="saveMaterial"
            color="success"
            :disabled="!valid"
            >Save Material</v-btn>
        </div>
      </v-card>
    </div>
  </section>
</template>

<script>
import { materialService } from '@/services/material.service';
import { drugBankService } from '@/services/drug-bank.service';
import { eventBus, EV_addMaterial } from '@/services/eventBus.service';
import confirmDeleteItem from '@/cmps/common/ConfirmDeleteItem';
import referenceTable from '@/cmps/common/ReferenceTable';
import dBankRefsTable from '@/cmps/common/DBankRefsTable';
import dBankRefEdit from '@/cmps/common/DBankRefEdit';
import regionsSelector from '@/cmps/material/edit/RegionsSelector';
import autocomplete from '@/cmps/Autocomplete';
import pathwayTable from '@/cmps/common/PathwayTable';
import CKEditor from 'ckeditor4-vue';

export default {
  refTypes: [
    'clinical', 'meta', 'systematic', 'drug label', 'animal',
    'in vitro', 'retrospective', 'case', 'review'
  ],
  data() {
    return {
      editedMaterial: null,
      editedRef: materialService.getEmptyRef(),
      editedDBankRef: drugBankService.getEmptyRef(),
      editedPathway: materialService.getEmptyPathway(),
      editedPathwayIdx: undefined,
      valid: true,
      dialog: false,
      refDialog: false,
      dBankRefDialog: false,
      pathwayDialog: false,
      itemToRemove: null,
      CKEditorConfig: {
        extraPlugins: 'autogrow',
        autoGrow_minHeight: 50,
        removeButtons: ''
      },
      alerts: {
        success: false,
      },
      model: {
        labels: '',
        aliases: '',
        dBankAliases: '',
        brands: '',
        compounds: '',
        medicinalActions: '',
        indications: '',
        dBankIndications: '',
        qualities: '',
        atcIds: ''
      },
      materialType: [
        {
          text: 'Drug',
          value: 'drug',
        },
        {
          text: 'Herb',
          value: 'herb',
        },
        {
          text: 'Vitamin',
          value: 'vitamin'
        },
        {
          text: 'Amino acid',
          value: 'amino acid'
        },
        {
          text: 'Mineral',
          value: 'mineral'
        },
        {
          text: 'Nutraceutical',
          value: 'nutraceutical'
        },
        {
          text: 'Essential oil',
          value: 'essential oil'
        },
        {
          text: 'Food',
          value: 'food'
        }
      ],
    };
  },
  computed: {
    labels() {
      return this.$store.getters.labels;
    },
    isRefValid() {
      const { type, txt } = this.editedRef;
      return type && txt;
    },
    isPathwayValid() {
      const { enzyme } = this.editedPathway;
      return !!enzyme;
    },
    editedPathwayReferences: {
      get() {
        return this.editedPathway.references.join(' ');
      },
      set(val) {
        this.editedPathway.references = val.split(' ');
      }
    },
    editedPathwayFullReferences: {
      get() {
        return this.editedPathway.fullReferences.join(' ');
      },
      set(val) {
        this.editedPathway.fullReferences = val.split(' ');
      }
    }
  },
  methods: {
    saveDBankRef() {
      console.log(this.editedDBankRef);
    },
    openDBankRefDialog(ref) {
      if (ref) this.editedDBankRef = { ...ref };
      this.dBankRefDialog = true;
    },
    closeDBankRefDialog() {
      this.editedDBankRef = drugBankService.getEmptyRef();
      this.dBankRefDialog = false;
    },
    editPathway() {
      const isEdit = this.editedPathwayIdx !== undefined;
      if (isEdit) {
        this.editedMaterial.pathways.splice(this.editedPathwayIdx, 1, { ...this.editedPathway });
      } else {
        this.editedMaterial.pathways.push({ ...this.editedPathway });
      }
      this.closePathwayDialog();
    },
    openPathwayDialog(pathway, pathwayIdx) {
      if (pathway) {
        this.editedPathway = { ...pathway };
      }
      this.editedPathwayIdx = pathwayIdx;
      this.pathwayDialog = true;
    },
    closePathwayDialog() {
      this.editedPathway = materialService.getEmptyPathway();
      this.pathwayDialog = false;
    },
    editRef() {
      const isEdit = !!this.editedRef.draftIdx;
      if (!isEdit) {
        this.editedRef.draftIdx = this.editedMaterial.refs.length + 1;
        this.editedMaterial.refs.push({ ...this.editedRef });
      } else {
        const idx = this.editedMaterial.refs.findIndex(ref => ref.draftIdx === this.editedRef.draftIdx);
        this.editedMaterial.refs.splice(idx, 1, { ...this.editedRef });
      }
      this.closeRefDialog();
    },
    openRefDialog(ref) {
      if (ref) {
        this.editedRef = { ...ref };
      }
      this.refDialog = true;
    },
    closeRefDialog() {
      this.editedRef = materialService.getEmptyRef();
      this.refDialog = false;
    },
    async loadLabels() {
      this.$store.dispatch({ type: 'loadLabels' });
    },
    async loadMaterial() {
      const matId = this.$route.params.id;
      var material = null;
      if (matId) {
        material = await this.$store.dispatch({
          type: 'loadMaterial',
          matId,
        });
      } else {
        material = materialService.getEmptyMaterial();
      }
      this.editedMaterial = JSON.parse(JSON.stringify(material));
    },
    async saveMaterial() {
      if (!this.editedMaterial.name || !this.editedMaterial.type) return;
      try {
        await this.$store.dispatch({
          type: 'saveMaterial',
          material: this.editedMaterial,
        });
        eventBus.$emit(EV_addMaterial, {
          name: this.editedMaterial.name,
          type: 'material',
          _id: this.editedMaterial._id,
        });
      } catch (err) {
        console.log('Error:', err);
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
      this.removeItemFromArray(this.itemToRemove.id, this.itemToRemove.type);

      this.dialog = false;
      this.itemToRemove = null;
    },
    updateRegions(regions) {
      this.editedMaterial.regions = regions;
    },
    removeItemFromArray(itemIdx, arrName) {
      this.editedMaterial[arrName].splice(itemIdx, 1);
    },
    addItemToArray(arrName) {
      if (!this.model[arrName]) return;
      const items = this.model[arrName].split(',');
      items.forEach((item) => {
        this.editedMaterial[arrName].push(item.trim());
      });
      this.model[arrName] = '';
    },
    addObjToArray(obj, arrName) {
      if (!obj) return;
      const { _id, text } = obj;
      const label = {
        _id,
        name: text
      }
      const idx = this.editedMaterial[arrName].findIndex(currObj => currObj._id === label._id);
      if (idx === -1) {
        this.editedMaterial[arrName].push(label);
      }
    }
  },
  async created() {
    if (!this.labels)  {
      this.loadLabels();
    }
    this.loadMaterial();
  },
  components: {
    regionsSelector,
    referenceTable,
    dBankRefsTable,
    dBankRefEdit,
    confirmDeleteItem,
    autocomplete,
    pathwayTable,
    ckeditor: CKEditor.component
  },
};
</script>