<template>
  <section class="container">
      <v-app-bar-nav-icon class="drawer-btn" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- <v-app-bar-nav-icon class="drawer-btn" @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-navigation-drawer
        v-if="editedMaterial"
        fixed
        bottom
        v-model="drawer"
        hide-overlay
      >
        <v-list nav dense>
        <v-subheader></v-subheader>
          <v-list-item-group
            color="primary"
          >
            <v-app-bar-nav-icon class="drawer-btn" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-subheader class="mt-8">Navigation <v-btn class="ml-4" @click="isShowEmptyLink = !isShowEmptyLink">{{showEmptyLinkTxt}}</v-btn> </v-subheader>
            <v-list-item v-if="editedMaterial.desc || isShowEmptyLink" @click="goto('Description')">Description</v-list-item>
            <v-list-item v-if="editedMaterial.dBankDesc || isShowEmptyLink" @click="goto('DBDescription')">DB Description</v-list-item>
            <v-list-item v-if="editedMaterial.dBankClinicalDesc || isShowEmptyLink" @click="goto('DrugBanks clinical description')">DrugBank's clinical description</v-list-item>
            <v-list-item v-if="editedMaterial.aliases.length || isShowEmptyLink" @click="goto('aliases')">Aliases</v-list-item>
            <v-list-item v-if="editedMaterial.dBankAliases.length || isShowEmptyLink" @click="goto('dBankAliases')">dBankAliases</v-list-item>
            <v-list-item v-if="editedMaterial.nutritionalSources || isShowEmptyLink" @click="goto('supp Nutritional sources')">supp Nutritional sources</v-list-item>
            <v-list-item v-if="editedMaterial.otherCharacteristics || isShowEmptyLink" @click="goto('supp Other characteristics')">supp Other characteristics</v-list-item>
            <v-list-item v-if="editedMaterial.activeConstituents || isShowEmptyLink" @click="goto('Active Constituents')">Active Constituents</v-list-item>
            <v-list-item v-if="editedMaterial.absorptionAndExcretion || isShowEmptyLink" @click="goto('supp Absorption and excretion')">supp Absorption and excretion</v-list-item>
            <v-list-item v-if="editedMaterial.causesOfDeficiency || isShowEmptyLink" @click="goto('supp Causes of deficiency')">supp Causes of deficiency</v-list-item>
            <v-list-item v-if="editedMaterial.symptomsOfDeficiency || isShowEmptyLink" @click="goto('supp Symptoms of deficiency')">supp Symptoms of deficiency</v-list-item>
            <v-list-item v-if="editedMaterial.dosage || isShowEmptyLink" @click="goto('Dosage')">Dosage</v-list-item>
            <v-list-item v-if="editedMaterial.ODA || isShowEmptyLink" @click="goto('supp ODA (Optimal Daily Allowance)')">supp ODA (Optimal Daily Allowance)</v-list-item>
            <v-list-item v-if="editedMaterial.RDA || isShowEmptyLink" @click="goto('supp RDA (Recommended Daily Allowance)')">supp RDA (Recommended Daily Allowance)</v-list-item>
            <v-list-item v-if="editedMaterial.sensitivities || isShowEmptyLink" @click="goto('Sensitivities')">Sensitivities</v-list-item>
            <v-list-item v-if="editedMaterial.adverseReactions || isShowEmptyLink" @click="goto('Adverse Reactions')">Adverse Reactions</v-list-item>
            <v-list-item v-if="editedMaterial.overdosage || isShowEmptyLink" @click="goto('Overdosage')">Overdosage</v-list-item>
            <v-list-item v-if="editedMaterial.precautions || isShowEmptyLink" @click="goto('Precautions')">Precautions</v-list-item>
            <v-list-item v-if="editedMaterial.contraindications || isShowEmptyLink" @click="goto('Contraindications')">Contraindications</v-list-item>
            <v-list-item v-if="editedMaterial.toxicity || isShowEmptyLink" @click="goto('Toxicity')">Toxicity</v-list-item>
            <v-list-item v-if="editedMaterial.pregnancy || isShowEmptyLink" @click="goto('Pregnancy')">Pregnancy</v-list-item>
            <v-list-item v-if="editedMaterial.lactation || isShowEmptyLink" @click="goto('Lactation')">Lactation</v-list-item>
            <v-list-group :value="false">
              <template v-slot:activator>
                <v-list-item-title>Pharmacology</v-list-item-title>
              </template>
            <v-list-item v-if="editedMaterial.pharmacology.indication || isShowEmptyLink" @click="goto('Indication')">Indication</v-list-item>
            <v-list-item v-if="editedMaterial.pharmacology.pharmacodynamics || isShowEmptyLink" @click="goto('Pharmacodynamics')">Pharmacodynamics</v-list-item>
            <v-list-item v-if="editedMaterial.pharmacology.mechanismOfAction || isShowEmptyLink" @click="goto('Mechanism Of Action2')">Mechanism Of Action</v-list-item>
            <v-list-item v-if="editedMaterial.pharmacology.absorption || isShowEmptyLink" @click="goto('Absorption')">Absorption</v-list-item>
            <v-list-item v-if="editedMaterial.pharmacology.toxicity || isShowEmptyLink" @click="goto('Toxicity2')">Toxicity</v-list-item>
            <v-list-item v-if="editedMaterial.pharmacology.proteinBinding || isShowEmptyLink" @click="goto('Protein Binding')">Protein Binding</v-list-item>
            <v-list-item v-if="editedMaterial.pharmacology.metabolism || isShowEmptyLink" @click="goto('Metabolism')">Metabolism</v-list-item>
            <v-list-item v-if="editedMaterial.pharmacology.halfLife || isShowEmptyLink" @click="goto('Half Life')">Half Life</v-list-item>
            <v-list-item v-if="editedMaterial.pharmacology.routeOfElimination || isShowEmptyLink" @click="goto('Route Of Elimination')">Route Of Elimination</v-list-item>
            <v-list-item v-if="editedMaterial.pharmacology.volumeOfDistribution || isShowEmptyLink" @click="goto('Volume Of Distribution')">Volume Of Distribution</v-list-item>
            <v-list-item v-if="editedMaterial.pharmacology.clearance || isShowEmptyLink" @click="goto('Clearance')">Clearance</v-list-item>
            </v-list-group>
            <v-list-item v-if="editedMaterial.structuredAdverseEffects.length || isShowEmptyLink" @click="goto('Structured Adverse Effects')">Structured Adverse Effects</v-list-item>
            <v-list-item v-if="editedMaterial.mechanismOfAction || isShowEmptyLink" @click="goto('Mechanism Of Action')">Mechanism Of Action</v-list-item>
            <v-list-item v-if="editedMaterial.effectOnDrugMetabolism || isShowEmptyLink" @click="goto('Effect on drug metabolism')">Effect on drug metabolism</v-list-item>
            <v-list-item v-if="editedMaterial.detailedPharmacology || isShowEmptyLink" @click="goto('Detailed Pharmacology')">Detailed Pharmacology</v-list-item>
            <v-list-item v-if="editedMaterial.labels.length || isShowEmptyLink" @click="goto('Labels')">Labels</v-list-item>
            <v-list-item v-if="editedMaterial.refs.length || isShowEmptyLink" @click="goto('References')">References</v-list-item>
            <v-list-item v-if="editedMaterial.brands.length || isShowEmptyLink" @click="goto('Brands')">Brands</v-list-item>
            <v-list-item v-if="editedMaterial.compounds.length || isShowEmptyLink" @click="goto('Compounds')">Compounds</v-list-item>
            <v-list-item v-if="editedMaterial.pathways.length || isShowEmptyLink" @click="goto('Pathways')">Pathways</v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>      
      <confirm-delete-item
        :dialog="dialog"
        @remove-item-canceled="removeItemCanceled"
        @remove-item-confirmed="removeItemConfirmed"
      />
      <v-dialog v-model="refDeleteAllDialog" persistent max-width="600">
        <v-card class="delete-ref-dialog" width="600" height="200">
          <v-card-title class="primary headline" style="color:white; font-weight:bold;">
            Are you sure you want to delete this all ref?
          </v-card-title>
          <p>Deleting all refs can lead to bugs if not done carefully</p>
          <div class="btn-container" style="margin-left: 0">
            <v-btn class="cancel-btn" @click="closeDeleteAllRefDialog" color="normal">cancel</v-btn>
            <v-btn class="cancel-btn" @click="deleteAllRef" color="error">delete all</v-btn>
          </div>
        </v-card>
      </v-dialog>
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
              label="Type"
              :items="$options.refTypes"
              v-model="editedRef.type"
              clearable
              required
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
              <v-btn class="cancel-btn" @click="openDeleteRefDialog" color="error" v-if="isAdmin">delete reference</v-btn>
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
        <v-card v-if="refDeleteDialog" class="delete-ref-dialog" width="550" height="250">
          <v-card-title class="primary headline" style="color:white; font-weight:bold; width: 100%;">
            Are you sure you want to delete this ref?
          </v-card-title>
          <p>deletenig a ref without clearing it from all other interactions can lead to bugs</p>
          <div class="btn-container">
            <v-btn class="cancel-btn" @click="closeDeleteRefDialog" color="normal">cancel</v-btn>
            <v-btn class="cancel-btn" @click="deleteRef" color="error">delete</v-btn>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="pathwayDialog" class="pathway-dialog" persistent max-width="600">
        <v-card>
          <v-card-title class="primary headline" style="color:white; font-weight:bold;">
            <v-icon dark left>mdi-plus-circle</v-icon>Add / Edit Pathway
            <v-spacer />
            <v-btn 
              icon
              dark
              @click="closePathwayDialog"
            >
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-form @submit.prevent="editPathway" class="pathway-form">
            <v-text-field 
              type="text"
              label="Name*"
              v-model="editedPathway.name"
              required
              :rules="[(v) => !!v || 'Pathway name is required']"
            />
            <v-select
              label="Type"
              v-model="editedPathway.type"
              :items="$options.pathwayTypes"
            />
            <v-select
              label="Actions"
              v-model="editedPathway.actions"
              :items="$options.pathwayActions"
              multiple
            />
            <v-text-field 
              type="text"
              label="Full Name"
              v-model="editedPathway.fullName"
            />
            <h4>Influence</h4>
            <ckeditor
              v-model="editedPathway.influence"
              :config="CKEditorConfig"
            ></ckeditor>
            <v-text-field 
              type="text"
              label="References (provide double underscore ('__') seperated values)"
              v-model="editedPathwayReferences"
            />
            <v-textarea
              type="text"
              label="Full References (provide double underscore ('__') seperated values)"
              v-model="editedPathwayFullReferences"
            />
            <div class="pathway-form-actions">
              <v-btn class="cancel-btn" @click="closePathwayDialog" color="normal">cancel</v-btn>
              <v-btn class="cancel-btn" @click="openDeletePathwayDialog" color="error">Delete Pathway</v-btn>
              <v-btn
                type="submit"
                class="submit-btn"
                color="success"
                :disabled="!isPathwayValid"
              >Save Pathway</v-btn>
            </div>
          </v-form>
        </v-card>
        <v-card v-if="pathwayDeleteDialog" class="delete-pathway-dialog" width="550" height="200">
          <v-card-title class="primary headline" style="color:white; font-weight:bold; width: 100%;">
            Are you sure you want to delete this pathway?
          </v-card-title>
          <div class="btn-container">
            <v-btn class="cancel-btn" @click="closeDeletePathwayDialog" color="normal">cancel</v-btn>
            <v-btn class="cancel-btn" @click="deletePathway" color="error">delete</v-btn>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dBankRefDialog" persistent max-width="600">
        <d-bank-ref-edit
          :editedRef="editedDBankRef"
          @d-bank-ref-dialog-close="closeDBankRefDialog"
          @d-bank-ref-saved="saveDBankRef"
        />
      </v-dialog>
      <v-dialog v-model="externalLinksDialog" persistent max-width="600">
        <v-card>
          <v-card-title class="primary headline" style="color:white; font-weight:bold;">
            <v-icon dark left>mdi-plus-circle</v-icon>Add / Edit External link
            <v-spacer />
            <v-btn
              icon
              dark
              @click="closeExternalLinkDialog"
            >
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-form class="pa-6" @submit.prevent="saveExternalLink">
            <v-text-field
              type="text"
              label="Resource"
              v-model="editedExternalLink.resource"
              required
              :rules="[(v) => !!v || 'Resource is required']"
            />
            <v-text-field
              type="text"
              label="Resource"
              v-model="editedExternalLink.url"
              required
              :rules="[(v) => !!v || 'URL is required']"
            />
            <div class="mt-6 d-flex justify-center align-center">
              <v-btn class="cancel-btn mr-2" @click="closeExternalLinkDialog" color="normal">cancel</v-btn>
              <v-btn
                type="submit"
                class="submit-btn ml-2"
                color="success"
              >Save</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-dialog>
    <div>
      <v-card class="material-edit" v-if="editedMaterial" width="90%" max-width="1200">
        <v-btn
          fab
          elevation="5"
          class="floating-btn submit-btn"
          color="success"
          title="Save Material"
          :disabled="!valid"
          @click="saveMaterial"
        >
          <v-icon>mdi-content-save-edit</v-icon>
        </v-btn>
        <v-btn
          fab
          elevation="5"
          class="floating-btn up-btn"
          color="warning"
          title="Save Material"
          :disabled="!valid"
          @click="goto('top')"
        >
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
        <v-form ref="top" v-model="valid" @submit.prevent="saveMaterial">
          <v-text-field
            type="text"
            v-model="editedMaterial.name"
            label="Material name*"
            required
            :rules="[(v) => !!v || 'Material Name is required']"
          />

          <div class="multi-row">
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
          

            <v-checkbox
              class="mx-auto"
              label="Is Narrow Therapeutic"
              v-model="editedMaterial.isNarrowTherapeutic"
            />
            <v-checkbox
              label="Is Under Construction"
              v-model="editedMaterial.isUnderStudy"
            />
            <v-checkbox
              label="Show Material Page"
              v-model="editedMaterial.isShowPage"
            />
          </div>
            <v-btn
              class="mx-auto"
              style="width: fit-content"
              small
              outlined
              text
              :color="editedMaterial.drugBankId ? 'error' : 'success'"
              @click="generateFDBId"
            >
              Generate FDB 
            </v-btn>
          <v-text-field
            v-model="editedMaterial.fdaLabel"
            label="FDA Label"
          />

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

          <h3 ref="Description">Description:</h3>
          <ckeditor
            v-model="editedMaterial.desc"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3 ref="DBDescription" class="text-capitalize">DrugBank's description</h3>
          <ckeditor
            v-model="editedMaterial.dBankDesc"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3 ref="DrugBanks clinical description" class="text-capitalize">DrugBank's clinical description</h3>
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

          <div ref="aliases" class="list-chips">
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

          <div ref="dBankAliases" class="list-chips">
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
                @click:close="removeItem('dBankAliases', idx, false)"
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
                @click:close="removeItem('qualities', idx, false)"
                >{{ quality }}</v-chip
              >
            </v-chip-group>
          </div>
          <h4 ref="supp Nutritional sources">supp Nutritional sources:</h4>
          <ckeditor
            v-model="editedMaterial.nutritionalSources"
            :config="CKEditorConfig"
          />
          <h4 ref="supp Other characteristics">supp Other characteristics:</h4>
          <ckeditor
            v-model="editedMaterial.otherCharacteristics"
            :config="CKEditorConfig"
          />
          <h3 ref="Active Constituents">Active Constituents:</h3>
          <ckeditor
            v-model="editedMaterial.activeConstituents"
            :config="CKEditorConfig"
          ></ckeditor>
          <h4 ref="supp Absorption and excretion">supp Absorption and excretion:</h4>
          <ckeditor
            v-model="editedMaterial.absorptionAndExcretion"
            :config="CKEditorConfig"
          />
          <h4 ref="supp Causes of deficiency">supp Causes of deficiency:</h4>
          <ckeditor
            v-model="editedMaterial.causesOfDeficiency"
            :config="CKEditorConfig"
          />
          <h4 ref="supp Symptoms of deficiency">supp Symptoms of deficiency:</h4>
          <ckeditor
            v-model="editedMaterial.symptomsOfDeficiency"
            :config="CKEditorConfig"
          />
          <h3 ref="Dosage">Dosage:</h3>
          <ckeditor
            v-model="editedMaterial.dosage"
            :config="CKEditorConfig"
          ></ckeditor>
          <h4 ref="supp ODA (Optimal Daily Allowance)">supp ODA (Optimal Daily Allowance):</h4>
          <ckeditor
            v-model="editedMaterial.ODA"
            :config="CKEditorConfig"
          />
          <h4 ref="supp RDA (Recommended Daily Allowance)">supp RDA (Recommended Daily Allowance):</h4>
          <ckeditor
            v-model="editedMaterial.RDA"
            :config="CKEditorConfig"
          />
          <h3 ref="Sensitivities">Sensitivities:</h3>
          <ckeditor
            v-model="editedMaterial.sensitivities"
            :config="CKEditorConfig"
          ></ckeditor>
          <h3 ref="Adverse Reactions">Adverse Reactions:</h3>
          <ckeditor
            v-model="editedMaterial.adverseReactions"
            :config="CKEditorConfig"
          ></ckeditor>
          <h3 ref="Overdosage">Overdosage:</h3>
          <ckeditor
            v-model="editedMaterial.overdosage"
            :config="CKEditorConfig"
          ></ckeditor>
          <h3 ref="Precautions">Precautions:</h3>
          <ckeditor
            v-model="editedMaterial.precautions"
            :config="CKEditorConfig"
          ></ckeditor>
          <h3 ref="Contraindications">Contraindications:</h3>
          <ckeditor
            v-model="editedMaterial.contraindications"
            :config="CKEditorConfig"
          ></ckeditor>
          <h3 ref="Toxicity">Toxicity:</h3>
          <ckeditor
            v-model="editedMaterial.toxicity"
            :config="CKEditorConfig"
          ></ckeditor>
          <h3 ref="Pregnancy">Pregnancy:</h3>
          <ckeditor
            v-model="editedMaterial.pregnancy"
            :config="CKEditorConfig"
          ></ckeditor>
          <h3 ref="Lactation">Lactation:</h3>
          <ckeditor
            v-model="editedMaterial.lactation"
            :config="CKEditorConfig"
          ></ckeditor><h3 ref="Pharmacology">Pharmacology:</h3>
          <h4 ref="Indication">Indication:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.indication"
            :config="CKEditorConfig"
          />
          <h4 ref="Pharmacodynamics">Pharmacodynamics:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.pharmacodynamics"
            :config="CKEditorConfig"
          />
          <h4 ref="Mechanism Of Action2">Mechanism Of Action:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.mechanismOfAction"
            :config="CKEditorConfig"
          />
          <h4 ref="Absorption">Absorption:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.absorption"
            :config="CKEditorConfig"
          />
          <h4 ref="Toxicity2">Toxicity:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.toxicity"
            :config="CKEditorConfig"
          />
          <h4 ref="Protein Binding">Protein Binding:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.proteinBinding"
            :config="CKEditorConfig"
          />
          <h4 ref="Metabolism">Metabolism:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.metabolism"
            :config="CKEditorConfig"
          />
          <h4 ref="Half Life">Half Life:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.halfLife"
            :config="CKEditorConfig"
          />
          <h4 ref="Route Of Elimination">Route Of Elimination:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.routeOfElimination"
            :config="CKEditorConfig"
          />
          <h4 ref="Volume Of Distribution">Volume Of Distribution:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.volumeOfDistribution"
            :config="CKEditorConfig"
          />
          <h4 ref="Clearance">Clearance:</h4>
          <ckeditor
            v-model="editedMaterial.pharmacology.clearance"
            :config="CKEditorConfig"
          />
          <div  ref="Structured Adverse Effects" class="list-chips">
            <v-text-field
              v-model="model.structuredAdverseEffects"
              label="Structured Adverse Effects"
              @keypress.enter.prevent="addItemToArray('structuredAdverseEffects')"
            />
            <v-chip-group column>
              <v-chip
                v-for="(effect, idx) in editedMaterial.structuredAdverseEffects"
                :key="idx"
                close
                @click:close="removeItem('structuredAdverseEffects', idx, false)"
              >
              {{ effect }}
              </v-chip>
          </v-chip-group>
          </div>
          
          <h3 ref="Mechanism Of Action">Mechanism Of Action:</h3>
          <ckeditor
            v-model="editedMaterial.mechanismOfAction"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3 ref="Effect on drug metabolism">Effect on drug metabolism:</h3>
          <ckeditor
            v-model="editedMaterial.effectOnDrugMetabolism"
            :config="CKEditorConfig"
          ></ckeditor>

          <h3 ref="Detailed Pharmacology">Detailed Pharmacology:</h3>
          <ckeditor
            v-model="editedMaterial.detailedPharmacology"
            :config="CKEditorConfig"
          ></ckeditor>
          <div ref="Labels" class="list-chips">
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

          <h3 ref="References" class="text-center mb-2">References</h3>
          <reference-table
            class="ref-table mb-6"
            :isEdit="true"
            @edit-ref="openRefDialog"
            :references="editedMaterial.refs"
            :name="editedMaterial.name"
            @refs-uploaded="addRefs"
          />

          <v-btn class="mb-10" color="error" width="200" @click="openDeleteAllRefDialog" v-if="isAdmin">DELETE ALL references</v-btn>
          
          <d-bank-refs-table 
            :refs="editedMaterial.dBankRefs"
            :name="editedMaterial.name"
            :isEdit="true"
            @edit-ref="openDBankRefDialog"
          />

          <div ref="Brands" class="list-chips">
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
                @click:close="removeItem('brands', idx, false)"
                >{{ brand }}</v-chip
              >
            </v-chip-group>
          </div>
          <h3 ref="Compounds" class="text-center mb-2">Compounds</h3>
          <v-expansion-panels flat>
            <v-expansion-panel>
              <v-expansion-panel-header class="pa-0 my-6">
                <h5 class="text-lg-left font-weight-bold">Compounds:</h5>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
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
                        @click:close="removeItem('compounds', idx, false)"
                      >
                      {{ compound }}
                      </v-chip>
                  </v-chip-group>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <div>
            <label for="mat-regions">Regions:</label>
            <regions-selector
              :regions="editedMaterial.regions"
              @updateRegions="updateRegions"
            />
          </div>
          
          <h3 ref="Pathways" class="text-center mb-2">Pathways</h3>
          <pathway-table 
            :items="editedMaterial.pathways"
            :isEdit="true"
            :isHerb="editedMaterial.type === 'herb'"
            @edit-pathway="openPathwayDialog"
          />
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
              label="Indications (medicinal uses array)"
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

          <h3>Medicinal uses TEXT:</h3>
          <ckeditor
            v-model="editedMaterial.medicinalUsesTxt"
            :config="CKEditorConfig"
          ></ckeditor>

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
                @click:close="removeItem('dBankIndications', idx, false)"
                >{{ indication }}</v-chip
              >
            </v-chip-group>
          </div>



          <v-expansion-panels flat class="external-links mt-8">
            <v-expansion-panel>
              <v-expansion-panel-header class="pa-0">
                <h5 class="text-lg-left font-weight-bold">External Links:</h5>
                <v-btn
                  class="flex-grow-0 mr-4"
                  title="Add External Link"
                  icon
                  @click.stop="openExternalLinksDialog"
                >
                  <v-icon>mdi-plus-circle</v-icon>
                </v-btn>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list subheader two-line>
                  <v-list-item
                    v-for="(link, idx) in editedMaterial.externalLinks"
                    :key="idx"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ link.resource }}</v-list-item-title>
                      <v-list-item-subtitle>
                        <a :href="link.url" target="_blank">{{ link.url }}</a>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action class="external-links-actions">
                      <v-btn 
                        title="Edit"
                        icon
                        @click="openExternalLinksDialog(link, idx)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn 
                        title="Delete"
                        icon
                        @click="removeExternalLink(idx)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-divider />

          <div class="list-chips">
            <v-text-field
              v-model="model.dBankCategories"
              label="DrugBank's Categories"
              @keypress.enter.prevent="addItemToArray('dBankCategories')"
            />
            <v-list>
              <v-list-item
                class="list-item"
                v-for="(category, idx) in editedMaterial.dBankCategories"
                :key="idx"
              >
                <v-list-item-content>{{ category }}</v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    icon
                    @click="removeItem('dBankCategories', idx, false)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>

          <div class="list-chips">
            <v-text-field
              v-model="model.structuredContraIndications"
              label="Structured Contra Indications"
              @keypress.enter.prevent="addItemToArray('structuredContraIndications')"
            />
            <v-chip-group column>
              <v-chip
                v-for="(indication, idx) in editedMaterial.structuredContraIndications"
                :key="idx"
                close
                @click:close="removeItem('structuredContraIndications', idx, false)"
              >
              {{ indication }}
              </v-chip>
          </v-chip-group>
          </div>
          <div class="list-chips">
            <v-text-field
              v-model="model.foodInteractions"
              label="Food Interactions"
              @keypress.enter.prevent="addItemToArray('foodInteractions')"
            />
            <v-list>
              <v-list-item
                class="list-item"
                v-for="(interaction, idx) in editedMaterial.foodInteractions"
                :key="idx"
              >
                <v-list-item-content>{{ interaction }}</v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    icon
                    @click="removeItem('foodInteractions', idx, false)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>
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
import { materialService } from '@/cms/services/material.service';
import { drugBankService } from '@/cms/services/drug-bank.service';
import { eventBus, EV_addMaterial } from '@/cms/services/eventBus.service';
import confirmDeleteItem from '@/cms/cmps/common/ConfirmDeleteItem';
import referenceTable from '@/cms/cmps/common/ReferenceTable';
import dBankRefsTable from '@/cms/cmps/common/DBankRefsTable';
import dBankRefEdit from '@/cms/cmps/common/DBankRefEdit';
import regionsSelector from '@/cms/cmps/material/edit/RegionsSelector';
import autocomplete from '@/cms/cmps/Autocomplete';
import pathwayTable from '@/cms/cmps/common/PathwayTable';
import CKEditor from 'ckeditor4-vue';

