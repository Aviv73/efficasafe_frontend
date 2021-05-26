<template>
    <v-card class="super-label-maker">
        <v-card-title
            class="side-picker-title primary headline"
            style="color: white; font-weight: bold"
        >
            <v-icon dark class="mr-2">mdi-text-box-search-outline</v-icon>
            Search materials interacted with:
            <v-spacer />
            <v-btn 
                icon
                dark
                @click="closeDialog"
            >
                <v-icon>mdi-window-close</v-icon>
            </v-btn>
        </v-card-title>
        <main>
            <div class="pa-4 primary lighten-2 v-sheet theme--light">
                <autocomplete
                    :isDark="true"
                    :isSoloInverted="true"
                    @emitAutocomplete="getInteractedMaterials"
                    placeholder="Search herb / supplement"
                    is-supplements-only
                />
            </div>
            <h3 :class="{ 'not-empty': !!materials.length }">
                <div>
                    <v-btn
                        v-if="materials.length"
                        color="success"
                        outlined
                        rounded
                        small
                        @click="emitSelection"
                    >
                        add
                    </v-btn>
                </div>
                <div>Materials count: {{ materials.length }}</div>
                <div>
                    <v-btn
                        v-if="materials.length"
                        color="error"
                        outlined
                        rounded
                        small
                        @click="materials = []"
                    >
                        Clear
                    </v-btn>
                </div>
            </h3>
            <v-list class="super-label-maker-list">
                <v-list-item
                    v-for="material in materials"
                    :key="material._id"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ material.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ material.type }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn 
                            title="Delete"
                            icon
                            @click="removeMaterial(material._id)"
                        >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </main>
    </v-card>
</template>

<script>
import Autocomplete from '@/cms/cmps/Autocomplete.vue';

export default {
    data() {
        return {
            materials: []
        }
    },
    methods: {
        emitSelection() {
            this.$emit('materials-peaked', JSON.parse(JSON.stringify(this.materials)));
            this.$emit('close-super-label-dialog');
        },
        removeMaterial(id) {
            this.materials = this.materials.filter(m => m._id !== id);
        },
        closeDialog() {
            this.$emit('close-super-label-dialog');
        },
        async getInteractedMaterials(side1Material) {
            if (!side1Material) return;
            const filterBy = {
                materialCount: 1,
                id: [ side1Material._id ],
                page: 0,
                limit: 0
            };
            const { interactions } = await this.$store.dispatch({ type: 'getInteractions', filterBy });
            const materialIds = interactions.reduce((acc, { side2Material }) => {
                if (!side2Material) return acc;
                if (!acc.includes(side2Material._id)) acc.push(side2Material._id);
                return acc;
            }, []);
            const labelIds = interactions.reduce((acc, { side2Label }) => {
                if (!side2Label) return acc;
                if (!acc.includes(side2Label._id)) acc.push(side2Label._id);
                return acc;
            }, []);
            const criteria1 = {
                materialId: materialIds,
                page: 0,
                limit: 0
            };
            const criteria2 = {
                labelId: labelIds,
                page: 0,
                limit: 0
            };
            const [ materials1, materials2 ] = await Promise.all([
                this.$store.dispatch({ type: 'getMaterials', criteria: criteria1 }),
                this.$store.dispatch({ type: 'getMaterials', criteria: criteria2 })
            ]);
            let materials = materials1.concat(materials2);
            materials = materials.filter((material, idx) => materials.findIndex(m => m._id === material._id) === idx);
            this.materials = materials;
        }
    },
    components: {
        Autocomplete
    }
}
</script>