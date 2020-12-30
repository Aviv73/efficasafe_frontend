<template>
  <section>
    {{ vInteractions.length }} v-interactions inside
  </section>
</template>

<script>
export default {
    data() {
        return {
            vInteractions: []
        }
    },
    props: {
        interaction: {
            type: Object,
            required: true
        }
    },
    methods: {
        async getRelatedMaterials() {
            const { interaction } = this;
            const labelId = interaction.side2Label._id
            const criteria = { limit: 0, labelId };
            const relatedMaterials = await this.$store.dispatch({ type: 'getMaterials', criteria });
            this.vInteractions = relatedMaterials.map(({ _id, name, type, atcPaths }) => {
                return {
                    _id: interaction._id,
                    side1Material: interaction.side1Material,
                    side2Material: {
                        _id,
                        name,
                        type
                    },
                    side2Label: null,
                    recommendation: interaction.recommendation,
                    isVirual: true,
                    atcPaths
                }
            });
            console.log(this.vInteractions);
        }
    },
    created() {
        this.getRelatedMaterials();
    }
}
</script>