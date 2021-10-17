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
                <featured-interaction-filter 
                    @filter-changed="setFilter"
                />
                <featured-interaction-grouped-list 
                    :groups="featuredInteractionGroups" 
                    :groupCount="groupsCount" 
                    :isLoading="isLoading"
                    @sort-changed="setFilter"
                    @pagination-changed="setFilter"
                />
            </v-card>
            <icons-map />
        </div>
    </section>
</template>

<script>
import featuredInteractionGroupedList from '@/cms/cmps/featured-interaction/FeaturedInteractionGroupedList';
import featuredInteractionFilter from '@/cms/cmps/featured-interaction/FeaturedInteractionFilter';
import iconsMap from '@/cms/cmps/general/IconsMap';

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
        featuredInteractionGroups() {
            return this.$store.getters.featuredInteractionGroups;
        },
        groupsCount() {
            return this.$store.getters.featuredGroupsCount;
        },
        height(){
            return this.$store.getters.getHeight
        }
    },
    methods: {
        setFilter(filterBy) {
            const criteria = {
                ...this.$route.query,
                ...filterBy
            };
            if (criteria.side1Name) criteria.page = 0;
            const queryStr = '?' + new URLSearchParams(criteria).toString();
            this.$router.push(queryStr);
        },
        async loadFeaturedInteractions() {
            this.isLoading = true;
            const filterBy = this.$route.query;
            filterBy.isGroups = true;
            filterBy.sortBy = filterBy.sortBy || 'name';
            filterBy.isDesc = filterBy.isDesc || false;
            filterBy.limit = filterBy.limit || Number.MAX_SAFE_INTEGER;
            await this.$store.dispatch({ type: 'loadFeaturedInteractionGroups', filterBy });
            this.isLoading = false;
        }
    },
    mounted(){
        if(this.height){
            window.scrollTo(0, this.height);
        }
    },
    components: {
        featuredInteractionFilter,
        featuredInteractionGroupedList,
        iconsMap
    }
}
</script>