<template>
<section class="side-details" v-if="side">
  <v-card class="px-2 pb-1">
    <v-card-title class="side-details-title px-0">
        <v-avatar left class="mr-2" size="20">
            <v-img
                :src="require(`@/assets/icons/${side.type}.svg`)"
            ></v-img>
        </v-avatar>
        {{ side.name }}
    </v-card-title>
    <div class="side-details-row" v-if="side.type">
        <span class="text-capitalize">Type:</span>
        {{ side.type }}
    </div>
    <div class="side-details-row" v-if="side.atcId">
        <span class="text-capitalize">ATC code:</span>
        {{ side.atcId }}
    </div>
    <div class="side-details-row" v-if="side.dragBankId">
        <span class="text-capitalize">DrugBank id:</span>
        {{ side.dragBankId }}
    </div>
    <div class="side-details-row" v-if="side.brands.length">
        <span class="text-capitalize">Brands:</span>
        <v-chip-group column>
            <v-chip v-for="(brand, idx) in side.brands" :key="idx">
                {{ brand }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.aliases.length">
        <span class="text-capitalize">Synonyms:</span>
        <v-chip-group column>
            <v-chip v-for="(alias, idx) in side.aliases" :key="idx">
                {{ alias }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.botanicalFamily">
        <span class="text-capitalize">Botanical family:</span>
        {{ side.botanicalFamily }}
    </div>
    <div class="side-details-row" v-if="side.desc">
        <span class="text-capitalize">Description:</span>
        <div v-html="side.desc"></div>
    </div>
    <div class="side-details-row" v-if="side.plantPartUsed">
        <span class="text-capitalize">Plant part used:</span>
        {{ side.plantPartUsed }}
    </div>
    <div class="side-details-row" v-if="side.qualities.length">
        <span class="text-capitalize">Qualities:</span>
        <v-chip-group column>
            <v-chip v-for="(quality, idx) in side.qualities" :key="idx">
                {{ quality }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.activeConstituents">
        <span class="text-capitalize">Active constituents:</span>
        <div v-html="side.activeConstituents"></div>
    </div>
    <div class="side-details-row" v-if="side.medicinalActions.length">
        <span class="text-capitalize">Medicinal actions:</span>
        <v-chip-group column>
            <v-chip v-for="(action, idx) in side.medicinalActions" :key="idx">
                {{ action }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.indications.length">
        <span class="text-capitalize">Indications:</span>
        <v-chip-group column>
            <v-chip v-for="(indication, idx) in side.indications" :key="idx">
                {{ indication }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.dosage">
        <span class="text-capitalize">Dosage:</span>
        <div v-html="side.dosage"></div>
    </div>
    <div class="side-details-row" v-if="side.sensitivities">
        <span class="text-capitalize">Sensitivities:</span>
        <div v-html="side.sensitivities"></div>
    </div>
    <div class="side-details-row" v-if="side.adverseReactions">
        <span class="text-capitalize">Adverse reactions:</span>
        <div v-html="side.adverseReactions"></div>
    </div>
    <div class="side-details-row" v-if="side.overdosage">
        <span class="text-capitalize">Overdosage:</span>
        <div v-html="side.overdosage"></div>
    </div>
    <div class="side-details-row" v-if="side.precautions">
        <span class="text-capitalize">Precautions:</span>
        <div v-html="side.precautions"></div>
    </div>
    <div class="side-details-row" v-if="side.contraindications">
        <span class="text-capitalize">Contraindications:</span>
        <div v-html="side.contraindications"></div>
    </div>
    <div class="side-details-row" v-if="side.toxicity">
        <span class="text-capitalize">Toxicity:</span>
        <div v-html="side.toxicity"></div>
    </div>
    <div class="side-details-row" v-if="side.pregnancy">
        <span class="text-capitalize">Pregnancy:</span>
        <div v-html="side.pregnancy"></div>
    </div>
    <div class="side-details-row" v-if="side.lactation">
        <span class="text-capitalize">Lactation:</span>
        <div v-html="side.lactation"></div>
    </div>
    <div class="side-details-row" v-if="side.draft">
        <span class="text-capitalize">Draft:</span>
        <div v-html="side.draft"></div>
    </div>
    <div class="side-details-row" v-if="side.effectOnDrugMetabolism">
        <span class="text-capitalize">Effect on drug metabolism:</span>
        <div v-html="side.effectOnDrugMetabolism"></div>
    </div>
    <div class="side-details-row" v-if="side.detailedPharmacology">
        <span class="text-capitalize">Detailed pharmacology:</span>
        <div v-html="side.detailedPharmacology"></div>
    </div>
    <div class="side-details-row" v-if="side.mechanismOfAction">
        <span class="text-capitalize">Mechanism of action:</span>
        <div v-html="side.mechanismOfAction"></div>
    </div>
    <div class="side-details-row" v-if="side.editorDraft">
        <span class="text-capitalize">Editor draft:</span>
        {{ side.editorDraft }}
    </div>
    <div class="side-details-row" v-if="side.regions.length">
        <span class="text-capitalize">Regions:</span>
        <v-chip-group column>
            <v-chip v-for="(region, idx) in side.regions" :key="idx" class="text-uppercase">
                <v-avatar left>
                    <v-img
                        :src="require(`@/assets/icons/regions/${region}.svg`)"
                    ></v-img>
                </v-avatar>
                {{ region }}
            </v-chip>
        </v-chip-group>
    </div>
    <div class="side-details-row" v-if="side.subMaterials.length">
        <span class="text-capitalize">Sub materials:</span>
        <sub-material-list :subMats="side.subMaterials" />
    </div>
    <div class="side-details-row" v-if="side.atcPaths.length">
        <span class="text-capitalize">ATC paths:</span>
        <label-path-list
            class="narrow"
            :atcPaths="side.atcPaths"
            :isEdit="false"
        />
    </div>
    <div class="side-details-row" v-if="side.labels.length">
        <span class="text-capitalize">Labels:</span>
        <v-chip-group column>
            <v-chip v-for="label in side.labels" :key="label._id" :style="label.color">
                <router-link :to="`/label/${label._id}`">
                        {{ label.name }}
                </router-link>
            </v-chip>
        </v-chip-group>
    </div>
    <reference-table
        class="ref-table"
        :references="side.refs"
        v-if="side.refs.length"
    />
  </v-card>
</section>
</template>

<script>
import subMaterialList from '@/cmps/material/SubMaterialList';
import labelPathList from '@/cmps/material/details/LabelPathList';
import referenceTable from '@/cmps/common/ReferenceTable';

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            side: null
        }
    },
    watch: {
        id() {
            this.loadSide();
        }
    },
    methods: {
        async loadSide() {
            const { id } = this.$props;
            if (id) {
                const material = await this.$store.dispatch({ type: 'loadMaterial', matId: id });
                this.side = material;
            }
        }
    },
    created() {
        this.loadSide();
    },
    components: {
        subMaterialList,
        labelPathList,
        referenceTable
    }
}
</script>