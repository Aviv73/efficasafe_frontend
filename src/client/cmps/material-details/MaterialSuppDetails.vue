<template>
    <section style="width: 100%">
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
                <a v-if="material.desc" @click="goTo('Background')">Background</a>
                <a v-if="material.nutritionalSources" @click="goTo('Nutritional sources')">Nutritional sources</a>
                <a v-if="material.medicinalActions && material.medicinalActions.length" @click="goTo('Medicinal actions')">Medicinal actions</a>
                <a v-if="(material.indications && material.indications.length) || material.medicinalUsesTxt" @click="goTo('Medicinal uses')">Medicinal uses</a>
                <!-- <a v-if="(material.indications && material.indications.length) || (material.dBankIndications && material.dBankIndications.length)" @click="goTo('Medicinal uses')">Medicinal uses</a> -->
                <a v-if="material.absorptionAndExcretion" @click="goTo('Absorption and excretion')">Absorption and excretion</a>
                <a v-if="material.causesOfDeficiency" @click="goTo('Causes of deficiency')">Causes of deficiency</a>
                <a v-if="material.symptomsOfDeficiency" @click="goTo('Symptoms of deficiency')">Symptoms of deficiency</a>
                <a v-if="material.RDA" @click="goTo('Recommended Daily Allowance')">Recommended Daily Allowance</a>
                <a v-if="material.dosage" @click="goTo('Dosage')">Dosage</a>
                <a v-if="material.sensitivities" @click="goTo('Sensitivities')">Sensitivities</a>
                <a v-if="material.adverseReactions" @click="goTo('Adverse reactions')">Adverse reactions</a>
                <a v-if="material.overdosage" @click="goTo('Overdosage')">Overdosage</a>
                <a v-if="material.precautions" @click="goTo('Warnings and precautions')">Warnings and precautions</a>
                <a v-if="material.contraindications" @click="goTo('Contraindications')">Contraindications</a>
                <a v-if="material.toxicity" @click="goTo('Toxicology1')">Toxicology</a>
                <a v-if="material.pregnancy" @click="goTo('Pregnancy')">Pregnancy</a>
                <a v-if="material.lactation" @click="goTo('Lactation')">Lactation</a>
                <a v-if="material.mechanismOfAction" @click="goTo('Mechanism Of Action')">Mechanism Of Action</a>
                <a v-if="material.effectOnDrugMetabolism" @click="goTo('Effect On Drug Metabolism')">Effect on drug metabolism</a>
                <a @click="goTo('Interactions')">Interactions</a>
                <a v-if="refsToShow.length" @click="goTo('References')">References</a>
            </section>
        </aside>
        <main v-if="material" class="material-details-content">
            <button
                class="material-details-content-share-btn"
                @click="$emit('openShareModal')"
            >
                <mobile-share-icon v-if="isScreenNarrow" title="" />
                <share-variant-icon v-else title="" />
            </button>
            <button class="drawer-btn" @click="showNav = true" v-if="isScreenNarrow"><menu-icon title="" /></button>
            <h1 ref="Title" class="material-details-content-name">{{material.name}}</h1>
            <div v-if="aliasesToShow.length" class="material-details-content-aliases-container">
                <p v-for="alias in aliasesToShow" :key="alias">{{alias}}</p>
            </div>
            <hr class="line">
            <section v-if="material.desc" class="material-details-content-section">
                <h3 ref="Background">Background</h3>
                <p v-html="material.desc" v-refs-tooltip-material="{material,refCountMap}"></p>
                <hr class="line">
            </section>
            <section v-if="material.nutritionalSources" class="material-details-content-section">
                <h3 ref="Nutritional sources">Nutritional sources</h3>
                <p v-html="material.nutritionalSources" v-refs-tooltip-material="{material,refCountMap}"></p>
                <hr class="line">
            </section>
            <section v-if="material.medicinalActions && material.medicinalActions.length" class="material-details-content-section">
                <h3 ref="Medicinal actions">Medicinal actions</h3>
                <p>{{material.medicinalActions.join(', ')}}</p>
                <hr class="line">
            </section>
            <section v-if="material.indications && material.indications.length" class="material-details-content-section">
                <h3 ref="Medicinal uses">Medicinal uses</h3>
                <p>{{material.indications.join(', ')}}</p>
                <hr class="line">
            </section>
            <section v-else-if="material.medicinalUsesTxt" class="material-details-content-section">
                <h3 ref="Medicinal uses">Medicinal uses</h3>
                <p v-html="material.medicinalUsesTxt" v-refs-tooltip-material="{material,refCountMap}"></p>
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
            <section v-if="material.RDA" class="material-details-content-section">
                <h3 ref="Recommended Daily Allowance">Recommended Daily Allowance</h3>
                <p v-html="material.RDA" v-refs-tooltip-material="{material,refCountMap}"></p>
                <hr class="line">
            </section>
            <section v-if="material.dosage" class="material-details-content-section">
                <h3 ref="Dosage">Dosage</h3>
                <p v-html="material.dosage" v-refs-tooltip-material="{material,refCountMap}"></p>
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
            <section v-if="material.mechanismOfAction" class="material-details-content-section">
                <h3 ref="Mechanism Of Action">Mechanism Of Action</h3>
                <p v-html="material.mechanismOfAction" v-refs-tooltip-material="{material,refCountMap}"></p>
                <hr class="line">
            </section>
            <section v-if="material.effectOnDrugMetabolism" class="material-details-content-section">
                <h3 ref="Effect On Drug Metabolism">Effect On Drug Metabolism</h3>
                <p v-html="material.effectOnDrugMetabolism" v-refs-tooltip-material="{material,refCountMap}"></p>
                <ul class="side1-pathways-nav flex-align-center chip-list">
                    <li
                        class="side1-pathways-nav-item material-details-item"
                        v-for="pathway in material.pathways"
                        :key="pathway.name"
                    >
                        <tooltip on="hover" bottom>
                            <template #content>
                                <section class="pathways-tooltip" v-html="pathway.influence">
                                </section>
                            </template>
                            <div
                                    class="chip material-details-chip"
                                    :class="setPathwayClassName(pathway.influence)"
                                >
                                    {{ pathway.name }}
                                </div>
                        </tooltip>
                    </li>
                </ul>
                <hr class="line">
            </section>
            <section class="material-details-content-section">
                <h3 ref="Interactions">Interactions</h3>
                    <router-link :to="`/search?q=${originalMaterial.name}`" target="_blank" class="fda-link font14">
                        click here to see all of the interactions
                    </router-link>
                <hr class="line">
            </section>
            <section v-if="refsToShow.length" class="material-details-content-refs">
                <h4 ref="References">References</h4>
                <div v-for="ref in refsToShow" :key="ref.draftIdx" class="ref-container">
                    <p class="ref-idx">{{ref.draftIdx}}</p>
                    <div class="txt-container">
                        <p class="txt">{{ref.txt}}</p>
                        <a v-if="ref.link" class="link clip-txt" target="_blank" :href="ref.link">{{ref.link}}</a>
                    </div>
                </div>
            </section>
        </main>
    </section>
