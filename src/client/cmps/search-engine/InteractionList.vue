<template>
    <section class="interaction-list">
        <result-list-horizontal
          v-if="!isVertical"
          :interactions="listData.interactions"
          :pageCount="listData.pageCount"
          :total="listData.total"
        />
        <div v-else>VERTIVAL LIST HERE!</div>
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
    },
    components: {
      ResultListHorizontal
    }
};
</script>