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
                                v-for="(material, idx) in materials"
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
            materials: []
        }
    },
    methods: {
        addMaterial(material) {
            if (!material) return;
            if (!this.isIncluded(material._id)) {
                this.materials.push(material);
            }
        },
        removeMaterial(matIdx) {
            this.materials.splice(matIdx, 1);
        },
        isIncluded(matId) {
            return this.materials.findIndex(mat => mat._id === matId) !== -1;
        }
    },
    components: {
        autocomplete,
        iconsMap
    }
}
</script>