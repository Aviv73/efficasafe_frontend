<template>
    <section @copy.prevent class="material-details no-print">
        <template v-if="!isLoading">
            <aside v-if="material" class="material-details-nav" :class="{'show': showNav}">
                <button class="drawer-btn" @click="showNav = false" v-if="isScreenNarrow"><arrow-left-icon/></button>
                <router-link to="/" class="material-details-nav-logo">
                    <img :src="require('@/client/assets/imgs/flat-logo.png')" alt="Logo" />
                </router-link>
                <div class="material-details-nav-header">
                    <img :src="require(`@/client/assets/icons/types/${getTypeImgName(material.type)}.svg`)" alt="">
                    <h3 @click="goTo('Title')">{{material.name}}</h3>
                </div>
                <hr>
                <section class="material-details-nav-links">
                    <a v-if="material.desc || material.dBankDesc" @click="goTo('Background')">Background</a>
                    <a v-if="material.plantPartUsed" @click="goTo('Plant part used')">Plant part used</a>
                    <a v-if="material.qualities && material.qualities.length" @click="goTo('Qualities')">Qualities</a>
                    <a v-if="material.nutritionalSources" @click="goTo('Nutritional sources')">Nutritional sources</a>
                    <a v-if="material.otherCharacteristics" @click="goTo('Other characteristics')">Other characteristics</a>
                    <a v-if="material.activeConstituents" @click="goTo('Active constituents')">Active constituents</a>
                    <a v-if="material.medicinalActions && material.medicinalActions.length" @click="goTo('Medicinal actions')">Medicinal actions</a>
                    <a v-if="(material.indications && material.indications.length) || (material.dBankIndications && material.dBankIndications.length)" @click="goTo('Medicinal uses')">Medicinal uses</a>
                    <a v-if="material.absorptionAndExcretion" @click="goTo('Absorption and excretion')">Absorption and excretion</a>
                    <a v-if="material.causesOfDeficiency" @click="goTo('Causes of deficiency')">Causes of deficiency</a>
                    <a v-if="material.symptomsOfDeficiency" @click="goTo('Symptoms of deficiency')">Symptoms of deficiency</a>
                    <a v-if="material.dosage" @click="goTo('Dosage')">Dosage</a>
                    <a v-if="material.ODA" @click="goTo('Optimal Daily Allowance')">Optimal Daily Allowance</a>
                    <a v-if="material.RDA" @click="goTo('Recommended Daily Allowance')">Recommended Daily Allowance</a>
                    <a v-if="material.sensitivities" @click="goTo('Sensitivities')">Sensitivities</a>
                    <a v-if="material.adverseReactions" @click="goTo('Adverse reactions')">Adverse reactions</a>
                    <a v-if="material.overdosage" @click="goTo('Overdosage')">Overdosage</a>
                    <a v-if="material.precautions" @click="goTo('Warnings and precautions')">Warnings and precautions</a>
                    <a v-if="material.contraindications" @click="goTo('Contraindications')">Contraindications</a>
                    <a v-if="material.toxicity" @click="goTo('Toxicology1')">Toxicology</a>
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
                    <a v-if="material.structuredAdverseEffects.length" @click="goTo('Adverse effects')">Adverse effects</a>
                    <a v-if="material.structuredContraIndications.length" @click="goTo('Contraindications')">Contraindications</a>
                    <a v-if="material.pharmacology.toxicity" @click="goTo('Toxicity')">Toxicity</a>
                    <a v-if="material.foodInteractions.length" @click="goTo('Food Interactions')">Food Interactions</a>
                    <a v-if="(material.refs && material.refs.length) || (material.dBankRefs && material.dBankRefs.length)" @click="goTo('References')">References</a>
                </section>
            </aside>
            <main v-if="material" class="material-details-content">
                <button
                    class="material-details-content-share-btn"
                    @click="isShareModalActive = true"
                >
                    <mobile-share-icon v-if="isScreenNarrow" title="" />
                    <share-variant-icon v-else title="" />
                </button>
                <button class="drawer-btn" @click="showNav = true" v-if="isScreenNarrow"><menu-icon title="" /></button>
                <p v-if="material.updatedAt" class="material-details-content-at">Updated on {{material.updatedAt | moment('MMMM DD YYYY')}}</p>
                <h2 ref="Title" class="material-details-content-name">{{material.name}}</h2>
                <p class="material-details-content-family" v-if="material.BotanicalFamily || material.botanicalFamily">botanical family: {{material.BotanicalFamily || material.botanicalFamily || 'Not indicated'}}</p>
                <div v-if="aliasesToShow.length" class="material-details-content-aliases-container">
                    <p v-for="alias in aliasesToShow" :key="alias">{{alias}}</p>
                </div>
                <hr class="line">
                <section v-if="material.desc || material.dBankDesc" class="material-details-content-section">
                    <h3 ref="Background">Background</h3>
                    <p v-if="material.desc" v-html="material.desc" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <p v-else-if="material.dBankDesc" v-html="material.dBankDesc" v-refs-tooltip-material="{material,refCountMap}"></p>
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
                <section v-if="material.nutritionalSources" class="material-details-content-section">
                    <h3 ref="Nutritional sources">Nutritional sources</h3>
                    <p v-html="material.nutritionalSources" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.otherCharacteristics" class="material-details-content-section">
                    <h3 ref="Other characteristics">Other characteristics</h3>
                    <p v-html="material.otherCharacteristics" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.activeConstituents" class="material-details-content-section">
                    <h3 ref="Active constituents">Active constituents</h3>
                    <p v-html="material.activeConstituents" v-refs-tooltip-material="{material,refCountMap}"></p>
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
                <section v-if="material.absorptionAndExcretion" class="material-details-content-section">
                    <h3 ref="Absorption and excretion">Absorption and excretion</h3>
                    <p v-html="material.absorptionAndExcretion" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.causesOfDeficiency" class="material-details-content-section">
                    <h3 ref="Causes of deficiency">Causes of deficiency</h3>
                    <p v-html="material.causesOfDeficiency" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.symptomsOfDeficiency" class="material-details-content-section">
                    <h3 ref="Symptoms of deficiency">Symptoms of deficiency</h3>
                    <p v-html="material.symptomsOfDeficiency" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.dosage" class="material-details-content-section">
                    <h3 ref="Dosage">Dosage</h3>
                    <p v-html="material.dosage" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.ODA" class="material-details-content-section">
                    <h3 ref="Optimal Daily Allowance">Optimal Daily Allowance</h3>
                    <p v-html="material.ODA" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.RDA" class="material-details-content-section">
                    <h3 ref="Recommended Daily Allowance">Recommended Daily Allowance</h3>
                    <p v-html="material.RDA" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.sensitivities" class="material-details-content-section">
                    <h3 ref="Sensitivities">Sensitivities</h3>
                    <p v-html="material.sensitivities" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.adverseReactions" class="material-details-content-section">
                    <h3 ref="Adverse reactions">Adverse reactions</h3>
                    <p v-html="material.adverseReactions" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.overdosage" class="material-details-content-section">
                    <h3 ref="Overdosage">Overdosage</h3>
                    <p v-html="material.overdosage" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.precautions" class="material-details-content-section">
                    <h3 ref="Warnings and precautions">Warnings and precautions</h3>
                    <p v-html="material.precautions" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.contraindications" class="material-details-content-section">
                    <h3 ref="Contraindications">Contraindications</h3>
                    <p v-html="material.contraindications" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.toxicity" class="material-details-content-section">
                    <h3 ref="Toxicology1">Toxicology</h3>
                    <p v-html="material.toxicity" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pregnancy" class="material-details-content-section">
                    <h3 ref="Pregnancy">Pregnancy</h3>
                    <p v-html="material.pregnancy" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.lactation" class="material-details-content-section">
                    <h3 ref="Lactation">Lactation</h3>
                    <p v-html="material.lactation" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pharmacology.indication" class="material-details-content-section">
                    <h3 ref="Pharmacology">Pharmacology</h3>
                    <p v-html="material.pharmacology.indication" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pharmacology.pharmacodynamics" class="material-details-content-section">
                    <h3 ref="Pharmacodynamics">Pharmacodynamics</h3>
                    <p v-html="material.pharmacology.pharmacodynamics" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pharmacology.absorption" class="material-details-content-section">
                    <h3 ref="Absorption">Absorption</h3>
                    <p v-html="material.pharmacology.absorption" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pharmacology.mechanismOfAction" class="material-details-content-section">
                    <h3 ref="Mechanism of action">Mechanism of action</h3>
                    <p v-html="material.pharmacology.mechanismOfAction" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pharmacology.proteinBinding" class="material-details-content-section">
                    <h3 ref="Protein binding">Protein binding</h3>
                    <p v-html="material.pharmacology.proteinBinding" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pharmacology.metabolism" class="material-details-content-section">
                    <h3 ref="Metabolism">Metabolism</h3>
                    <p v-html="material.pharmacology.metabolism" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pharmacology.halfLife" class="material-details-content-section">
                    <h3 ref="Half life">Half life</h3>
                    <p v-html="material.pharmacology.halfLife" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pharmacology.routeOfElimination" class="material-details-content-section">
                    <h3 ref="Route of elimination">Route of elimination</h3>
                    <p v-html="material.pharmacology.routeOfElimination" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pharmacology.volumeOfDistribution" class="material-details-content-section">
                    <h3 ref="Volume of distribution">Volume of distribution</h3>
                    <p v-html="material.pharmacology.volumeOfDistribution" v-refs-tooltip-material="{material,refCountMap}"></p>
                    <hr class="line">
                </section>
                <section v-if="material.pharmacology.clearance" class="material-details-content-section">
                    <h3 ref="Clearance">Clearance</h3>
                    <p v-html="material.pharmacology.clearance" v-refs-tooltip-material="{material,refCountMap}"></p>
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
                <section v-if="material.pharmacology.toxicity" class="material-details-content-section">
                    <h3 ref="Toxicity">Toxicity</h3>
                    <p v-html="material.pharmacology.toxicity" v-refs-tooltip-material="{material,refCountMap}"></p>
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
                        <div v-for="ref in refsToShow" :key="ref.draftIdx" class="ref-container">
                            <p class="ref-idx">{{ref.draftIdx}}</p>
                            <div class="txt-container">
                                <p class="txt">{{ref.txt}}</p>
                                <a v-if="ref.link" class="link clip-txt" target="_blank" :href="ref.link">{{ref.link}}</a>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="material.dBankRefs.length">
                        <div v-for="ref in dBankRefsToShow" :key="ref.ref_id" class="ref-container">
                            <p class="ref-idx dBank-ref-idx">{{ref.ref_id}}</p>
                            <div class="txt-container">
                                <p v-if="ref.citation" class="txt">{{ref.citation}}</p>
                                <a v-if="ref.pubmed_id" class="link clip-txt" target="_blank" :href="`https://pubmed.ncbi.nlm.nih.gov/${ref.pubmed_id}`">https://pubmed.ncbi.nlm.nih.gov/{{ref.pubmed_id}}</a>
                                <a v-if="ref.url" class="link clip-txt" target="_blank" :href="ref.url">{{ref.url}}</a>
                            </div>
                        </div>
                    </template>
                </section>
            </main>
        </template>
        <loader v-else class="loader" />
        <modal-wrap
            :isActive="isShareModalActive"
            @close-modal="isShareModalActive = false"
        >
            <share-modal @close-modal="isShareModalActive = false" />
        </modal-wrap>
    </section>
