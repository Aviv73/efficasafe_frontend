<template>
    <section class="interactions-preview">
        <button class="dismiss-btn">
            <close-icon :size="18" />
        </button>
        <div
            v-if="disabled"
            class="interactions-preview-warnning flex-coloumn"
        >
            <alert-circle-outline-icon />
            There is no additional results for {{ userQuery }}
            as it is part of {{ getCompoundName(materials[0].name, userQuery) }}
        </div>
        <div
            v-else-if="materials.length > 1 || userQuery !== materials[0].name"
            class="interactions-preview-composites"
        >
            <h6>{{ materials.length }} Materials</h6>
            <ul>
                <li
                    class="interactions-preview-composites-composite"
                    v-for="material in materials"
                    :key="material._id"
                    :style="{
                        'background-image': `url('${require(`@/client/assets/icons/types/${material.type}.svg`)}')`
                    }"
                >
                    {{ material.name }}
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close';
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
        }
    },
    methods: {
        getCompoundName(materialName, query) {
            const queries = this.$store.getters.materialNamesMap[materialName];
            return queries.filter(q => q !== query).join(', ');
        }
    },
    components: {
        CloseIcon,
        AlertCircleOutlineIcon
    }
}
</script>
