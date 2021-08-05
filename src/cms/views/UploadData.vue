<template>
  <section class="container">
        <h2>Upload Data</h2>
        <v-form @submit.prevent="uploadData">
            <v-file-input
                name="interactions"
                placeholder="Interactions"
                truncate-length="100"
                @change="onFileUpload($event,'interactions')"
            ></v-file-input>
            <v-file-input
                name="material"
                placeholder="Material"
                truncate-length="100"
                @change="onFileUpload($event,'material')"
            ></v-file-input>
            <v-file-input
                name="refs"
                placeholder="Refs"
                truncate-length="100"
                @change="onFileUpload($event,'refs')"
            ></v-file-input>
            <v-text-field
                placeholder="drugBankId"
                v-model="drugBankId">
            </v-text-field>
            <v-btn 
                type="submit"
                :disabled="isActive"
                >
                    Upload
            </v-btn>
        </v-form>
    <v-alert 
        class="upload-data-alert" 
        v-if="response"
        :type="alertType"
        dismissible
    >
        {{response.msg}}
    </v-alert>
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
            drugBankId: '',
            response :null,
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
            try{
                const res = await uploadDataService.uploadData(formData)
                this.response = res
            }catch(err){
                this.response = err
            }
            setTimeout(()=>{
                this.response = null
                this.material = null
                this.interactions = null
                this.refs = null
                this.drugBankId = ''
            },6000)
            
        },
        
    },
    computed:{
        alertType(){
            if(this.response.success){
                return 'success'
            }
            return 'error'
        },
        isActive(){
            return (!this.interactions || !this.material || !this.refs)
        }
    }
}
</script>


