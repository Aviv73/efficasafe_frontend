<template>
    <div>
        <section class="d-bank-interaction-details" v-if="interaction">
            <div class="container">
                <header>
                    <v-btn color="primary" @click="$router.go(-1)">
                        <v-icon small left>mdi-arrow-left</v-icon>Back to Search
                    </v-btn>
                </header>
                <v-card class="d-bank-interaction-details-content px-3">
                    <v-card-title class="d-bank-interaction-details-content-title px-0">
                        {{ `${interaction.subject_drug.name} & ${interaction.affected_drug.name}` }}
                        <figure>
                            <img :src="require(`@/assets/drugbank.png`)" alt="DrugBank logo" />
                            <figcaption class="caption">powered by</figcaption>
                        </figure>
                    </v-card-title>

                    <div class="text-capitalize">Recommendation:</div>
                    <div v-recommendation-color>{{ interaction.recommendation }}</div>

                    <div class="text-capitalize">Severity:</div>
                    <div>{{ interaction.severity }}</div>

                    <div class="text-capitalize">Level of evidence:</div>
                    <div>{{ interaction.evidence_level }}</div>

                    <div class="text-capitalize">Summary:</div>
                    <p>{{ interaction.summary }}</p>

                    <div class="text-capitalize">Extended description:</div>
                    <p>{{ interaction.extended_description }}</p>

                    <div class="text-capitalize" v-if="interaction.management">Management:</div>
                    <p v-if="interaction.management">{{ interaction.management }}</p>

                    <pre>{{ copy }}</pre>
                </v-card>
            </div>
        </section>
        <entity-not-found v-if="isNotFound" entity="DrugBank interaction" />
    </div>
</template>

<script>
import { drugBankService } from '@/services/drug-bank.service';
import entityNotFound from '@/cmps/general/EntityNotFound';

export default {
    data() {
        return {
            interaction: null,
            isNotFound: false
        }
    },
    watch: {
        '$route.params.id'() {
            this.loadInteraction();
        }
    },
    computed: {
        interactionAction() {
            const action = this.interaction.action.split('_').join(' ');
            return action.charAt(0).toUpperCase() + action.slice(1);
        },
        copy() {
            const copy = JSON.parse(JSON.stringify(this.interaction));
            delete copy.subject_drug;
            delete copy.affected_drug;
            delete copy._id;
            delete copy.recommendation;
            delete copy.evidence_level;
            delete copy.severity;
            delete copy.summary;
            delete copy.management;
            delete copy.extended_description;
            delete copy.subject_dosage;
            delete copy.affected_dosage;
            delete copy.action;
            delete copy.subject_category;
            delete copy.affected_category;
            return copy
        }
    },
    methods: {
        async loadInteraction() {
            const id = this.$route.params.id;
            if (id) {
                this.interaction = await drugBankService.getInteraction(id);
                if (!this.interaction) {
                    this.isNotFound = true;
                }
            }

        }
    },
    created() {
        this.loadInteraction();
    },
    components: {
        entityNotFound
    }
}
</script>