<template>
  <section class="featured-interaction-edit">
      <div class="container">
            <main v-if="!isLoading && editedInteraction">
                <v-card>
                    <header class="pa-4">
                        <v-card-title class="pa-0">
                            Edit featured interaction
                        </v-card-title>
                        <div class="featured-interaction-edit-switch">
                            <v-switch
                                class="ma-0"
                                v-model="editedInteraction.isActive"
                                :label="editedInteraction.isActive ? 'Active' : 'Not active'"
                                hide-details
                            />
                        </div>
                    </header>
                </v-card>
                <pre>{{ editedInteraction }}</pre>
            </main>
            <entity-not-found 
                entity="featured interaction"
                v-if="!isLoading && !editedInteraction"
            />
            <loader class="featured-interaction-edit-loader" v-if="isLoading" />
      </div>
  </section>
</template>

<script>
import loader from '@/cmps/general/LoadingCmp';
import entityNotFound from '@/cmps/general/EntityNotFound';

export default {
    data() {
        return {
            isLoading: false,
            editedInteraction: null
        }
    },
    methods: {
        async loadInteraction(id) {
            this.isLoading = true;
            const interaction = await this.$store.dispatch({ type: 'getFeaturedInteraction', id });
            this.editedInteraction = interaction;
            this.isLoading = false;
        }
    },
    created() {
        const { id } = this.$route.params;
        this.loadInteraction(id);
    },
    components: {
        loader,
        entityNotFound
    }
}
</script>