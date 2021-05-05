<template>
    <section class="side2-pathways">
        <div
            class="side2-pathways-row"
            v-for="({ name, pathways }, index) in formatedPathways"
            :key="index"
        >
            <span class="font-medium font-capitalize">{{ name }}: </span>
                <span
                    class="pathway"
                    v-for="(pathway, idx) in pathways"
                    :key="idx"
                    v-refs-tooltip.pathwaysFirst="{
                        combinedRefs,
                        side2Refs
                    }"
                >
                    <span>{{ idx === 0 ? '' : ', ' }} </span>
                    <tooltip bottom-left>
                        <span class="font-uppercase">{{ pathway.name }}</span>
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
        </div>
    </section>
</template>

<script>
import Tooltip from '@/client/cmps/common/Tooltip';

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
        }
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
            );
        },
        transporterPathways() {
            return this.side2Pathways.filter(
                pathway => pathway.type === 'transporter' &&
                (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))
            );
        },
        carrierPathways() {
            return this.side2Pathways.filter(
                pathway => pathway.type === 'carrier' && 
                (!pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor'))
            );
        }
    },
    methods: {
        getMaterialRefNums(pubmedIds) {
            if (!this.side2Refs.length || !pubmedIds.length) return '';
            if (pubmedIds.length === 1) {
                const field = (typeof pubmedIds[0] === 'number') ? 'pubmedId' : 'link';
                const refIdx  = this.combinedRefs.findIndex(ref => pubmedIds.includes(ref[field]));
                return `(${refIdx + 1})`;
            }
            let refsStr = '';
            for (let i = 0; i < pubmedIds.length; i++) {
                const field = (typeof pubmedIds[i] === 'number') ? 'pubmedId' : 'link';
                const idx = this.combinedRefs.findIndex(ref => pubmedIds[i] === ref[field]);
                refsStr += (idx + 1) + ', ';
            }
            return `(${refsStr.split(', ').filter(str => str).sort((a, b) => a - b).join(', ')})`;
        }
    },
    components: {
        Tooltip
    }
}
</script>