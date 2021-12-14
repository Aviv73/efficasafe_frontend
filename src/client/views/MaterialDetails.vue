<template>
    <section class="material-details">
        <aside v-if="material" class="material-details-nav" :class="{'show': showNav}">
            <button class="drawer-btn" @click="showNav = false" v-if="isScreenNarrow">Close</button>
            <router-link to="/" class="material-details-nav-logo">
                <img :src="require('@/client/assets/imgs/logo.png')" alt="Logo" />
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
                <a v-if="material.toxicity" @click="goTo('Toxicology')">Toxicology</a>
                <a v-if="material.pregnancy" @click="goTo('Pregnancy')">Pregnancy</a>
                <a v-if="material.lactation" @click="goTo('Lactation')">Lactation</a>
                <a v-if="material.effectOnDrugMetabolism" @click="goTo('Effect on drug metabolism')">Effect on drug metabolism</a>
                <a v-if="material.detailedPharmacology" @click="goTo('Detailed pharmacology')">Detailed pharmacology</a>
                <a v-if="material.refs && material.refs.length" @click="goTo('References')">References</a>
            </section>
        </aside>
        <main v-if="material" class="material-details-content">
            <button class="drawer-btn" @click="showNav = true" v-if="isScreenNarrow">Open</button>
            <p v-if="material.updatedAt" class="material-details-content-at">Updated on {{material.updatedAt | moment('MMMM DD YYYY')}}</p>
            <h2 class="material-details-content-name">{{material.name}}</h2>
            <p class="material-details-content-family" v-if="material.BotanicalFamily || material.botanicalFamily">botanic family: {{material.BotanicalFamily || material.botanicalFamily || 'Not indicated'}}</p>
            <div class="material-details-content-aliases-container">
                <p v-for="alias in material.aliases" :key="alias">{{alias}}</p>
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
                <p v-if="material.indications">{{material.indications.join(', ')}}</p>
                <p v-else-if="material.dBankIndications">{{material.dBankIndications.join(', ')}}</p>
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
            <section v-if="material.toxicity" class="material-details-content-section">
                <h3 ref="Toxicology">Toxicology</h3>
                <p v-html="material.toxicity"></p>
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
            <section v-if="material.effectOnDrugMetabolism" class="material-details-content-section">
                <h3 ref="Effect on drug metabolism">Effect on drug metabolism</h3>
                <p v-html="material.effectOnDrugMetabolism"></p>
                <hr class="line">
            </section>
            <section v-if="material.detailedPharmacology" class="material-details-content-section">
                <h3 ref="Detailed pharmacology">Detailed pharmacology</h3>
                <p v-html="material.detailedPharmacology"></p>
                <hr class="line">
            </section>
            <section v-if="material.refs && material.refs.length" class="material-details-content-refs">
                <h4 ref="References">References</h4>
                <div v-for="ref in material.refs" :key="ref.draftIdx" class="ref-container">
                    <p class="ref-idx">{{ref.draftIdx}}</p>
                    <div class="txt-container">
                        <p class="txt">{{ref.txt}}</p>
                        <a class="link clip-txt" target="_blank" :href="ref.link">{{ref.link}}</a>
                    </div>
                </div>
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
        this.material = material
    }
};
</script>
