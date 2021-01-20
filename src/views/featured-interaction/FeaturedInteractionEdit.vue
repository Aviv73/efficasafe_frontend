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
                                Edit featured interaction
                            </v-card-title>
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
                <pre>{{ interactionRefs }}</pre>
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
      </div>
  </section>
</template>

<script>
import materialPicker from '@/cmps/featured-interaction/MaterialPicker';
import entityNotFound from '@/cmps/general/EntityNotFound';
import loader from '@/cmps/general/LoadingCmp';
import CKEditor from 'ckeditor4-vue';

export default {
    data() {
        return {
            sideActive: 1,
            materialPickerDialog: false,
            valid: false,
            isLoading: false,
            editedInteraction: null,
            CKEditorConfig: {
            extraPlugins: 'autogrow',
            autoGrow_minHeight: 50,
            removeButtons: '',
            }
        }
    },
    computed: {
        interactionRefs() {
            /// on created, run a method that will replace this.editedInteraction.references
            /// with this computed array, then edit this kind of refs and i will be saved when saving
            let refIdx = 1;
            return Object.keys(this.editedInteraction.references).reduce((acc, key) => {
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
        },
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
            console.log('Saving:', this.editedInteraction);
        },
        setInteractionSide(material) {
            const side = (this.sideActive === 1) ? 'subject_drug' : 'affected_drug';
            this.editedInteraction[side] = material;
            this.materialPickerDialog = false;
        }
    },
    created() {
        const { id } = this.$route.params;
        this.loadInteraction(id);
    },
    components: {
        materialPicker,
        entityNotFound,
        loader,
        ckeditor: CKEditor.component
    }
}
</script>