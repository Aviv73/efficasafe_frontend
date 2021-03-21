<template>
    <section>
        <div ref="pathways">
            <div v-if="enzymePathways.length" class="mb-4">
                <span class="font-weight-medium">
                  {{ side2Name }}
                </span>
                is metabolized by the enzymes:
                <span v-for="(pathway, idx) in enzymePathways" :key="idx">
                    <span>{{ idx === 0 ? '' : ',' }} </span>
                    <span :class="`text-uppercase pathway-name enzyme-${idx}`">{{ pathway.name }} </span>
                    <v-tooltip bottom :activator="`.enzyme-${idx}`">
                        <div v-if="pathway.fullName">{{ pathway.fullName }}</div>
                        <span class="text-capitalize" v-if="pathway.actions.length">
                            {{ pathway.actions.join(', ') }} 
                        </span>
                        <p v-if="!pathway.fullName && !pathway.actions.length" class="ma-0">No additional info :(</p>
                    </v-tooltip>
                    <sub>{{ getMaterialRefNums(pathway.references) }}</sub>
                </span>
            </div>
            <div v-if="transporterPathways.length" class="mb-4">
                <span class="font-weight-medium">
                  {{ side2Name }}
                </span>
                is metabolized by the transporters:
                <span v-for="(pathway, idx) in transporterPathways" :key="idx">
                    <span>{{ idx === 0 ? '' : ',' }} </span>
                    <span :class="`text-uppercase pathway-name transporter-${idx}`">{{ pathway.name }} </span>
                    <v-tooltip bottom :activator="`.transporter-${idx}`">
                        <div v-if="pathway.fullName">{{ pathway.fullName }}</div>
                        <span class="text-capitalize" v-if="pathway.actions.length">
                            {{ pathway.actions.join(', ') }} 
                        </span>
                        <p v-if="!pathway.fullName && !pathway.actions.length" class="ma-0">No additional info :(</p>
                    </v-tooltip>
                    <sub>{{ getMaterialRefNums(pathway.references) }}</sub>
                </span>
            </div>
            <div v-if="carrierPathways.length" class="mb-4">
                <span class="font-weight-medium">
                  {{ side2Name }}
                </span>
                is metabolized by the carriers:
                <span v-for="(pathway, idx) in carrierPathways" :key="idx">
                  <span>{{ idx === 0 ? '' : ',' }} </span>
                  <span :class="`text-uppercase pathway-name carrier-${idx}`">{{ pathway.name }} </span>
                  <v-tooltip bottom :activator="`.carrier-${idx}`">
                    <div v-if="pathway.fullName">{{ pathway.fullName }}</div>
                    <span class="text-capitalize" v-if="pathway.actions.length">
                        {{ pathway.actions.join(', ') }} 
                    </span>
                    <p v-if="!pathway.fullName && !pathway.actions.length" class="ma-0">No additional info :(</p>
                  </v-tooltip>
                  <sub>{{ getMaterialRefNums(pathway.references) }}</sub>
                </span>
            </div>
        </div>
        <div ref="pathways2" class="mt-12">
            <p class="mb-4" v-if="relevantSide1Pathways.length">
                <span class="font-weight-medium">{{ side1Name }}</span>
                effect on the enzymes:
                <span v-for="(pathway, idx) in relevantSide1Pathways" :key="idx">
                    <span>{{ idx === 0 ? '' : ',' }} </span>
                    <span class="text-uppercase">{{ pathway.name }}</span>
                </span>
            </p>
            <div v-for="(pathway, idx) in relevantSide1Pathways" :key="idx">
                <h6>{{ pathway.name }}</h6>
                <p 
                  class="mb-4"
                  v-highlight-text:[side2Name]
                  v-html="formatRefs(pathway.influence, true)"
                />
            </div>
            <div v-if="unRelevantSide2Pathways.length">
                <p>
                  There is no evidence regarding the effect of {{ side1Name }} on
                  <span v-for="(pathway, idx) in unRelevantSide2Pathways" :key="idx">{{ (idx === 0) ? '' : ', ' }}{{ pathway.name.toUpperCase() }}</span> activity.
                </p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        side1Pathways: {
            type: Array,
            required: true
        },
        side2Pathways: {
            type: Array,
            required: true
        },
        side1Name: {
            type: String,
            required: true
        },
        side2Name: {
            type: String,
            required: true
        },
        combinedRefs: {
            type: Array,
            required: true
        },
        relevantSide1Pathways: {
            type: Array,
            required: true
        },
        side1RefsLength: {
            type: Number,
            required: true
        },
        side2RefsLength: {
            type: Number,
            required: true
        },
        formatRefs: {
            type: Function,
            required: true
        }
    },
    computed: {
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
        },
        unRelevantSide2Pathways() {
            const side2Pathways = [ ...this.enzymePathways, ...this.transporterPathways, ...this.carrierPathways ];
            return side2Pathways.filter(pathway => {
                const idx = this.side1Pathways.findIndex(side1Pathway => side1Pathway.name.replace('CYP', '').toUpperCase() === pathway.name.replace('CYP', '').toUpperCase());
                return idx === -1;
            });
        }
    },
    methods: {
        getMaterialRefNums(pubmedIds) {
            if (!this.side1RefsLength || !this.side2RefsLength || !pubmedIds.length) return '';
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
    }
}
</script>