<template>
    <section class="interaction-details">
        <header class="interaction-details-header">
            <div class="main-container">
                <div class="flex-space-between">
                    <span class="interaction-details-header-link">
                        <button class="flex-align-center" @click="$router.go(-1)">
                            <chevron-left-icon />
                            Back to search
                        </button>
                    </span>
                    <span class="interaction-details-header-actions">
                        <button
                            class="print-btn"
                            title="Print"
                        >
                            <printer-icon />
                        </button>
                        <button
                            class="share-btn"
                            title="Share"
                        >
                            <share-icon />
                        </button>
                    </span>
                </div>
            </div>
        </header>
        <article class="interaction-details-content">
            <div class="main-container">
                <header class="flex-space-between">
                    <interaction-capsules
                        :name="interactionName"
                        :color="interactionColor"
                        :vInteractionCount="0"
                        :localize="false"
                        :showDraftName="false"
                        on-details-page
                    />
                    <span
                        class="recommendation-capsule"
                        :style="{ 'background-color': interactionColor }"
                    >
                        {{ this.interaction ? this.interaction.recommendation : '' }}
                    </span>
                    <span class="evidence-level">

                    </span>
                </header>
            </div>
        </article>
    </section>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';

import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft';
import PrinterIcon from 'vue-material-design-icons/Printer';
import ShareIcon from 'vue-material-design-icons/Share';

export default {
    data() {
        return {
            interaction: null,
            side2Material: null,
            isLoading: false
        }
    },
    watch: {
        '$route.params': {
            handler() {
                this.getInteraction();
            },
            immediate: true
        }
    },
    computed: {
        isVirtual() {
            return !!this.$route.params.matId;
        },
        interactionColor() {
            if (!this.interaction) return '';
            return interactionService.getInteractionColor(this.interaction.recommendation);
        },
        interactionName() {
            if (!this.interaction) return '';
            if (this.isVirtual) return `${this.interaction.side1Material.name} & ${this.side2Material.name}`;
            return `${this.interaction.side1Material.name} & ${this.interaction.side2Material.name}`;
        }
    },
    methods: {
        async getInteraction() {
            this.isLoading = true;
            const { id, matId } = this.$route.params;
            if (!this.isVirtual) {
                const interaction = await this.$store.dispatch({ type: 'loadInteraction', id });
                this.interaction = interaction;
            } else {
                const [ interaction, material ] = await Promise.all([
                    this.$store.dispatch({ type: 'loadInteraction', id }),
                    this.$store.dispatch({ type: 'loadMaterial', matId })
                ]);
                this.interaction = interaction;
                this.side2Material = material;
            }
            ///~~ set side2 pathway refs and if is virtual - fetch side1Material pathways & refs
            this.isLoading = false;
        }
    },
    components: {
        ChevronLeftIcon,
        PrinterIcon,
        ShareIcon,
        InteractionCapsules
    }
}
</script>