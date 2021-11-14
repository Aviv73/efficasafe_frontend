<template>
    <section class="container">
        <h1 style="font-size: 24px" class="text-center font-weight-bold mb-10">Statistics</h1>
        <div class="date-container">
            <v-btn class="date-btn" color="primary" @click="isShowDate = !isShowDate"><v-icon>mdi-calendar-range</v-icon></v-btn>
            <v-card v-if="isShowDate" class="date-picker">
                <h3>From:</h3>
                <v-date-picker
                    v-model="dateToShowFrom"
                    no-title
                    scrollable
                >
                </v-date-picker>
                <h3>To:</h3>
                <v-date-picker
                    v-model="dateToShowTo"
                    no-title
                    scrollable
                >
                </v-date-picker>
                <v-btn
                    text
                    color="primary"
                    class="reset-btn"
                    @click="dateToShowFrom = null, dateToShowTo = null"
                >
                    show all
                </v-btn>
            </v-card>
        </div>
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
                :items="searchItems"
                :search="searchMaterial"
                ></v-data-table>
            </v-card>
        </template>
        <template>
            <v-card class="mb-10">
                <v-card-title>
                <h2 class="mr-10">Searched Under Construction Materials</h2>
                    <v-text-field
                        v-model="searchUCMaterial"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                :headers="searchTableHeaders"
                :items="searchUCItems"
                :search="searchUCMaterial"
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
                :items="interactionItems"
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
            searches: [],
            searchTableHeaders:[{text:'Material', value: 'name'}, {text:'Count', value: 'count'}],
            searchMaterial:'',
            searchUCMaterial:'',
            interactions: [],
            interactionTableHeaders:[{text:'Interaction', value: 'name'}, {text:'Count', value: 'count'}],
            searchInteraction:'',
            dateToShowFrom: null,
            dateToShowTo: null,
            isShowDate: false
        }
    },
    computed: {
        searchItems(){
            let searches
            if(this.dateFromAsTimestamp){
                if(!this.dateToAsTimestamp){
                    searches = this.searches.filter(search => search.date >= this.dateFromAsTimestamp)
                }else{
                    searches = this.searches.filter(search => search.date >= this.dateFromAsTimestamp && search.date <= this.dateToAsTimestamp)
                }
            }else{
                searches = JSON.parse(JSON.stringify(this.searches))
            }
            const searchesCountMap = {}
            searches.forEach(search => {
                if(!searchesCountMap[search.name]) searchesCountMap[search.name] = 0
                searchesCountMap[search.name]++
            })
            const searchesToShow = []
            for(const material in searchesCountMap){
                let item = { name: material, count: searchesCountMap[material]}
                searchesToShow.push(item)
            }
            searchesToShow.sort((a,b) => {
                if(a.count - b.count > 0) return -1
                if(b.count - a.count > 0) return 1
                return 0
            })
            return searchesToShow
        },
        searchUCItems(){
            let searches
            if(this.dateFromAsTimestamp){
                searches = this.searches.filter(search => search.date >= this.dateFromAsTimestamp)
            }else{
                searches = JSON.parse(JSON.stringify(this.searches))
            }
            const searchesCountMap = {}
            searches.forEach(search => {
                if(!search.isUnderConstruction) return
                if(!searchesCountMap[search.name]) searchesCountMap[search.name] = 0
                searchesCountMap[search.name]++
            })
            const searchesToShow = []
            for(const material in searchesCountMap){
                let item = { name: material, count: searchesCountMap[material]}
                searchesToShow.push(item)
            }
            searchesToShow.sort((a,b) => {
                if(a.count - b.count > 0) return -1
                if(b.count - a.count > 0) return 1
                return 0
            })
            return searchesToShow
        },
        interactionItems(){
            let interactions
            if(this.dateFromAsTimestamp){
                interactions = this.interactions.filter(interaction => interaction.date >= this.dateFromAsTimestamp)
            }else{
                interactions = JSON.parse(JSON.stringify(this.interactions))
            }
            const interactionsCountMap = {}
            interactions.forEach(interaction => {
                if(!interactionsCountMap[interaction.name]) interactionsCountMap[interaction.name] = 0
                interactionsCountMap[interaction.name]++
            })
            const interactionsToShow = []
            for(const interactionName in interactionsCountMap){
                let item = { name: interactionName, count: interactionsCountMap[interactionName]}
                interactionsToShow.push(item)
            }
            interactionsToShow.sort((a,b) => {
                if(a.count - b.count > 0) return -1
                if(b.count - a.count > 0) return 1
                return 0
            })
            return interactionsToShow
        },
        dateFromAsTimestamp(){
            if(!this.dateToShowFrom) return null
            const dateFormat = new Date(this.dateToShowFrom).getTime();
            return dateFormat
        },
        dateToAsTimestamp(){
            if(!this.dateToShowTo) return null
            const dateFormat = new Date(this.dateToShowTo).getTime();
            return dateFormat + (1000 * 60 * 60 * 24)
        },
    },
    async created() {
        const statistics = await statisticsService.list()
        this.searches = statistics.searches
        this.interactions = statistics.interactions
    },
};
</script>