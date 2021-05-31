<template>
    <section class="monitor-summary">
        <collapse>
            <template #header>
                <div class="interaction-preview-header table-row">
                    <span class="table-col">
                        What to monitor for all interactions
                    </span>
                    <span class="table-col" />
                    <span class="table-col">
                        <span
                            class="de-activator"
                        >
                            <chevron-up-icon class="opened" />
                            <chevron-down-icon class="closed" />
                        </span>
                    </span>
                </div>
            </template>
            <template #content>
                <div class="interaction-preview-content">
                    <ul class="monitor-summary-list">
                        <li v-if="generalTxt">
                            <span class="monitor-summary-list-header font-bold">General:</span>
                            {{ generalTxt | capitalize }}
                        </li>
                        <li v-if="labTestsTxt">
                            <span class="monitor-summary-list-header font-bold">Lab Tests:</span>
                            {{ labTestsTxt | capitalize }}
                        </li>
                        <li v-if="otherTestsTxt">
                            <span class="monitor-summary-list-header font-bold">Other Tests:</span>
                            {{ otherTestsTxt | capitalize }}
                        </li>
                        <li v-if="symptomsTxt">
                            <span class="monitor-summary-list-header font-bold">Symptoms:</span>
                            {{ symptomsTxt | capitalize }}
                        </li>
                    </ul>
                </div>
            </template>
            <template #de-activator>
                <img    
                    src="@/client/assets/icons/collapse-toggle.svg"
                    alt="Chevron up circle icon"
                />
            </template>
        </collapse>
    </section>
</template>

<script>
import Collapse from '@/client/cmps/common/Collapse';

import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';

export default {
    props: {
        interactions: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            flatInteractions: []
        }
    },
    computed: {
        generalTxt() {
            return this.getMonitorTxt('general');
        },
        labTestsTxt() {
            return this.getMonitorTxt('labTests');
        },
        otherTestsTxt() {
            return this.getMonitorTxt('otherTests');
        },
        symptomsTxt() {
            return this.getMonitorTxt('symptoms');
        }
    },
    methods: {
        flatten(interactions) {
            interactions.forEach(interaction => {
                if (interaction.vInteractions) {
                    this.flatten(interaction.vInteractions);
                } else this.flatInteractions.push(interaction);
            });
        },
        getMonitorTxt(propName) {
            return this.flatInteractions.map(i => {
                const secChar = i.monitor[propName].charAt(1);
                const val = (secChar !== secChar.toUpperCase()) ? i.monitor[propName].charAt(0).toLowerCase() + i.monitor[propName].slice(1) : i.monitor[propName];
                const lastChar = val.charAt(val.length - 1);
                return (lastChar === '.') ? val.substring(0, val.length - 1) : val;
            }).filter(str => str).join(', ');
        }
    },
    created() {
        this.flatten(this.interactions);
    },
    components: {
        Collapse,
        ChevronUpIcon,
        ChevronDownIcon
    }
}
</script>