</template>

<script>

import { materialUIService } from '@/cms/services/material-ui.service'

import Loader from '@/client/cmps/common/icons/Loader';
import ShareModal from '@/client/cmps/shared/modals/ShareModal';
import ModalWrap from '@/client/cmps/common/ModalWrap';

import MenuIcon from 'vue-material-design-icons/Menu';
import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft';
import MobileShareIcon from '@/client/cmps/common/icons/MobileShareIcon';
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';

export default {
    data() {
        return {
            material: null,
            showNav: false,
            isShareModalActive: false,
            refCountMap:{},
            nextRefNum: 1,
            isLoading: true,
            filedToSkip:['pathways','effectOnDrugMetabolism','detailedPharmacology'],
            refNumsToShow:[],
            fieldsToCheckSupp:['desc','activeConstituents','nutritionalSources','otherCharacteristics','absorptionAndExcretion','causesOfDeficiency','symptomsOfDeficiency','dosage','ODA','RDA','sensitivities','adverseReactions','overdosage','precautions','contraindications','toxicity','pregnancy','lactation'],
            fieldsToCheckDrug:['dBankDesc','activeConstituents','dosage','sensitivities','adverseReactions','overdosage','precautions','contraindications','toxicity','pregnancy','lactation'],
            fieldsToCheckPharmacology:['indication','pharmacodynamics','absorption','mechanismOfAction','proteinBinding','metabolism','halfLife','routeOfElimination','volumeOfDistribution','clearance','toxicity']
        }
    },
    methods: {
        goTo(refName) {
            const element = this.$refs[refName];
            const top = element.offsetTop;

            window.scrollTo(0, top - 60);
            this.showNav = false
        },
        getTypeImgName(type) {
            switch (type) {
                case 'drug':
                    return 'drug';
                case 'herb':
                case 'essential oil':
                    return 'herb';
                case 'vitamin':
                case 'mineral':
                case 'amino acid':
                case 'nutraceutical':
                    return 'other';
                case 'food':
                    return 'food';
            }
        },
        setRefNumsToShow(ref){
            let formattedRef = ref.substring(1, ref.length-1);
            if(!formattedRef.includes(',') && !formattedRef.includes('-')){
                this.refNumsToShow.push(+formattedRef)
                if(!this.refCountMap[formattedRef]) {
                    this.refCountMap[formattedRef] = this.nextRefNum
                    this.nextRefNum++
                }
            }else{
                let refs = formattedRef.split(',')
                refs.forEach(refStr => {
                    if(!refStr.includes('-')){
                        this.refNumsToShow.push(+refStr)
                        if(!this.refCountMap[refStr]) {
                            this.refCountMap[refStr] = this.nextRefNum
                            this.nextRefNum++
                        }
                    }
                    else{
                        let firstRef = +refStr.split('-')[0]
                        let LastRef = +refStr.split('-')[1]
                        for (let i = firstRef; i <= LastRef; i++) {
                            this.refNumsToShow.push(i)
                            if(!this.refCountMap[i+'']) {
                                this.refCountMap[i+''] = this.nextRefNum
                                this.nextRefNum++
                            }
                        }
                    }
                })
            } 
            this.refNumsToShow = [...new Set(this.refNumsToShow)]
        },
        addSubHeaders(object, key, isDrug = false){
            const subHeaderRegex = /\*{2}(.*?)\*{2}/g
            const subHeaders = object[key].match(subHeaderRegex);
            if(subHeaders){
                subHeaders.forEach(subHeader => {
                    let justHeader = subHeader.substring(2, subHeader.length - 2)
                    object[key] = object[key].replaceAll(subHeader, `<h2 class="dbank-sub-header">${justHeader}</h2>`)
                })
            }
            
            return isDrug ? object[key] : object
        },
        removeUnderLines(str){
            const regex = /_{1}(.*?)_{1}/g
            const matches = str.match(regex)
            if(matches){
                matches.forEach(match => {
                    let strToShow = match.substring(1, match.length - 1)
                    str = str.replaceAll(match, strToShow)
                })
            }
            return str
        },
        addSubRefsSupp(material){
            const regex = /\(([\d- ,\d]+)\)/g;
            this.fieldsToCheckSupp.forEach(key => {
                if(this.filedToSkip.includes(key)) return
                material = this.addSubHeaders(material, key)
                const matches = material[key].match(regex);
                if(matches){
                    matches.forEach(match => {
                        this.setRefNumsToShow(match)
                        const strToShow = this.createStrRefs(match)
                        material[key] = material[key].replaceAll(match,`<sub class="sub-font tooltip-sub">(${strToShow})</sub>`)
                    });
                }
            })
            this.fieldsToCheckPharmacology.forEach(key => {
                const matches = material.pharmacology[key].match(regex);
                if(matches){
                    matches.forEach(match => {
                        this.setRefNumsToShow(match)
                        const strToShow = this.createStrRefs(match)
                        material.pharmacology[key] = material.pharmacology[key].replaceAll(match, `<sub class="sub-font tooltip-sub">(${strToShow})</sub>`)
                    });
                }
            })
            return material
        },
        addSubRefsDrug(material){
            material.dBankRefs.unshift({citation: 'FDA Label', url: material.fdaLabel, ref_id: 'Label'},
                                        {citation: 'FDA Label', url: material.fdaLabel, ref_id: 'label'},
                                        {citation: 'FDA Label', url: material.fdaLabel, ref_id: 'FDA label'} 
                                        )
            this.fieldsToCheckDrug.forEach(key => {
                material[key] = material[key].replaceAll('<sub>', '')
                material[key] = material[key].replaceAll('</sub>', '')
                material[key] = material[key].replaceAll('<sup>', '')
                material[key] = material[key].replaceAll('</sup>', '')
                material[key] = this.removeUnderLines(material[key])
                const regex = /\[(.*?)\]/g;
                const matches = material[key].match(regex);
                if(matches){
                    matches.forEach(match => {
                        const matchToShow = match.substring(1,match.length-1)
                        let splited = matchToShow.split(',')
                        const dBandRefRegex = new RegExp(/[A-Z][0-9]+/g);
                        const isShowAsSub = splited.some(str => str === 'label' || str === 'Label' || str === 'FDA label' || dBandRefRegex.test(str))
                        if(!isShowAsSub) material[key] = material[key].replaceAll(match, splited.join(' '))
                        else {
                            let strToShow = ''
                            splited.forEach(str => {
                                str = str.trim()
                                if(!this.refCountMap[str]) {
                                    this.refCountMap[str] = this.nextRefNum
                                    this.nextRefNum++
                                }
                                strToShow = strToShow ? strToShow + ',' + this.refCountMap[str] : this.refCountMap[str]
                            })
                            material[key] = material[key].replaceAll(`.${match}`, ` ${match}.`)
                            material[key] = material[key].replaceAll(match, `<sub class="sub-font">(${strToShow})</sub>`)
                        }
                    })
                }
            })
            this.fieldsToCheckPharmacology.forEach(key => {
                material.pharmacology[key] = material.pharmacology[key].replaceAll('<sub>', '')
                material.pharmacology[key] = material.pharmacology[key].replaceAll('</sub>', '')
                material.pharmacology[key] = material.pharmacology[key].replaceAll('<sup>', '')
                material.pharmacology[key] = material.pharmacology[key].replaceAll('</sup>', '')
                material.pharmacology[key] = this.removeUnderLines(material.pharmacology[key])
                material.pharmacology[key] = this.addSubHeaders(material.pharmacology, key, true)
                const regex = /\[(.*?)\]/g;
                const matches = material.pharmacology[key].match(regex);
                if(matches){
                    matches.forEach(match => {
                        const matchToShow = match.substring(1,match.length-1)
                        let splited = matchToShow.split(',')
                        const dBandRefRegex = new RegExp(/[A-Z][0-9]+/g);
                        const isShowAsSub = splited.some(str => str === 'label' || str === 'Label' || str === 'FDA label' || dBandRefRegex.test(str))
                        if(!isShowAsSub) material.pharmacology[key] = material.pharmacology[key].replaceAll(match, splited.join(' '))
                        else {
                            let strToShow = ''
                            splited.forEach(str => {
                                str = str.trim()
                                if(!this.refCountMap[str]) {
                                    this.refCountMap[str] = this.nextRefNum
                                    this.nextRefNum++
                                }
                                strToShow = strToShow ? strToShow + ',' + this.refCountMap[str] : this.refCountMap[str]
                            })
                            material.pharmacology[key] = material.pharmacology[key].replaceAll(`.${match}`, ` ${match}.`)
                            material.pharmacology[key] = material.pharmacology[key].replaceAll(match, `<sub class="sub-font">(${strToShow})</sub>`)
                        }
                    })
                }
            })
            return material
        },
        organizeRefs(material){
            if(material.type !== 'drug'){
                material = this.addSubRefsSupp(material)
            }else{
                material = this.addSubRefsDrug(material)
            }
            return material
        },
        createStrRefs(refsStr){
            let refs = refsStr.substring(1, refsStr.length-1).split(',')
            let strToReturn = ''
            refs.forEach(ref => {
                if(!ref.includes('-')){
                    strToReturn = strToReturn ? strToReturn  + ',' + this.refCountMap[ref] : this.refCountMap[ref] + ''
                }else{
                    let firstRef = ref.split('-')[0]
                    let LastRef = ref.split('-')[1]
                    const correctStr = this.refCountMap[firstRef] + '-' + this.refCountMap[LastRef]
                    strToReturn = strToReturn ? strToReturn  + ',' + correctStr : correctStr 
                }
            })
            return strToReturn

        },
        savePageHight(){
            materialUIService.setMaterialPageHightMap({name: this.material.name, hight: window.pageYOffset})
        }
    },
    computed:{
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        aliasesToShow(){
            const { material } = this
            if(material.aliases.length && material.dBankAliases.length){
                const allAliases = material.dBankAliases.concat(material.aliases)
                const aliasesToReturn =  [...new Set(allAliases)].sort((a,b) => {
                    if(a.toLowerCase() < b.toLowerCase()) return -1
                    if(a.toLowerCase() > b.toLowerCase()) return 1
                    return 0
                })
                return aliasesToReturn
            }
            return material.aliases.length ? material.aliases.sort() : material.dBankAliases.sort()
        },
        refsToShow(){
            const refsCopy = JSON.parse(JSON.stringify(this.material.refs))
            const refsToShow = refsCopy.filter(ref => this.refCountMap[ref.draftIdx])
            refsToShow.forEach(ref => {
                ref.draftIdx = this.refCountMap[ref.draftIdx]
            })
            refsToShow.sort((a,b) => {
                if(a.draftIdx > b.draftIdx) return 1
                if(a.draftIdx < b.draftIdx) return -1
                return 0
            })
            return refsToShow
        },
        dBankRefsToShow(){
            const refsCopy = JSON.parse(JSON.stringify(this.material.dBankRefs))
            const refsToShow = refsCopy.filter(ref => this.refCountMap[ref.ref_id])
            refsToShow.forEach(ref => {
                ref.ref_id = this.refCountMap[ref.ref_id]
            })
            refsToShow.sort((a,b) => {
                if(a.ref_id > b.ref_id) return 1
                if(a.ref_id < b.ref_id) return -1
                return 0
            })
            return refsToShow
        }
    },
    async created(){
        const { id } = this.$route.params;
        const material = await this.$store.dispatch({type: 'loadMaterial',matId: id });
        if(!material.isShowPage) return this.$router.push('/404')
        const materialWithRefs = await this.organizeRefs(material)
        this.material = materialWithRefs
        this.isLoading = false
        document.addEventListener('scroll', this.savePageHight)
        const nameHightMap = materialUIService.getMaterialPageHightMap()
        if(nameHightMap && nameHightMap[this.material.name]){
            this.$nextTick(() => {
                window.scrollTo(0, nameHightMap[this.material.name])
            })
        }
    },
    beforeDestroy(){
        document.removeEventListener('scroll', this.savePageHight)
    },
    components:{
        MenuIcon,
        ArrowLeftIcon,
        Loader,
        ShareModal,
        ModalWrap,
        MobileShareIcon,
        ShareVariantIcon
    }
};
</script>
