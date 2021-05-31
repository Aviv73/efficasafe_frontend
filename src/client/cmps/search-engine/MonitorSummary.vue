<template>
    <section class="monitor-summary">
        <collapse>
            <template #header>
                <div class="interaction-preview-header table-row">
                    <span class="monitor-summary-header table-col">
                        <span class="capsule">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="cap cap-left"
                            viewBox="0 0 24.192 48.001"
                        >
                            <path 
                                fill="#b1b1b1"
                                d="M24.192,48h-.221A23.973,23.973,0,0,1,0,24,23.96,23.96,0,0,1,23.972,0h.221V4.132a21.046,21.046,0,0,0-6.841,1.532A20.58,20.58,0,0,0,10.8,9.929a19.82,19.82,0,0,0-4.414,6.326,19.338,19.338,0,0,0,0,15.492A19.81,19.81,0,0,0,10.8,38.071a20.585,20.585,0,0,0,6.548,4.265,21.043,21.043,0,0,0,6.841,1.532V48Z"
                                transform="translate(24.192 48.001) rotate(180)"
                            />
                        </svg>
                            What to monitor for all interactions
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="cap cap-right"
                            viewBox="0 0 24.192 48.001"
                        >
                            <path
                                fill="#b1b1b1"
                                d="M24.192,0h-.221A23.973,23.973,0,0,0,0,24,23.96,23.96,0,0,0,23.971,48h.221V43.869a21.046,21.046,0,0,1-6.841-1.532A20.58,20.58,0,0,1,10.8,38.072a19.82,19.82,0,0,1-4.414-6.326,19.338,19.338,0,0,1,0-15.492A19.81,19.81,0,0,1,10.8,9.93a20.585,20.585,0,0,1,6.548-4.265,21.042,21.042,0,0,1,6.841-1.532V0Z"
                            />
                        </svg>
                        </span>
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
            const seenMap = {};
            return this.flatInteractions.reduce((acc, { monitor }) => {
                let words = monitor[propName].split(',').filter(str => str).map(str =>str.trim());
                words = words.reduce((acc, word) => {
                    if (!seenMap[word]) {
                        const copy = word;
                        const secChar = word.charAt(1);
                        word = (secChar !== secChar.toUpperCase()) ? word.charAt(0).toLowerCase() + word.slice(1) : word;
                        const lastChar = word.charAt(word.length - 1);
                        word = (lastChar === '.') ? word.substring(0, word.length - 1) : word;
                        acc.push(word);
                        seenMap[copy] = true;
                    }
                    return acc;
                }, []);
                acc += (acc && words.join(', ')) ? ', ' + words.join(', ') : words.join(', ');
                return acc;
            }, '');
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