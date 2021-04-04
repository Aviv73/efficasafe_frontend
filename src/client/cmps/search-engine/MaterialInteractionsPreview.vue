<template>
    <section class="interactions-preview">
        {{ disabled }}
        <pre>{{ materials }}</pre>
    </section>
</template>

<script>
export default {
    props: {
        materials: {
            type: Array,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>
