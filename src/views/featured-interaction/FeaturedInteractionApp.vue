<template>
    <section class="featured-interaction-app">
        <div class="container">
            <v-card class="mb-10">
                <v-card-title>
                    <h2>
                        Interaction workshop
                        <v-card-subtitle class="pa-0">featured interaction collection</v-card-subtitle>
                    </h2>
                </v-card-title>
                <featured-interaction-list />
            </v-card>
            <icons-map />
        </div>
    </section>
</template>

<script>
import featuredInteractionList from '@/cmps/featured-interaction/FeaturedInteractionList';
import iconsMap from '@/cmps/general/IconsMap';

export default {
    data() {
        return {
            isLoading: false
        }
    },
    watch: {
        '$route.query': {
            handler() {
                this.loadFeaturedInteractions();
            },
            immediate: true
        }
    },
    computed: {
        featuredInteractions() {
            return this.$store.getters.featuredInteractions;
        },
        totalItems() {
            return this.$store.getters.featuredInteractionCount;
        }
    },
    methods: {
        async loadFeaturedInteractions() {
            this.isLoading = true;
            const filterBy = this.$route.query;
            await this.$store.dispatch({ type: 'loadFeaturedInteractions', filterBy });
            console.log(this.featuredInteractions);
            this.isLoading = false;
        }
    },
    components: {
        iconsMap,
        featuredInteractionList
    }
}
</script>