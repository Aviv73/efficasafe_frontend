<template>
    <section class="container">
        <h1 style="font-size: 24px" class="text-center font-weight-bold mb-10">Statistics</h1>
        <h3 class="text-lg-h6 mb-10">The most searched UC materials are <span style="color: #2196f3">{{mostSearchedUcNames}}</span> with <span style="color: #2196f3">{{mostSearchedUC[0].count}}</span> searches</h3>
        <template>
            <v-card class="mb-10">
                <v-card-title>
                <h2 class="mr-10">Searched Materials</h2>
                    <v-text-field
                        v-model="searchMaterial"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                :headers="searchTableHeaders"
                :items="searchCountItems"
                :search="searchMaterial"
                ></v-data-table>
            </v-card>
        </template>
        <template>
            <v-card>
                <v-card-title>
                <h2 class="mr-10">Searched Interactions</h2>
                <v-text-field
                    v-model="searchInteraction"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                </v-card-title>
                <v-data-table
                :headers="interactionTableHeaders"
                :items="interactionCountItems"
                :search="searchInteraction"
                ></v-data-table>
            </v-card>
        </template>
    </section>
</template>

<script>

import { statisticsService } from '@/cms/services/statistics.service'

export default {
    name: 'Statistics',
    data(){
        return {
            searchCountMap:{},
            searchTableHeaders:[{text:'Material', value: 'name'}, {text:'Count', value: 'count'}],
            searchMaterial:'',
            interactionCountMap:{},
            interactionTableHeaders:[{text:'Interaction', value: 'name'}, {text:'Count', value: 'count'}],
            searchInteraction:'',
            underConstructionCountMap:{},
        }
    },
    computed: {
        searchCountItems(){
            const searches = []
            for(const material in this.searchCountMap){
                let item = { name: material, count: this.searchCountMap[material]}
                searches.push(item)
            }
            searches.sort((a,b) => {
                if(a.count - b.count > 0) return -1
                if(b.count - a.count > 0) return 1
                return 0
            })
            return searches
        },
        interactionCountItems(){
            const searches = []
            for(const interaction in this.interactionCountMap){
                let item = { name: interaction, count: this.interactionCountMap[interaction]}
                searches.push(item)
            }
            searches.sort((a,b) => {
                if(a.count - b.count > 0) return -1
                if(b.count - a.count > 0) return 1
                return 0
            })
            return searches
        },
        mostSearchedUC(){
            let mostSearched = [{name:'', count: 0}]
            for(const material in this.underConstructionCountMap){
                const name = material
                const count = this.underConstructionCountMap[material]
                if(count > mostSearched[0].count){
                    mostSearched = [{name, count}]
                    continue
                }
                if(count === mostSearched[0].count){
                    mostSearched.push({name, count})
                    continue
                }
            }
            return mostSearched
        },
        mostSearchedUcNames(){
            const names = this.mostSearchedUC.map(item => item.name)
            return names.join(', ')
        }
    },
    async created() {
        const statistics = await statisticsService.list()
        this.searchCountMap = statistics.searchCountMap 
        this.underConstructionCountMap =  statistics.underConstructionCountMap
        this.interactionCountMap = statistics.interactionCountMap
    },
};
</script>