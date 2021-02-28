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
                    Pick material
                    <v-spacer />
                    <v-btn 
                        color="transparent"
                        elevation="0"
                        fab
                        dark
                        @click="closePicker"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
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
                    <v-btn color="normal" @click="closePicker">Cancel</v-btn>
                    <v-btn
                        color="primary"
                        @click="emitMaterial"
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
import autocomplete from '@/cms/cmps/Autocomplete';
import { eventBus, EV_clear_autocomplete } from '@/cms/services/eventBus.service';

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
        emitMaterial() {
            this.$emit('material-picked', { ...this.pickedMaterial });
            this.pickedMaterial = null;
            eventBus.$emit(EV_clear_autocomplete);
        },
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
        },
        closePicker() {
            this.$emit('close-dialog');
            eventBus.$emit(EV_clear_autocomplete);
            this.pickedMaterial = null;
        }
    },
    components: {
        autocomplete
    }
}
</script>