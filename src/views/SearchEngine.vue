<template>
    <section class="search-engine">
        <div class="container">
            <v-card>
                <header class="search-engine-search">
                    <v-card-title class="text-capitalize px-0">
                        Search engine
                    </v-card-title>
                    <autocomplete 
                        class="search-engine-header-search-field"
                        :isSoloInverted="true"
                        color="white"
                        @emitAutocomplete="addMaterial"
                    />
                </header>
                <v-divider />
                <main class="search-engine-results">
                    <div class="search-engine-results-materials px-4 py-3">
                        <v-chip-group column>
                            <v-chip
                                v-for="({ material }, idx) in results"
                                :key="material._id"
                                close
                                outlined
                                :color="(material.type === 'herb') ? 'success' : 'primary'"
                                @click:close="removeMaterial(idx)"
                            >
                                <v-avatar left class="mr-2">
                                    <v-img
                                        :src="require(`@/assets/icons/${material.type}.svg`)"
                                    ></v-img>
                                </v-avatar>
                                {{ material.text }}
                            </v-chip>
                        </v-chip-group>
                    </div>
                    <v-divider vertical />
                    <div class="search-engine-results-interactions">
                        <!-- tabs or nested routes, first is herb2Drug interactions -->
                        <!-- second is Drug2Drug interactions (DBank's interactions) -->
                    </div>
                </main>
            </v-card>
            <icons-map />
        </div>
    </section>
</template>

<script>
import autocomplete from '@/cmps/Autocomplete';
import iconsMap from '@/cmps/general/IconsMap';

export default {
    data() {
        return {
            results: []
        }
    },
  watch: {
    '$route.query'() {
      /// if i have array of ids there, the server knows to get materialId: [ "...", "..." ]
      /// and bring array of materials
      /// so this.addMaterial and this.removeMaterial will just add and remove from this.$route.query
      /// and here i will get their their labels, and then all interactions for results
    },
  },
    methods: {
        async addMaterial(material) {
            if (!material) return;
            if (!this.isIncluded(material._id)) {
                const { labels } = await this.$store.dispatch({ type: 'loadMaterial', matId: material._id});
                const result = {
                    material: { ...material, labelIds: labels.map(label => label._id) },
                    interactions: []
                };
                /// get from interaction API using result.material._id and results.material.labelIds as one array
                /// server knows to get { ids: [ "...", "..." ] }
                this.results.push(result);
            }
        },
        removeMaterial(matIdx) {
            this.results.splice(matIdx, 1);
        },
        isIncluded(matId) {
            return this.materialsData.findIndex(({ material }) => material._id === matId) !== -1;
        },
        isObjectEmpty(obj) {
            return Object.keys(obj).length === 0 && obj.constructor === Object;
        }
    },
    components: {
        autocomplete,
        iconsMap
    }
}
</script>