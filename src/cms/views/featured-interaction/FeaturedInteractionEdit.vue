<template>
  <section class="featured-interaction-edit">
      <div class="container">
            <main v-if="!isLoading && editedInteraction">
                <v-card class="px-4 pt-4">
                    <v-form 
                        v-model="valid"
                        @submit.prevent="saveInteraction"
                    >
                        <header class="mb-8">
                            <v-card-title class="pa-0">
                                Edit interaction
                            </v-card-title>
                            <figure>
                                <figcaption class="caption text-center mb-1">powered by</figcaption>
                                <img :src="require(`@/cms/assets/drugbank.png`)" alt="DrugBank logo" />
                            </figure>
                            <div class="featured-interaction-edit-switch">
                                <v-switch
                                    class="ma-0"
                                    v-model="editedInteraction.isActive"
                                    :label="editedInteraction.isActive ? 'Active' : 'Not active'"
                                    hide-details
                                />
                            </div>
                        </header>
                        <div class="featured-interaction-edit-sides my-8">
                            <div class="featured-interaction-edit-sides-side">
                                <v-btn
                                    color="primary"
                                    @click="sideActive = 1;materialPickerDialog = true"
                                >
                                    Pick side 1
                                </v-btn>
                            </div>
                            <h6 class="text-h6 text-center">
                                {{ `${editedInteraction.subject_drug.name} & ${editedInteraction.affected_drug.name}` }}
                            </h6>
                            <div class="featured-interaction-edit-sides-side">
                                <v-btn
                                    color="primary"
                                    @click="sideActive = 2;materialPickerDialog = true"
                                >
                                    Pick side 2
                                </v-btn>
                            </div>
                        </div>
                        <v-text-field
                            v-model="editedInteraction.recommendation"
                            type="text"
                            label="Recommendation*"
                            required
                            :rules="[(v) => !!v || 'Recommendation is required']"
                        />
                        <v-text-field
                            v-model="editedInteraction.severity"
                            type="text"
                            label="Severity*"
                            required
                            :rules="[(v) => !!v || 'Severity is required']"
                        />
                        <v-text-field
                            v-model="editedInteraction.evidence_level"
                            type="text"
                            label="Level of evidence*"
                            required
                            :rules="[(v) => !!v || 'Level of evidence is required']"
                        />
                        <v-text-field
                            v-model="editedInteraction.summary"
                            type="text"
                            label="Summary*"
                            required
                            :rules="[(v) => !!v || 'Summary is required']"
                        />
                        <h3 class="text-capitalize mt-4">Extended description*:</h3>
                        <ckeditor
                            :config="CKEditorConfig"
                            v-model="editedInteraction.extended_description"
                        />
                        <h3 class="text-capitalize mt-4">Management*:</h3>
                        <ckeditor
                            :config="CKEditorConfig"
                            v-model="editedInteraction.management"
                        />
                        <d-bank-refs-table
                            class="featured-interaction-edit-table mt-4"
                            v-if="isRefsFormatted"
                            :isEdit="true"
                            :refs="editedInteraction.references"
                            @edit-ref="openRefDialog"
                        />
                        <footer class="mt-12 pb-4">
                            <v-divider class="mb-4" />
                            <v-btn 
                                class="mr-2"
                                @click="$router.go(-1)"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                type="submit"
                                color="success"
                                :disabled="!isFormValid"
                            >
                                Save
                            </v-btn>
                        </footer>
                    </v-form>
                </v-card>
            </main>
            <entity-not-found 
                entity="featured interaction"
                v-if="!isLoading && !editedInteraction"
            />
            <loader class="featured-interaction-edit-loader" v-if="isLoading" />
            <material-picker
                :dialog="materialPickerDialog"
                @material-picked="setInteractionSide"
                @close-dialog="materialPickerDialog = false"
            />
            <v-dialog v-model="refEditDialog" persistent max-width="600">
                <d-bank-ref-edit 
                    :editedRef="editedRef"
                    @d-bank-ref-dialog-close="closeRefDialog"
                    @d-bank-ref-saved="saveRef"
                />
            </v-dialog>
      </div>
  </section>
