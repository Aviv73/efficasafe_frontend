<template>
    <section class="interaction-preview">
        <collapse>
            <template #header>
                {{ interaction.name }}
            </template>
            <template #content>
                {{ interaction }}
            </template>
        </collapse>
    </section>
</template>

<script>
import Collapse from '@/client/cmps/common/Collapse';

export default {
    props: {
        interaction: {
            type: Object,
            required: true
        }
    },
    components: {
        Collapse
    }
}
</script>