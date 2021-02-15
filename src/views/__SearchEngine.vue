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
                    <div class="search-engine-results-materials px-6 py-4">
                        <v-chip-group column>
                            <v-chip
                                class="mb-4"
                                v-for="material in materials"
                                :key="material._id"
                                close
                                outlined
                                :color="getMaterialColor(material.type)"
                                @click:close="removeMaterial(material._id)"
                            ></v-chip>
                        </v-chip-group>
                    </div>
                    <v-divider vertical />
                    <div class="search-engine-results-interactions">
                        <v-tabs 
                            background-color="white"
                            light
                            fixed-tabs
                            optional
                        >
                            <v-tab :to="{ name: 'Results', query: this.$route.query }">
                                Herb to drug
                            </v-tab>
                            <v-tab :to="{ name: 'DBankResults', query: this.$route.query }">
                                Drug to drug
                            </v-tab>
                        </v-tabs>
                        <!-- <router-view
                            class="px-2 py-4"
                        /> -->
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
            materials: [],
            isLoading: false
        }
    },
    watch: {
        '$route.query': {
            handler(to, from) {
                const { materialId } = this.$route.query; 
                if (!materialId) return;
                console.log('To:', to);
                console.log('From:', from);
                if (!Array.isArray(materialId) && materialId) {
                    this.$route.query.materialId = [ materialId ];
                }
                this.getMaterials();
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        getMaterials() {
            console.log('Getting', this.$route.query.materialId);
        },
        addMaterial(material) {
            if (!material) return;
            if (this.$route.query.materialId) {
                if (!this.isMaterialExists(material._id)) {
                    const ids = [...this.$route.query.materialId, material._id];
                    this.$router.replace({ query: { materialId: ids } });
                }
            } else {
                this.$router.push({ query: { materialId: [ material._id ] } });
            }
        },
        removeMaterial(materialId) {
            const ids = this.$route.query.materialId.filter(id => id !== materialId);
            this.$router.replace({ query: { materialId: ids } });
        },
        isMaterialExists(matId) {
            return this.$route.query.materialId.includes(matId);
        },
        getMaterialColor(type) {
            switch (type) {
                case 'herb':
                    return 'success';
                case 'drug':
                    return 'primary';
                case 'vitamin':
                    return 'amber';
                case 'mineral':
                    return 'orange';
                case 'amino acid':
                    return 'deep-orange';
                case 'nutraceutical':
                    return 'teal';
                case 'essential oil':
                    return 'cyan';
                case 'food':
                    return 'orange';
            }
        }
    },
    components: {
        autocomplete,
        iconsMap
    }
}
</script>