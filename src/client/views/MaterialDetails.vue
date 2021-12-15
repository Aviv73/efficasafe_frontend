<template>
    <section @copy.prevent class="material-details no-print">
        <aside v-if="material" class="material-details-nav" :class="{'show': showNav}">
            <button class="drawer-btn" @click="showNav = false" v-if="isScreenNarrow">Close</button>
            <router-link to="/" class="material-details-nav-logo">
                <img :src="require('@/client/assets/imgs/flat-logo.png')" alt="Logo" />
            </router-link>
            <hr>
            <section class="material-details-nav-links">
                <a v-if="material.desc || material.dBankDesc" @click="goTo('Background')">Background</a>
                <a v-if="material.plantPartUsed" @click="goTo('Plant part used')">Plant part used</a>
                <a v-if="material.qualities && material.qualities.length" @click="goTo('Qualities')">Qualities</a>
                <a v-if="material.activeConstituents" @click="goTo('Active constituents')">Active constituents</a>
                <a v-if="material.medicinalActions && material.medicinalActions.length" @click="goTo('Medicinal actions')">Medicinal actions</a>
                <a v-if="(material.indications && material.indications.length) || (material.dBankIndications && material.dBankIndications.length)" @click="goTo('Medicinal uses')">Medicinal uses</a>
                <a v-if="material.dosage" @click="goTo('Dosage')">Dosage</a>
                <a v-if="material.sensitivities" @click="goTo('Sensitivities')">Sensitivities</a>
                <a v-if="material.adverseReactions" @click="goTo('Adverse reactions')">Adverse reactions</a>
                <a v-if="material.overdosage" @click="goTo('Overdosage')">Overdosage</a>
                <a v-if="material.precautions" @click="goTo('Warnings and precautions')">Warnings and precautions</a>
                <a v-if="material.contraindications" @click="goTo('Contraindications')">Contraindications</a>
                <a v-if="material.toxicity || material.pharmacology.toxicity" @click="goTo('Toxicology')">Toxicology</a>
                <a v-if="material.pregnancy" @click="goTo('Pregnancy')">Pregnancy</a>
                <a v-if="material.lactation" @click="goTo('Lactation')">Lactation</a>
                <a v-if="material.pharmacology.indication" @click="goTo('Pharmacology')">Pharmacology</a>
                <a v-if="material.pharmacology.pharmacodynamics" @click="goTo('Pharmacodynamics')">Pharmacodynamics</a>
                <a v-if="material.pharmacology.absorption" @click="goTo('Absorption')">Absorption</a>
                <a v-if="material.pharmacology.mechanismOfAction" @click="goTo('Mechanism of action')">Mechanism of action</a>
                <a v-if="material.pharmacology.proteinBinding" @click="goTo('Protein binding')">Protein binding</a>
                <a v-if="material.pharmacology.metabolism" @click="goTo('Metabolism')">Metabolism</a>
                <a v-if="material.pharmacology.halfLife" @click="goTo('Half life')">Half life</a>
                <a v-if="material.pharmacology.routeOfElimination" @click="goTo('Route of elimination')">Route of elimination</a>
                <a v-if="material.pharmacology.volumeOfDistribution" @click="goTo('Volume of distribution')">Volume of distribution</a>
                <a v-if="material.pharmacology.clearance" @click="goTo('Clearance')">Clearance</a>
                <a v-if="material.ODA" @click="goTo('Optimal Daily Allowance')">Optimal Daily Allowance</a>
                <a v-if="material.RDA" @click="goTo('Recommended Daily Allowance')">Recommended Daily Allowance</a>
                <a v-if="material.nutritionalSources" @click="goTo('Nutritional sources')">Nutritional sources</a>
                <a v-if="material.absorptionAndExcretion" @click="goTo('Absorption and excretion')">Absorption and excretion</a>
                <a v-if="material.causesOfDeficiency" @click="goTo('Causes of deficiency')">Causes of deficiency</a>
                <a v-if="material.symptomsOfDeficiency" @click="goTo('Symptoms of deficiency')">Symptoms of deficiency</a>
                <a v-if="material.otherCharacteristics" @click="goTo('Other characteristics')">Other characteristics</a>
                <a v-if="material.structuredAdverseEffects.length" @click="goTo('Adverse effects')">Adverse effects</a>
                <a v-if="material.structuredContraIndications.length" @click="goTo('Contraindications')">Contraindications</a>
                <a v-if="material.foodInteractions.length" @click="goTo('Food Interactions')">Food Interactions</a>
                <a v-if="(material.refs && material.refs.length) || (material.dBankRefs && material.dBankRefs.length)" @click="goTo('References')">References</a>
            </section>
        </aside>
        <main v-if="material" class="material-details-content">
            <button class="drawer-btn" @click="showNav = true" v-if="isScreenNarrow">Open</button>
            <p v-if="material.updatedAt" class="material-details-content-at">Updated on {{material.updatedAt | moment('MMMM DD YYYY')}}</p>
            <h2 class="material-details-content-name">{{material.name}}</h2>
            <p class="material-details-content-family" v-if="material.BotanicalFamily || material.botanicalFamily">botanic family: {{material.BotanicalFamily || material.botanicalFamily || 'Not indicated'}}</p>
            <div v-if="material.aliases.length" class="material-details-content-aliases-container">
                <p v-for="alias in material.aliases" :key="alias">{{alias}}</p>
            </div>
            <div v-else-if="material.dBankAliases.length" class="material-details-content-aliases-container">
                <p v-for="alias in material.dBankAliases" :key="alias">{{alias}}</p>
            </div>
            <hr class="line">
            <section v-if="material.desc || material.dBankDesc" class="material-details-content-section">
                <h3 ref="Background">Background</h3>
                <p v-if="material.desc" v-html="material.desc"></p>
                <p v-else-if="material.dBankDesc" v-html="material.dBankDesc"></p>
                <hr class="line">
            </section>
            <section v-if="material.plantPartUsed" class="material-details-content-section">
                <h3 ref="Plant part used">Plant part used</h3>
                <p>{{material.plantPartUsed}}</p>
                <hr class="line">
            </section>
            <section v-if="material.qualities && material.qualities.length" class="material-details-content-section">
                <h3 ref="Qualities">Qualities</h3>
                <p v-for="quality in material.qualities" :key="quality">{{quality}}</p>
                <hr class="line">
            </section>
            <section v-if="material.activeConstituents" class="material-details-content-section">
                <h3 ref="Active constituents">Active constituents</h3>
                <p v-html="material.activeConstituents"></p>
                <hr class="line">
            </section>
            <section v-if="material.medicinalActions && material.medicinalActions.length" class="material-details-content-section">
                <h3 ref="Medicinal actions">Medicinal actions</h3>
                <p>{{material.medicinalActions.join(', ')}}</p>
                <hr class="line">
            </section>
            <section v-if="(material.indications && material.indications.length) || (material.dBankIndications && material.dBankIndications.length)" class="material-details-content-section">
                <h3 ref="Medicinal uses">Medicinal uses</h3>
                <p v-if="material.indications.length">{{material.indications.join(', ')}}</p>
                <p v-else-if="material.dBankIndications.length">{{material.dBankIndications.join(', ')}}</p>
                <hr class="line">
            </section>
            <section v-if="material.dosage" class="material-details-content-section">
                <h3 ref="Dosage">Dosage</h3>
                <p v-html="material.dosage"></p>
                <hr class="line">
            </section>
            <section v-if="material.sensitivities" class="material-details-content-section">
                <h3 ref="Sensitivities">Sensitivities</h3>
                <p v-html="material.sensitivities"></p>
                <hr class="line">
            </section>
            <section v-if="material.adverseReactions" class="material-details-content-section">
                <h3 ref="Adverse reactions">Adverse reactions</h3>
                <p v-html="material.adverseReactions"></p>
                <hr class="line">
            </section>
            <section v-if="material.overdosage" class="material-details-content-section">
                <h3 ref="Overdosage">Overdosage</h3>
                <p v-html="material.overdosage"></p>
                <hr class="line">
            </section>
            <section v-if="material.precautions" class="material-details-content-section">
                <h3 ref="Warnings and precautions">Warnings and precautions</h3>
                <p v-html="material.precautions"></p>
                <hr class="line">
            </section>
            <section v-if="material.contraindications" class="material-details-content-section">
                <h3 ref="Contraindications">Contraindications</h3>
                <p v-html="material.contraindications"></p>
                <hr class="line">
            </section>
            <section v-if="material.toxicity || material.pharmacology.toxicity" class="material-details-content-section">
                <h3 ref="Toxicology">Toxicology</h3>
                <p v-html="material.toxicity ||  material.pharmacology.toxicity"></p>
                <hr class="line">
            </section>
            <section v-if="material.pregnancy" class="material-details-content-section">
                <h3 ref="Pregnancy">Pregnancy</h3>
                <p v-html="material.pregnancy"></p>
                <hr class="line">
            </section>
            <section v-if="material.lactation" class="material-details-content-section">
                <h3 ref="Lactation">Lactation</h3>
                <p v-html="material.lactation"></p>
                <hr class="line">
            </section>
            <section v-if="material.pharmacology.indication" class="material-details-content-section">
                <h3 ref="Pharmacology">Pharmacology</h3>
                <p v-html="material.pharmacology.indication"></p>
                <hr class="line">
            </section>
            <section v-if="material.pharmacology.pharmacodynamics" class="material-details-content-section">
                <h3 ref="Pharmacodynamics">Pharmacodynamics</h3>
                <p>{{material.pharmacology.pharmacodynamics}}</p>
                <hr class="line">
            </section>
            <section v-if="material.pharmacology.absorption" class="material-details-content-section">
                <h3 ref="Absorption">Absorption</h3>
                <p>{{material.pharmacology.absorption}}</p>
                <hr class="line">
            </section>
            <section v-if="material.pharmacology.mechanismOfAction" class="material-details-content-section">
                <h3 ref="Mechanism of action">Mechanism of action</h3>
                <p>{{material.pharmacology.mechanismOfAction}}</p>
                <hr class="line">
            </section>
            <section v-if="material.pharmacology.proteinBinding" class="material-details-content-section">
                <h3 ref="Protein binding">Protein binding</h3>
                <p>{{material.pharmacology.proteinBinding}}</p>
                <hr class="line">
            </section>
            <section v-if="material.pharmacology.metabolism" class="material-details-content-section">
                <h3 ref="Metabolism">Metabolism</h3>
                <p>{{material.pharmacology.metabolism}}</p>
                <hr class="line">
            </section>
            <section v-if="material.pharmacology.halfLife" class="material-details-content-section">
                <h3 ref="Half life">Half life</h3>
                <p>{{material.pharmacology.halfLife}}</p>
                <hr class="line">
            </section>
            <section v-if="material.pharmacology.routeOfElimination" class="material-details-content-section">
                <h3 ref="Route of elimination">Route of elimination</h3>
                <p>{{material.pharmacology.routeOfElimination}}</p>
                <hr class="line">
            </section>
            <section v-if="material.pharmacology.volumeOfDistribution" class="material-details-content-section">
                <h3 ref="Volume of distribution">Volume of distribution</h3>
                <p>{{material.pharmacology.volumeOfDistribution}}</p>
                <hr class="line">
            </section>
            <section v-if="material.pharmacology.clearance" class="material-details-content-section">
                <h3 ref="Clearance">Clearance</h3>
                <p>{{material.pharmacology.clearance}}</p>
                <hr class="line">
            </section>
            <section v-if="material.ODA" class="material-details-content-section">
                <h3 ref="Optimal Daily Allowance">Optimal Daily Allowance</h3>
                <p v-html="material.ODA"></p>
                <hr class="line">
            </section>
            <section v-if="material.RDA" class="material-details-content-section">
                <h3 ref="Recommended Daily Allowance">Recommended Daily Allowance</h3>
                <p v-html="material.RDA"></p>
                <hr class="line">
            </section>
            <section v-if="material.nutritionalSources" class="material-details-content-section">
                <h3 ref="Nutritional sources">Nutritional sources</h3>
                <p v-html="material.nutritionalSources"></p>
                <hr class="line">
            </section>
            <section v-if="material.absorptionAndExcretion" class="material-details-content-section">
                <h3 ref="Absorption and excretion">Absorption and excretion</h3>
                <p v-html="material.absorptionAndExcretion"></p>
                <hr class="line">
            </section>
            <section v-if="material.causesOfDeficiency" class="material-details-content-section">
                <h3 ref="Causes of deficiency">Causes of deficiency</h3>
                <p v-html="material.causesOfDeficiency"></p>
                <hr class="line">
            </section>
            <section v-if="material.symptomsOfDeficiency" class="material-details-content-section">
                <h3 ref="Symptoms of deficiency">Symptoms of deficiency</h3>
                <p v-html="material.symptomsOfDeficiency"></p>
                <hr class="line">
            </section>
            <section v-if="material.otherCharacteristics" class="material-details-content-section">
                <h3 ref="Other characteristics">Other characteristics</h3>
                <p v-html="material.otherCharacteristics"></p>
                <hr class="line">
            </section>
            <section v-if="material.structuredAdverseEffects.length" class="material-details-content-section">
                <h3 ref="Adverse effects">Adverse effects</h3>
                <div class="material-details-content-aliases-container">
                    <p class="item" v-for="effect in material.structuredAdverseEffects" :key="effect">{{effect}}</p>
                </div>
                <hr class="line">
            </section>
            <section v-if="material.structuredContraIndications.length" class="material-details-content-section">
                <h3 ref="Contraindications">Contraindications</h3>
                <div class="material-details-content-aliases-container">
                    <p class="item" v-for="effect in material.structuredContraIndications" :key="effect">{{effect}}</p>
                </div>
                <hr class="line">
            </section>
            <section v-if="material.foodInteractions.length" class="material-details-content-section">
                <h3 ref="Food Interactions">Food Interactions</h3>
                    <p v-for="effect in material.foodInteractions" :key="effect">{{effect}}</p>
                <hr class="line">
            </section>
            <section v-if="(material.refs && material.refs.length) || (material.dBankRefs && material.dBankRefs.length)" class="material-details-content-refs">
                <h4 ref="References">References</h4>
                <template v-if="material.refs.length">
                    <div v-for="ref in material.refs" :key="ref.draftIdx" class="ref-container">
                        <p class="ref-idx">{{ref.draftIdx}}</p>
                        <div class="txt-container">
                            <p class="txt">{{ref.txt}}</p>
                            <a class="link clip-txt" target="_blank" :href="ref.link">{{ref.link}}</a>
                        </div>
                    </div>
                </template>
                <template v-else-if="material.dBankRefs.length">
                    <div v-for="ref in material.dBankRefs" :key="ref.ref_id" class="ref-container">
                        <p class="ref-idx">{{ref.ref_id}}</p>
                        <div class="txt-container">
                            <p class="txt">{{ref.citation}}</p>
                            <a class="link clip-txt" target="_blank" :href="ref.link">{{ref.link}}</a>
                        </div>
                    </div>
                </template>
            </section>
        </main>
    </section>
</template>

<script>

export default {
    data() {
        return {
            material: null,
            showNav: false
        }
    },
    methods: {
        goTo(refName) {
            const element = this.$refs[refName];
            const top = element.offsetTop;

            window.scrollTo(0, top - 60);
            this.showNav = false
        }
    },
    computed:{
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        }
    },
    async created(){
        const { id } = this.$route.params;
        const material = await this.$store.dispatch({type: 'loadMaterial',matId: id });
        console.log(material);
        this.material = material.isShowPage ? material : null
    }
};
</script>
