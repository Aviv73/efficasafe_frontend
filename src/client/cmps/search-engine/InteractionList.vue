<template>
    <section>
        <template>
            <div
                v-if="isLoading || ($route.name === 'Boosters' && isPBLoading)"
                class="flex-center flex-coloumn"
            >
                <img v-if="$route.name === 'Boosters'" src="@/client/assets/icons/formulating.gif">
                <loader v-else/>
                <template v-if="$route.name === 'Boosters'">
                    <h3 v-if="listData.loadingTime < 20">Formulating your protocol...</h3>
                    <template v-else class="loading-err-container flex-center flex-coloumn">
                        <h3>Formulating is taking more time than expected.</h3>
                        <h3>This could happen if the network connection is poor</h3>
                        <h3>Or a problem has occurred</h3>
                        <h3>Please allow a few more seconds,</h3>
                        <h3>And if the problem persists</h3>
                        <h3>Please report this issue</h3>
                        <h3>And/or try narrowing your search</h3>
                        <button @click="onReport" class="btn home-cta report-btn">Report</button>
                    </template>
                </template>
            </div>
            <result-list-horizontal
                v-else-if="!isLoading && !isVertical"
                :materials="materials"
                :interactions="listData.interactions"
                :suppInteractions="listData.suppInteractions"
                :suppRedInteractions="listData.suppRedInteractions"
                :suppEmptyInteractions="listData.suppEmptyInteractions"
                :pageCount="listData.pageCount"
                :total="listData.total"
                :suppTotal="listData.suppTotal"
                :evidenceLevelPopupActive="evidenceLevelPopupActive"
                @list-sorted="$emit('list-sorted', $event)"
                @handle-DBI-filter="$emit('handle-DBI-filter', $event)"
            />
            <result-list-vertical
                v-else-if="!isLoading && isVertical"
                :materials="materials"
            />
            <list-pagination
                class="list-pagination flex-center"
                v-if="listData.pageCount > 1 && !isVertical && !isLoading"
                v-model.number="page"
                :pageCount="listData.pageCount"
                :disabled="isLoading"
            >
                <template #first-btn>
                    <page-first-icon
                        :size="18"
                        title="First page"
                    />
                </template>
                <template #last-btn>
                    <page-last-icon
                        :size="18"
                        title="Last page"
                    />
                </template>
            </list-pagination>
        </template>
    </section>
</template>

<script>
import ResultListHorizontal from '@/client/cmps/search-engine/ResultListHorizontal';
import ResultListVertical from '@/client/cmps/search-engine/ResultListVertical';
import ListPagination from '@/client/cmps/common/ListPagination';

import Loader from '@/client/cmps/common/icons/Loader';
import PageFirstIcon from 'vue-material-design-icons/PageFirst';
import PageLastIcon from 'vue-material-design-icons/PageLast';

import { httpService } from "@/cms/services/http.service";
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';

export default {
    props: {
        listData: {
            type: Object,
            required: true,
        },
        isVertical: {
            type: Boolean,
            default: true,
        },
        materials: {
            type: Array,
            required: true
        },
        isLoading: {
            type: Boolean,
            required: true
        },
        isPBLoading: {
            type: Boolean,
            required: true
        },
        evidenceLevelPopupActive: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            page: this.$route.query.page ? +this.$route.query.page : 1
        }
    },
    watch: {
        page(val) {
            this.$emit('page-changed', val);
        },
        listType:{
            handler(){
                this.page = 1
            }
        },
    },
    computed:{
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        listType(){
            return this.$store.getters.getListType;
        },
    },
    methods:{
        async onReport(){
            const url = this.$route.fullPath
            const reportDetails = {
                firstName: this.loggedInUser.username || 'Guest',
                email: this.loggedInUser.email || 'Unknown',
                type: "Optimizers bug",
                msg: url,
            }
            try{
                await httpService.post('task', reportDetails)
                eventBus.$emit(EV_show_user_msg, 'Thank you for reporting, we will review the problem as soon as possible', 5000, 'success')  
            }catch(err){
                eventBus.$emit(EV_show_user_msg, 'Something went wrong', 5000, 'error')
            }
        }
    },
    components: {
        ResultListHorizontal,
        ResultListVertical,
        ListPagination,
        PageFirstIcon,
        PageLastIcon,
        Loader
    }
};
</script>