export default {
  refTypes: [
    'clinical', 'meta', 'systematic', 'drug label', 'animal',
    'in vitro', 'retrospective', 'case', 'review'
  ],
  pathwayTypes: [ 'enzyme', 'transporter', 'carrier', '' ],
  pathwayActions: [ 'substrate', 'inhibitor', 'inducer', 'no effect' ],
  data() {
    return {
      isShowEmptyLink: false,
      editedMaterial: null,
      editedRef: materialService.getEmptyRef(),
      editedDBankRef: drugBankService.getEmptyRef(),
      editedPathway: materialService.getEmptyPathway(),
      editedPathwayIdx: undefined,
      valid: true,
      dialog: false,
      refDialog: false,
      refDeleteDialog: false,
      refDeleteAllDialog: false,
      pathwayDeleteDialog: false,
      dBankRefDialog: false,
      pathwayDialog: false,
      externalLinksDialog: false,
      drawer: false,
      editedExternalLink: {
        resource: '',
        url: ''
      },
      editedExternalLinkIdx: 0,
      itemToRemove: null,
      CKEditorConfig: {
        height: 400,
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
        dBankCategories: '',
        qualities: '',
        atcIds: '',
        structuredAdverseEffects: '',
        structuredContraIndications: '',
        foodInteractions: ''
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
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    isAdmin() {
      return this.loggedInUser ? this.loggedInUser.role === 'admin' : false;
    },
    labels() {
      return this.$store.getters.labels;
    },
    isRefValid() {
      return this.editedRef.txt;
    },
    isPathwayValid() {
      const { name } = this.editedPathway;
      return !!name;
    },
    editedPathwayReferences: {
      get() {
        return this.editedPathway.references.join('__');
      },
      set(val) {
        this.editedPathway.references = val.split('__');
      }
    },
    editedPathwayFullReferences: {
      get() {
        return this.editedPathway.fullReferences.join('__');
      },
      set(val) {
        this.editedPathway.fullReferences = val.split('__');
      }
    },
    showEmptyLinkTxt(){
      if(this.isShowEmptyLink) return 'Hide empty'
      return 'Show Empty'
    }
  },
  methods: {
    generateFDBId(){
      const id = `FDB${Date.now()}`
      this.editedMaterial.drugBankId = id
    },
    addRefs(refs) {
      if (!this.editedMaterial.refs.length) this.editedMaterial.refs = refs;
      else {
          let lastDraftIdx = this.editedMaterial.refs.length;
          refs.forEach(ref => {
            ref.draftIdx = ++lastDraftIdx;
          });
          this.editedMaterial.refs = this.editedMaterial.refs.concat(refs);
      }
    },
    saveDBankRef() {
      const isEdit = !!this.editedDBankRef.draftIdx;
      if (isEdit) {
        const idx = this.editedMaterial.dBankRefs.findIndex(ref => ref.draftIdx === this.editedDBankRef.draftIdx);
        this.editedMaterial.dBankRefs.splice(idx, 1, { ...this.editedDBankRef });
      } else {
        this.editedDBankRef.draftIdx = this.editedMaterial.dBankRefs.length + 1;
        this.editedMaterial.dBankRefs.push({ ...this.editedDBankRef });
      }
      this.closeDBankRefDialog();
    },
    removeExternalLink(idx) {
      this.editedMaterial.externalLinks.splice(idx, 1);
    },
    saveExternalLink() {
      if (this.editedExternalLinkIdx) {
        this.editedMaterial.externalLinks.splice(this.editedExternalLinkIdx, 1, { ...this.editedExternalLink });
      } else {
        this.editedMaterial.externalLinks.push({ ...this.editedExternalLink });
      }
      this.closeExternalLinkDialog();
    },
    openExternalLinksDialog(externalLink, idx) {
      if (externalLink) {
        this.editedExternalLink = { ...externalLink };
        this.editedExternalLinkIdx = idx;
      } else {
        this.editedExternalLink = { resource: '', url: '' };
        this.editedExternalLinkIdx = 0;
      }
      this.externalLinksDialog = true;
    },
    closeExternalLinkDialog() {
      this.editedExternalLink = { resource: '', url: '' };
      this.editedExternalLinkIdx = 0;
      this.externalLinksDialog = false;
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
      this.setPathwayRefs();
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
    deleteRef(){
      const idx = this.editedMaterial.refs.findIndex(ref => ref.draftIdx === this.editedRef.draftIdx)
      this.editedMaterial.refs.splice(idx,1)
      this.closeRefDialog()
      this.closeDeleteRefDialog()
    },
    deleteAllRef(){
      this.editedMaterial.refs = []
      this.closeDeleteAllRefDialog()
    },
    openDeleteRefDialog(){
      this.refDeleteDialog = true
    },
    closeDeleteRefDialog(){
      this.refDeleteDialog = false
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
    openDeleteAllRefDialog(){
      this.refDeleteAllDialog = true
    },
    closeDeleteAllRefDialog(){
      this.refDeleteAllDialog = false
    },
    openDeletePathwayDialog(){
      this.pathwayDeleteDialog = true
    },
    closeDeletePathwayDialog(){
      this.pathwayDeleteDialog = false
    },
    deletePathway(){
      this.closeDeletePathwayDialog()
      this.closePathwayDialog()
      this.editedMaterial.pathways.splice(this.editedPathwayIdx, 1)
      this.editedPathwayIdx = undefined
    },
    async loadLabels() {
      this.$store.dispatch({ type: 'loadLabels' });
    },
    setPathwayRefs() {
      const { pathways } = this.editedMaterial;
      let nextIdx = 1;
      this.editedMaterial.pathwayRefs = pathways.reduce((acc, pathway) => {
        pathway.references.forEach((reference, idx) => {
          const isValidUrl = (typeof reference === 'string' && reference.startsWith('http'));
          const ref = {
            draftIdx: nextIdx++,
            type: '',
            txt: pathway.fullReferences[idx],
            link: (isValidUrl) ? reference : `https://pubmed.ncbi.nlm.nih.gov/${reference}`,
            pubmedId: (isValidUrl) ? 0 : +reference
          }
          acc.push(ref);
        });
        return acc;
      }, []);
    },
    async loadMaterial() {
      const matId = this.$route.params.id;
      let material = null;
      if (matId) {
        material = await this.$store.dispatch({
          type: 'loadMaterial',
          matId,
        });
      } else {
        material = materialService.getEmptyMaterial();
      }
      this.editedMaterial = material;
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
    removeItem(type, id, openDialog = true) {
      this.itemToRemove = {
        type,
        id,
      };
      if (openDialog) this.dialog = true;
      else this.removeItemConfirmed();
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
    },
    goto(refName) {
      var element = this.$refs[refName];
      var top = element.offsetTop;

      window.scrollTo(0, top);
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