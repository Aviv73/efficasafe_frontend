<template>
    <section class="container">
        <h1 class="mb-4">Formulas</h1>
        <input type="file" @change="onUpload"/>
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

import { materialService } from '@/cms/services/material.service';
import readXlsxFile from 'read-excel-file'

export default {
    name: 'Formulas',
    data(){
        return {
            response: null
        }
    },
    methods: {
        async onUpload(ev){
            const nonExisting = []
            try{
                const rows = await readXlsxFile(ev.target.files[0])
                for (let j = 0; j < rows.length; j++) {
                    const row = rows[j];
                    if(!row[0] || !row[1]) return 
                    const formula = row[0]
                    const materialNames = row[1].split(',')
                    const formulatedMaterialNames = materialNames.map( n => {
                        let newName = n.trim()
                        newName = newName.toLowerCase()
                        return newName.charAt(0).toUpperCase() + newName.slice(1)
                    })
                    for (let i = 0; i < formulatedMaterialNames.length; i++) {
                        const name = formulatedMaterialNames[i];
                        const material = await materialService.getByName(name)
                        if(!material){
                            if(!nonExisting.includes(formula)) nonExisting.push(formula)
                            continue
                        } 
                        if(material.formulas.includes(formula)) continue
                        material.formulas.push(formula)
                        await materialService.save(material)
                    }   
                }
                if(!nonExisting.length){
                    this.response = {
                        type: 'success',
                        msg: 'Everything went awesome!'
                    }
                }else{
                    const formulas = nonExisting.join(', ')
                    this.response = {
                        type: 'warning',
                        msg: `Some materials could not be recognized, check the formulas: ${formulas}`
                    }
                }
            }catch(err){
                this.response = {
                    type: 'error',
                    msg: 'Something went wrong.'
                }
            }
        }
    },
    computed:{
        alertType(){
            return this.response.type
        },
    }
};
</script>