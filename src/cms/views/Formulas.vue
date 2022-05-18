<template>
    <section class="container">
        <h1 class="mb-4">Formulas</h1>
        <input class="mb-4" type="file" @change="onUpload"/>
        <h3 v-if="rowsLength">{{currRowNum}}/{{rowsLength}}</h3>
        <v-card v-if="showResults" class="mt-8">
            <v-card-title class="primary headline text-capitalize" style="color:white; font-weight:bold;">
                Done! look below if there are and problems
                <v-spacer />
            </v-card-title>
            <main class="py-6">
                <h2 class="mb-4" v-for="(error, idx) in nonExistingToShow" :key="idx"> <span style="font-weight:bold;">{{error.formula}}:</span> {{error.errors}}.</h2>
            </main>
        </v-card>
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
            response: null,
            nonExisting: {},
            showResults: false,
            rowsLength: 0,
            currRowNum: 0
        }
    },
    methods: {
        async onUpload(ev){
            this.nonExisting = {}
            this.showResults = false
            this.rowsLength = 0
            this.currRowNum = 0
            try{
                const rows = await readXlsxFile(ev.target.files[0])
                this.rowsLength = rows.length
                for (let j = 0; j < rows.length; j++) {
                    this.currRowNum++
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
                            if(!this.nonExisting[formula]) this.nonExisting[formula] = [name]
                            else this.nonExisting[formula].push(name)
                            continue
                        } 
                        if(material.formulas.includes(formula)) continue
                        material.formulas.push(formula)
                        await materialService.save(material)
                    }   
                }
                this.showResults = true
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
        nonExistingToShow(){
            const formatted = []
            for(const formulaName in this.nonExisting){
                const obj = {
                    formula: formulaName,
                    errors: this.nonExisting[formulaName].join(', ')
                }
                formatted.push(obj)
            }
            return formatted
        }
    }
};
</script>