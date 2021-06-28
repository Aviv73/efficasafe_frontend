<template>
    <section>
        <div
            v-if="isLoading || ($route.name === 'Boosters' && isPBLoading)"
            class="flex-center"
        >
            <loader />
        </div>
        <result-list-horizontal
            v-else-if="!isLoading && !isVertical"
            :materials="materials"
            :interactions="listData.interactions"
            :pageCount="listData.pageCount"
            :total="listData.total"
            :isLoading="isLoading"
            :evidenceLevelPopupActive="evidenceLevelPopupActive"
            @list-sorted="$emit('list-sorted', $event)"
        />
        <result-list-vertical
            v-else-if="!isLoading && isVertical"
            :materials="materials"
        />
        <list-pagination
            class="list-pagination flex-center"
            v-if="listData.pageCount > 1 && !isVertical"
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
    </section>
</template>

<script>
import ResultListHorizontal from '@/client/cmps/search-engine/ResultListHorizontal';
import ResultListVertical from '@/client/cmps/search-engine/ResultListVertical';
import ListPagination from '@/client/cmps/common/ListPagination';

import Loader from '@/client/cmps/common/icons/Loader';
import PageFirstIcon from 'vue-material-design-icons/PageFirst';
import PageLastIcon from 'vue-material-design-icons/PageLast';

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
            page: 1
        }
    },
    watch: {
        page(val) {
            this.$emit('page-changed', val);
        }
    },
    components: {
        ResultListHorizontal,
        ResultListVertical,
        ListPagination,
        PageFirstIcon,
        PageLastIcon,
        Loader
    },
};
</script>