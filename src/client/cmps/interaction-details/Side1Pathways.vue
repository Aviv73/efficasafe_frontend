<template>
    <section class="side1-pathways">
        <div v-if="summary">
            <h3 class="font-medium">Summary</h3>
            <p
                class="paragraph"
                v-html="formatRefs(summaryWithRefs, true)"
                v-refs-tooltip.pathwaysSecond="{
                    combinedRefs,
                    side2Refs
                }"
            />
        </div>
        <h3 class="font-medium">Details</h3>
        <ul
            v-if="pathways.length"
            class="side1-pathways-nav flex-align-center"
        >
            <li
                class="side1-pathways-nav-item"
                v-for="pathway in pathways"
                :key="pathway.name"
            >
                <button
                    class="chip"
                    :class="setPathwayClassName(pathway.influence)"
                    @click="activeTab = pathway.name"
                >
                    <chevron-down-icon v-if="activeTab !== pathway.name" :size="16" />
                    <chevron-up-icon v-else :size="16" />
                    {{ pathway.name }}
                </button>
            </li>
            <li class="d-flex">
                <span
                    class="un-relevant clip-txt"
                    v-if="unrelevantPathways.length"
                >
                    There is no info on {{ `${materialName}'s` }} effect on: {{ unrelevantPathwayNames }}
                </span>
            </li>
        </ul>
            <p
                class="active-tab-txt"
                v-show="pathways.length"
                v-html="formatRefs(activeTabTxt, true)"
                v-refs-tooltip.pathwaysSecond.dynamicTxt="{
                    combinedRefs,
                    side2Refs
                }"
            />
    </section>
</template>

<script>
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';

export default {
    props: {
        summary: {
            type: String,
            default: ''
        },
        pathways: {
            type: Array,
            required: true
        },
        materialName: {
            type: String,
            required: true
        },
        unrelevantPathways: {
            type: Array,
            default: () => []
        },
        formatRefs: {
            type: Function,
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
    data() {
        return {
            activeTab: (this.pathways.length) ? this.pathways[0].name : ''
        }
    },
    computed: {
        unrelevantPathwayNames() {
            return this.unrelevantPathways.map(p => p.name.toUpperCase()).join(', ');
        },
        activeTabTxt() {
            const pathway = this.pathways.find(p => p.name === this.activeTab);
            return pathway ? pathway.influence : '';
        },
        summaryWithRefs() {
            return this.formatMaterialRefs(this.summary);
        }
    },
    methods: {
        formatMaterialRefs(txt) {
            const regex = /\(([\d- ,\d]+)\)|<sub>\(([\d- ,\d]+)\)<\/sub>/g;
            const matches = txt.match(regex);
            if (matches) {
                let lastidx = 0;
                matches.forEach(match => {
                    if (this.isRefStr(match)) {
                        const idx = txt.indexOf(match, lastidx);
                        if (idx < 0) return;
                        lastidx = idx + 6;
                        txt = txt.slice(0, idx) + txt.slice(idx).replace(match, `<sub>${match}</sub>`);
                    }
                });
            }
            return txt;
        },
        isRefStr(refStr) {
            let doReturn = true;
            let formatted = refStr.replaceAll(/[-,()]/g, '__');
            formatted = formatted.split('__').filter(idxStr => +idxStr);
            formatted.forEach(numStr => {
                if (numStr.length >= 4) doReturn = false;
            });
            return doReturn;
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
        }
    },
    components: {
        ChevronUpIcon,
        ChevronDownIcon
    }
}
</script>