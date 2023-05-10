<template>
    <section class="side2-pathways">
        <p class="side2-pathways-header regular-pointer">
            {{ materialName }} is metabolized by:
        </p>
        <div
            class="side2-pathways-row"
            v-for="({ name, pathways }, index) in formatedPathways"
            :key="index"
        >
            <span class="font-medium font-capitalize blue regular-pointer">{{ name }}: </span>
            <span class="pathway" 
                v-for="(pathway, idx) in pathways" 
                :key="idx"
                v-refs-tooltip.asGiven="{
                    combinedRefs,
                    side2Refs,
                    refNums: getMaterialRefNums(pathway.references, true)
                }"
            >
                <span>{{ idx === 0 ? '' : ',' }} </span>
                <span data-app :class="`enzyme-${name}-${idx}`" class="font-uppercase">{{ pathway.name + '\xa0' }}</span>
                <v-tooltip bottom :activator="`.enzyme-${name}-${idx}`">
                    <div v-if="pathway.fullName">{{ pathway.fullName }}</div>
                    <span class="text-capitalize" v-if="pathway.actions.length">
                        {{ pathway.actions.join(', ') }} 
                    </span>
                    <p v-if="!pathway.fullName && !pathway.actions.length" class="ma-0">No additional info :(</p>
                </v-tooltip>
                <sub :refNums="getMaterialRefNums(pathway.references)">{{ getMaterialRefNums(pathway.references) }}</sub>
            </span>
        </div>
        <!-- <div
            class="side2-pathways-row"
            v-for="({ name, pathways }, index) in formatedPathways"
            :key="index"
        >
            <span class="font-medium font-capitalize blue regular-pointer">{{ name }}: </span>
            <span
                class="pathway"
                v-for="(pathway, idx) in pathways"
                :key="idx"
                v-refs-tooltip.asGiven="{
                    combinedRefs,
                    side2Refs
                }"
            >
                <span>{{ idx === 0 ? '' : ', ' }} </span>
                <tooltip bottom-left>
                    <span class="font-uppercase">{{ pathway.name + '\xa0' }}</span>
                    <template #content>
                        <div
                            class="pathway-tooltip"
                            v-if="pathway.fullName || pathway.actions.length"
                        >
                            <div v-if="pathway.fullName">{{ pathway.fullName }}</div>
                            <span class="font-capitalize" v-if="pathway.actions.length">
                                {{ pathway.actions.join(', ') }} 
                            </span>
                        </div>
                    </template>
                </tooltip>
                <sub>{{ getMaterialRefNums(pathway.references) }}</sub>
            </span>
        </div> -->
    </section>
</template>

<script>
// import Tooltip from '@/client/cmps/common/Tooltip';

export default {
    props: {
        side2Pathways: {
            type: Array,
            required: true
        },
        combinedRefs: {
            type: Array,
            required: true
        },
        side2Refs: {
            type: Array,
            required: true
        },
        materialName: {
            type: String,
            required: true
        },
        formatRefs: {
            type: Function,
            required: true
        },
    },
    computed: {
        formatedPathways() {
            const formatedPathways = [
                { name: 'enzymes', pathways: this.enzymePathways },
                { name: 'transporters', pathways: this.transporterPathways },
                { name: 'carriers', pathways: this.carrierPathways }
            ];
            return formatedPathways.filter(({ pathways }) => pathways.length);
        },
        enzymePathways() {
            return this.side2Pathways.filter(
                pathway => pathway.type === 'enzyme' &&
                (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))
            ).sort((a,b) => a.name > b.name? 1 : -1);
        },
        transporterPathways() {
            return this.side2Pathways.filter(
                pathway => pathway.type === 'transporter' &&
                (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))
            ).sort((a,b) => a.name > b.name? 1 : -1);
        },
        carrierPathways() {
            return this.side2Pathways.filter(
                pathway => pathway.type === 'carrier' && 
                (!pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor'))
            ).sort((a,b) => a.name > b.name? 1 : -1);
        }
    },
    methods: {
        getMaterialRefNums(pubmedIds, dontMinimize = false) {
            // return this.formatRefs()
            if (!this.side2Refs.length || !pubmedIds.length) return '';
            if (pubmedIds.length === 1) {
                const field = (typeof pubmedIds[0] === 'number') ? 'pubmedId' : 'link';
                const refIdx = this.combinedRefs.findIndex(ref => pubmedIds.includes(ref[field]));
                return `(${refIdx + 1})`;
            }
            let refsStr = '';
            for (let i = 0; i < pubmedIds.length; i++) {
                const field = (typeof pubmedIds[i] === 'number') ? 'pubmedId' : 'link';
                const idx = this.combinedRefs.filter(Boolean).findIndex(ref => pubmedIds[i] === ref?.[field]);
                refsStr += (idx + 1) + ', ';
            }
            const sortedRefs = refsStr.split(', ').filter(str => str).sort((a, b) => (+a) - (+b)).join(', ')
            const str = dontMinimize? sortedRefs : this.minimizeRefs(sortedRefs.split(', '))
            return `(${str})`;
        },
        // getMaterialRefNums(pubmedIds) {
        //     if (!this.side2Refs.length || !pubmedIds.length) return '';
        //     if (pubmedIds.length === 1) {
        //         const field = (typeof pubmedIds[0] === 'number') ? 'pubmedId' : 'link';
        //         const refIdx = this.combinedRefs.findIndex(ref => pubmedIds.includes(ref[field]));
        //         return `(${refIdx + 1})`;
        //     }
        //     let refsStr = '';
        //     for (let i = 0; i < pubmedIds.length; i++) {
        //         const field = (typeof pubmedIds[i] === 'number') ? 'pubmedId' : 'link';
        //         const idx = this.combinedRefs.findIndex(ref => pubmedIds[i] === ref[field]);
        //         refsStr += (idx + 1) + ', ';
        //     }
        //     return `(${refsStr.split(', ').filter(str => str).sort((a, b) => a - b).join(', ')})`;
        // },
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
    },
    components: {
        // Tooltip
    }
}
</script>