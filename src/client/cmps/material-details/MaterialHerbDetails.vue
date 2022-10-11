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
                <a @click="goTo('Interactions')">Interactions</a>
                <a v-if="material.plantPartUsed" @click="goTo('Plant part used')">Plant part used</a>
                <a v-if="material.qualities && material.qualities.length" @click="goTo('Qualities')">Qualities</a>
                <a v-if="material.activeConstituents" @click="goTo('Active constituents')">Active constituents</a>
                <a v-if="material.medicinalActions && material.medicinalActions.length" @click="goTo('Medicinal actions')">Medicinal actions</a>
                <a v-if="(material.indications && material.indications.length) || material.medicinalUsesTxt" @click="goTo('Medicinal uses')">Medicinal uses</a>
                <a v-if="material.dosage" @click="goTo('Dosage')">Dosage</a>
                <a v-if="material.sensitivities" @click="goTo('Sensitivities')">Sensitivities</a>
                <a v-if="material.adverseReactions" @click="goTo('Adverse reactions')">Adverse reactions</a>
                <a v-if="material.overdosage" @click="goTo('Overdosage')">Overdosage</a>
                <a v-if="material.precautions" @click="goTo('Warnings and precautions')">Warnings and precautions</a>
                <a v-if="material.contraindications" @click="goTo('Contraindications')">Contraindications</a>
                <a v-if="material.toxicity" @click="goTo('Toxicology1')">Toxicology</a>
                <a v-if="material.pregnancy" @click="goTo('Pregnancy')">Pregnancy</a>
                <a v-if="material.lactation" @click="goTo('Lactation')">Lactation</a>
                <a v-if="material.effectOnDrugMetabolism" @click="goTo('Effect On Drug Metabolism')">Effect on drug metabolism</a>
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
            <p class="material-details-content-family" v-if="material.BotanicalFamily || material.botanicalFamily">botanical family: {{material.BotanicalFamily || material.botanicalFamily || 'Not indicated'}}</p>
            <div v-if="aliasesToShow.length" class="material-details-content-aliases-container">
                <p v-for="alias in aliasesToShow" :key="alias">{{alias}}</p>
            </div>
            <hr class="line">
            <section v-if="material.desc" class="material-details-content-section">
                <h3 ref="Background">Background</h3>
                <p v-html="material.desc" v-refs-tooltip-material="{material,refCountMap}"></p>
                <hr class="line">
            </section>
            <section class="material-details-content-section">
                <h3 ref="Interactions">Interactions</h3>
                    <router-link :to="`/search?q=${originalMaterial.name}`" target="_blank" class="fda-link font14">
                        click here to see all of the interactions
                    </router-link>
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
                <p v-html="material.activeConstituents" v-refs-tooltip-material="{material,refCountMap}"></p>
                <hr class="line">
            </section>
            <section v-if="material.medicinalActions && material.medicinalActions.length" class="material-details-content-section">
                <h3 ref="Medicinal actions">Medicinal actions</h3>
                <p>{{material.medicinalActions.join(', ')}}</p>
                <hr class="line">
            </section>
            <section v-if="(material.indications && material.indications.length) || material.medicinalUsesTxt" class="material-details-content-section">
                <h3 ref="Medicinal uses">Medicinal uses</h3>
                <p v-if="material.indications && material.indications.length">{{material.indications.join(', ')}}</p>
                <br/>
                <p v-if="material.medicinalUsesTxt" v-html="material.medicinalUsesTxt" v-refs-tooltip-material="{material,refCountMap}"></p>
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
            <section v-if="material.effectOnDrugMetabolism" class="material-details-content-section">
                <h3 ref="Effect On Drug Metabolism">Effect On Drug Metabolism</h3>
                <p v-html="material.effectOnDrugMetabolism" v-refs-tooltip-material="{material,refCountMap}"></p>

                <div class="details-container">
                    <h3 class="font-medium regular-pointer">Details</h3>
                    <tooltip on="hover" topRightCorner>
                        <template #content>
                            <section class="pathways-tooltip-container">
                                <div class="tip">
                                    <p>A <span class="green bold">green</span> marking means that <span class="underline">clinical studies</span> have shown no effect</p>
                                    <p>of the supplement on the pathway.</p>
                                </div>
                                <div class="tip">
                                    <p>A <span class="red bold">red</span> marking means that <span class="underline">clinical studies</span> have shown that the </p>
                                    <p>supplement inhibits or induces the pathway.</p>
                                </div>
                                <div class="tip">
                                    <p>A <span class="yellow bold">yellow</span> marking means that there are only <span class="underline">pre-clinical</span> studies</p>
                                    <p>and the effect of the supplement on the pathway is unclear.</p>
                                </div>
                            </section>
                        </template>
                        <information-outline-icon
                            class="info-icon"
                            :size="16"
                            title=""
                        />
                    </tooltip>
                </div>

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
                <p class="pathway-exp-txt">{{pathwayExpTxt}}</p>
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
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

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
            filedToSkip:['pathways','detailedPharmacology'],
            refNumsToShow:[],
            fieldsToCheckSupp:['desc','activeConstituents','medicinalUsesTxt','dosage','sensitivities','adverseReactions','overdosage','precautions','contraindications','toxicity','pregnancy','lactation', 'effectOnDrugMetabolism'],
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
        organizeRefs(material){
            material = this.addSubRefsSupp(material)
            return material
        },
        addSubRefsSupp(material){
            const regex = /\(([\d- ,\d]+)\)/g;
            this.fieldsToCheckSupp.forEach(key => {
                if(this.filedToSkip.includes(key)) return
                if (!material[key]) return;
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
    },
    computed:{
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        isScreenMobile() {
            return this.$store.getters.isScreenNarrow;
        },
        pathwayExpTxt(){
            return `* ${this.isScreenMobile ? 'Click' : 'Hover'} on each capsule to see more info.`
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
        Tooltip,
        InformationOutlineIcon
    }
};
</script>
