<template>
    <section>
        <div
            v-if="isLoading"
            class="flex-center"
        >
            <img
                :src="require('@/client/assets/icons/loader.gif')"
                alt="Loader"
            />
        </div>
        <result-list-horizontal
            v-else-if="!isLoading && !isVertical"
            :materials="materials"
            :interactions="listData.interactions"
            :pageCount="listData.pageCount"
            :total="listData.total"
        />
        <div v-else-if="!isLoading && isVertical">
            VERTIVAL LIST HERE!
        </div>
    </section>
</template>

<script>
import ResultListHorizontal from '@/client/cmps/search-engine/ResultListHorizontal';

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
        }
    },
    components: {
        ResultListHorizontal
    },
};
</script>