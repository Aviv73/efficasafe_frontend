<template>
    <label class="custom-radio">
        <input
            type="radio"
            :name="name"
            :value="value"
            :checked="val === value"
            @change="$emit('change', $event.target.value)"
            hidden
        />
        <span class="custom-radio-radio" />
        <span class="custom-radio-label">{{ label }}</span>
    </label>
</template>

<script>
export default {
    model: {
        prop: 'val',
        event: 'change'
    },
    props: {
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        val: {
            required: true
        },
        label: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../../styles/setup/variables';
    .custom-radio {
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;

        &-radio {
            height: 12px;
            width: 12px;
            border-radius: 50%;
            border-width: 3px;
            border-style: solid;
            border-color: $gray;
            position: absolute;
            top: calc(50% - 7px);
            left: -16px;
        }
        [type=radio]:checked + &-radio {
            border-color: $clr1;
        }
    }
</style>