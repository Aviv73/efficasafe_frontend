<template>
    <section class="interaction-details">
        <pre>{{ interaction }}</pre>
        <pre>{{ side2Material }}</pre>
    </section>
</template>

<script>
export default {
    data() {
        return {
            interaction: null,
            side2Material: null,
            isLoading: false
        }
    },
    watch: {
        '$route.params': {
            handler() {
                this.getInteraction();
            },
            immediate: true
        }
    },
    computed: {
        isVirtual() {
            return !!this.$route.params.matId;
        }
    },
    methods: {
        async getInteraction() {
            this.isLoading = true;
            const { id, matId } = this.$route.params;
            if (!this.isVirtual) {
                const interaction = await this.$store.dispatch({ type: 'loadInteraction', id });
                this.interaction = interaction;
            } else {
                const [ interaction, material ] = await Promise.all([
                    this.$store.dispatch({ type: 'loadInteraction', id }),
                    this.$store.dispatch({ type: 'loadMaterial', matId })
                ]);
                this.interaction = interaction;
                this.side2Material = material;
            }
            console.log(this.interaction);
            console.log(this.side2Material);
            this.isLoading = false;
        }
    }
}
</script>