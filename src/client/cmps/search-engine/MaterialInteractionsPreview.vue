<template>
    <section class="interactions-preview">
        <div
            v-if="disabled"
            class="interactions-preview-warnning flex-coloumn"
        >
            <alert-circle-outline-icon />
            There is no additional results for {{ userQuery }}
            as it is part of {{ getCompoundName(materials[0].name, userQuery) }}
            <hr />
        </div>
        <div
            v-else-if="materials.length > 1 || userQuery !== materials[0].name"
            class="interactions-preview-composites"
        >
            <h6>{{ previewHeader }}</h6>
            <ul>
                <li
                    class="interactions-preview-composites-composite"
                    v-for="material in materials"
                    :key="material._id"
                    :style="{
                        'background-image': `url('${require(`@/client/assets/icons/types/${getTypeImgName(material.type)}.svg`)}')`
                    }"
                >
                    {{ material.name }}
                </li>
            </ul>
            <hr />
        </div>
        <div
            v-if="interactions.length"
            class="interactions-preview-interactions"
        >
            <ul>
               ~~~ interactions preview here ~~~ 
            </ul>
            <hr />
        </div>
        <div class="interactions-preview-actions">
            <router-link :to="`/search?q=${userQuery}`" target="_blank">
                See all interactions of {{ userQuery }}
            </router-link>
        </div>
    </section>
</template>

<script>
import AlertCircleOutlineIcon from 'vue-material-design-icons/AlertCircleOutline';

export default {
    props: {
        materials: {
            type: Array,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        userQuery: {
            type: String,
            required: true
        },
        interactions: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        previewHeader() {
            if (this.materials.length > 1) return `${this.materials.length} Materials`;
            if (this.userQuery !== this.materials[0].name) return this.materials[0].type;
            return '';
        }
    },
    methods: {
        getCompoundName(materialName, query) {
            const queries = this.$store.getters.materialNamesMap[materialName];
            return queries.filter(q => q !== query).join(', ');
        },
        getTypeImgName(type) {
            switch (type) {
                case 'drug':
                    return 'drug';
                case 'herb':
                case 'essential oil':
                    return 'herb';
                case 'vitamin':
                case 'mineral':
                case 'amino acid':
                case 'nutraceutical':
                case 'food':
                    return 'other';
            }
        }
    },
    components: {
        AlertCircleOutlineIcon
    }
}
</script>
