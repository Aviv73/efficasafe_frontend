<template>
    <section class="poss-booster-count badge inner" :style="getBadgeColor(group)">
        {{length}}
    </section>
</template>

<script>

import { interactionUIService } from '@/cms/services/interaction-ui.service';

export default {
    props: {
        group: {
            type: Object,
            required: true
        },
        length: {
            type: Number,
            default: 0
        }
    },
    methods: {
        getBadgeColor({recommendation}){
            const color = interactionUIService.getInteractionColor(recommendation);
            if(color === '#F6D55C') return 'background-color: #F6D55C; color: blue'
            return 'background-color: #55C595'
        },
    },
    created() {
    },
    components: {
        
    }
}
</script>