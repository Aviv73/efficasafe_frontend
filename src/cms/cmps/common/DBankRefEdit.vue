<template>
    <v-card>
        <v-card-title class="primary headline" style="color:white; font-weight:bold;">
            <v-icon dark left>mdi-plus-circle</v-icon>{{ (editedRef.draftIdx) ? 'Edit' : 'Add' }} Reference
            <v-spacer />
            <v-btn 
                color="transparent"
                elevation="0"
                fab
                dark
                @click="$emit('d-bank-ref-dialog-close')"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        <v-form @submit.prevent="$emit('d-bank-ref-saved')" v-model="isValid" class="px-6 py-2">
            <v-text-field
                type="text"
                label="Ref id*"
                v-model="editedRef.ref_id"
                required
                autofocus
                :rules="[(v) => !!v || 'Ref id is required']"
            />
            <v-text-field
                type="text"
                label="Pubmed id"
                v-model="editedRef.pubmed_id"
            />
            <v-textarea
                type="text"
                label="Citation"
                v-model="editedRef.citation"
                rows="1"
                auto-grow
            />
            <v-text-field
                type="text"
                label="Title"
                v-model="editedRef.title"
            />
            <v-text-field
                type="text"
                label="URL"
                v-model="editedRef.url"
            />
            <footer class="pt-6 pb-1">
                <v-btn 
                    class="mr-2"
                    @click="$emit('d-bank-ref-dialog-close')"
                >
                    Cancel
                </v-btn>
                <v-btn
                    type="submit"
                    color="success"
                    :disabled="!isValid"
                >
                    Save
                </v-btn>
            </footer>
        </v-form>
    </v-card>
</template>

<script>
export default {
    props: {
        editedRef: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isValid: false
        }
    }
}
</script>