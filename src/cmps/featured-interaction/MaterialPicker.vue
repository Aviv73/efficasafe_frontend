<template>
    <aside class="material-picker">
        <v-dialog
            v-model="dialog"
            width="600"
            persistent
        >
            <v-card>
                <v-card-title class="primary headline text-capitalize" style="color:white; font-weight:bold;">
                    <v-icon dark left>mdi-magnify</v-icon>
                    Material picker
                </v-card-title>
                <main class="py-6">
                    <autocomplete 
                        class="material-picker-search"
                        @emitAutocomplete="setPickedMaterial"
                    />
                </main>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="normal" @click="$emit('close-dialog')">Cancel</v-btn>
                    <v-btn
                        color="primary"
                        @click="$emit('material-picked', { ...pickedMaterial })"
                        :disabled="!pickedMaterial"
                        >
                            Ok
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </aside>
</template>

<script>
import autocomplete from '@/cmps/Autocomplete';

export default {
    props: {
        dialog: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            pickedMaterial: null
        }
    },
    methods: {
        setPickedMaterial(material) {
            if (!material) {
                this.pickedMaterial = null;
                return;
            }
            const { _id, text } = material;
            this.pickedMaterial = { 
                drugbank_id: _id,
                name: text
             };
        }
    },
    components: {
        autocomplete
    }
}
</script>