</template>

<script>
import { drugBankService } from '@/cms/services/drug-bank.service';
import { eventBus, EV_addInteraction } from '@/cms/services/eventBus.service';
import materialPicker from '@/cms/cmps/featured-interaction/MaterialPicker';
import dBankRefsTable from '@/cms/cmps/common/DBankRefsTable';
import dBankRefEdit from '@/cms/cmps/common/DBankRefEdit';
import entityNotFound from '@/cms/cmps/general/EntityNotFound';
import loader from '@/cms/cmps/general/LoadingCmp';
import CKEditor from 'ckeditor4-vue';

export default {
    data() {
        return {
            editedRef: drugBankService.getEmptyRef(),
            refEditDialog: false,
            isRefsFormatted: false,
            sideActive: 1,
            materialPickerDialog: false,
            valid: false,
            isLoading: false,
            editedInteraction: null,
            CKEditorConfig: {
                height: 400,
                removeButtons: ''
            }
        }
    },
    computed: {
        isFormValid() {
            return this.valid
            && this.editedInteraction.extended_description
            && this.editedInteraction.management;
        }
    },
    methods: {
        async loadInteraction(id) {
            this.isLoading = true;
            const interaction = await this.$store.dispatch({ type: 'getFeaturedInteraction', id });
            this.editedInteraction = interaction;
            this.isLoading = false;
        },
        async saveInteraction() {
            const interaction = JSON.parse(JSON.stringify(this.editedInteraction));
            interaction.isActive = true;
            const updatedInteraction = await this.$store.dispatch({
                type: 'updateFeaturedInteraction',
                interaction
            });
            eventBus.$emit(EV_addInteraction, {
                name: '',
                type: 'featured interaction',
                _id: this.editedInteraction._id,
            });
            this.editedInteraction = updatedInteraction;
        },
        setInteractionSide(material) {
            const side = (this.sideActive === 1) ? 'subject_drug' : 'affected_drug';
            this.editedInteraction[side] = material;
            this.materialPickerDialog = false;
        },
        setInteractionRefs() {
            let refIdx = 1;
            if (Array.isArray(this.editedInteraction.references)) {
                this.isRefsFormatted = true;
                return;
            }
            const refs = Object.keys(this.editedInteraction.references).reduce((acc, key) => {
                const moreRefs = this.editedInteraction.references[key].map(
                    ({ ref_id, pubmed_id, citation, title, url }) => {
                    return {
                        ref_id,
                        pubmed_id: pubmed_id || '',
                        citation: citation || '',
                        title: title || '',
                        url: url || '',
                        draftIdx: refIdx++
                    }
                });
                acc = acc.concat(moreRefs);
                return acc;
            }, []);
            this.editedInteraction.references = refs;
            this.isRefsFormatted = true;
        },
        saveRef() {
            const isEdit = !!this.editedRef.draftIdx;
            if (!isEdit) {
                this.editedRef.draftIdx = this.editedInteraction.references.length + 1;
                this.editedInteraction.references.push({ ...this.editedRef });
            } else {
                const idx = this.editedInteraction.references.findIndex(ref => ref.draftIdx === this.editedRef.draftIdx);
                this.editedInteraction.references.splice(idx, 1, { ...this.editedRef });
            }
            this.closeRefDialog();
        },
        openRefDialog(ref) {
            if (ref) this.editedRef = { ...ref };
            this.refEditDialog = true;
        },
        closeRefDialog() {
            this.editedRef = drugBankService.getEmptyRef();
            this.refEditDialog = false;
        }
    },
    async created() {
        const { id } = this.$route.params;
        await this.loadInteraction(id);
        this.setInteractionRefs();
    },
    components: {
        materialPicker,
        dBankRefsTable,
        dBankRefEdit,
        entityNotFound,
        loader,
        ckeditor: CKEditor.component
    }
}
</script>