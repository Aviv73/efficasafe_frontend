<template>
  <section>
      <h2>Upload Data</h2>
      <v-form @submit.prevent="uploadData">
        <v-file-input
            name="interactions"
            placeholder="Interactions"
            truncate-length="15"
            @change="onFileUpload($event,'interactions')"
        ></v-file-input>
        <v-file-input
            name="material"
            placeholder="Material"
            truncate-length="15"
            @change="onFileUpload($event,'material')"
        ></v-file-input>
        <v-file-input
            name="refs"
            placeholder="Refs"
            truncate-length="15"
            @change="onFileUpload($event,'refs')"
        ></v-file-input>
        <v-text-field
            placeholder="drugBankId"
            v-model="drugBankId">
        </v-text-field>
        <v-btn type="submit">Upload</v-btn>
      </v-form>
  </section>
</template>

<script>
import { uploadDataService } from '@/cms/services/upload-data.service'

export default {
    data(){
        return{
            interactions: null,
            material: null,
            refs: null,
            drugBankId: ''
        }
    },
    methods:{
        onFileUpload(file,name){
            this[name] = file
        },
        async uploadData(){
            const formData = new FormData();
            formData.append('material', this.material);
            formData.append('interactions', this.interactions);
            formData.append('refs', this.refs);
            formData.append('drugBankId', this.drugBankId);
            const msg = await uploadDataService.uploadData(formData)
            console.log(msg);
        },
        
    }
}
</script>


