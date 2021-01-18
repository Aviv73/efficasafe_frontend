<template>
    <section class="featured-interaction-list">
        LIST OF {{ group.count }} INTERACTIONS of {{ `${group.name} (${group._id})` }}
        with filter
    </section>
</template>

<script>
export default {
    props: {
        group: {
            type: Object,
            required: true
        }
    }
}
</script>