</template>

<script>

import { materialUIService } from '@/cms/services/material-ui.service'

import MenuIcon from 'vue-material-design-icons/Menu';
import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft';
import MobileShareIcon from '@/client/cmps/common/icons/MobileShareIcon';
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';
import Tooltip from '@/client/cmps/common/Tooltip';


export default {
    props: {
        originalMaterial: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            material: null,
            showNav: false,
            refCountMap:{},
            nextRefNum: 1,
            // filedToSkip:['pathways','effectOnDrugMetabolism','detailedPharmacology'],
            filedToSkip:['pathways','detailedPharmacology'],
            refNumsToShow:[],
            fieldsToCheckSupp:['desc','nutritionalSources','medicinalUsesTxt','absorptionAndExcretion','causesOfDeficiency','symptomsOfDeficiency','RDA','dosage','sensitivities','adverseReactions','overdosage','precautions','contraindications','toxicity','pregnancy','lactation', 'mechanismOfAction', 'effectOnDrugMetabolism']
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
                if(!material[key]) return
                if(this.filedToSkip.includes(key)) return
                material = this.addSubHeaders(material, key)
                const matches = material[key].match(regex);
                if(matches){
                    matches.forEach(match => {
                        this.setRefNumsToShow(match)
                        let strToShow = this.createStrRefs(match)
                        if(key === 'effectOnDrugMetabolism'){
                            const refArr = strToShow.split(',')
                            strToShow = this.minimizeRefs(refArr)
                        }
                        material[key] = material[key].replaceAll(match,`<sub class="sub-font tooltip-sub">(${strToShow})</sub>`)
                    });
                }
            })
            return material
        },
        organizeRefs(material){
            material = this.addSubRefsSupp(material)
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
        minimizeRefs(refs){
            let refsStr = '';
            let isSequence = false;
            for (let i = 0; i < refs.length; i++) {
                if (refs[i - 1] === undefined) refsStr += refs[i];

                if (Math.abs(refs[i] - refs[i - 1]) > 1) {
                    if (isSequence) refsStr += '-' + (refs[i - 1]);
                    refsStr += ',' + refs[i];
                    isSequence = false;
                } else if (Math.abs(refs[i] - refs[i - 1]) === 1) isSequence = true;

                if (i === (refs.length - 1) && refs[i - 1] !== undefined && isSequence) {
                    refsStr += '-' + refs[i];
                }
            }
            return refsStr
        },
        setPathwayClassName(influence) {
            let firstLine = influence.split('</p>')[0];
            if (!firstLine) return '';
            firstLine = firstLine.toLowerCase();

            if (firstLine.includes('may induce') || firstLine.includes('may inhibit') || firstLine.includes('may bind')) {
                return 'chip-red';
            } else if (firstLine.includes('is unclear')) {
                return 'chip-yellow';
            } else if (firstLine.includes('not likely to affect')) {
                return 'chip-green';
            }

            return 'default';
        },
        savePageHight(){
            materialUIService.setMaterialPageHightMap({name: this.material.name, hight: window.pageYOffset})
        },
    },
    computed:{
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        isNotAllowedSelect() {
            if(!this.$store.getters.loggedInUser) return true
            return !this.$store.getters.loggedInUser.isAllowedToSelectTxt;
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
    },
    async created(){
        const materialWithRefs = await this.organizeRefs(this.originalMaterial)
        this.material = materialWithRefs
        const nameHightMap = materialUIService.getMaterialPageHightMap()
        if(nameHightMap && nameHightMap[this.material.name]){
            this.$nextTick(() => {
                window.scrollTo(0, nameHightMap[this.material.name])
            })
        }
    },
    components:{
        MenuIcon,
        ArrowLeftIcon,
        MobileShareIcon,
        ShareVariantIcon,
        Tooltip
    }
};
</script>
