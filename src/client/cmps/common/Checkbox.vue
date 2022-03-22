<template>
    <label class="custom-checkbox">
        <input
            type="checkbox"
            :checked="isChecked"
            @change="$emit('change', $event.target.checked)"
            hidden
        />
        <span class="custom-checkbox-checkbox" :class="{'bigger-radius': biggerRadius}"/>
        <slot name="label" />
    </label>
</template>

<script>
export default {
    model: {
        prop: 'isChecked',
        event: 'change'
    },
    props: {
        isChecked: {
            type: Boolean,
            required: true
        },
        biggerRadius: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../../styles/setup/variables';

    .custom-checkbox {
        display: inline-flex;
        user-select: none;
        align-items: center;

        &-checkbox {
            display: inline-block;
            height: 24px;
            width: 24px;
            background-color: $white;
            border: 1px solid $clr7;
            border-radius: 1px;
            position: relative;
            transition: background-color .3s linear;

            &::before {
                content: "";
                background-color: $white;
                width: 4px;
                height: 12px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotateZ(45deg);
                opacity: 0;
                visibility: hidden;
                transition: opacity .3s linear;
            }
            &::after {
                content: "";
                background-color: $white;
                width: 4px;
                height: 6px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-3.5px, -1px) rotateZ(-45deg);
                transform-origin: left bottom;
                opacity: 0;
                visibility: hidden;
                transition: opacity .3s linear;
            }
        }
        [type=checkbox]:checked + &-checkbox {
            background-color: $clr1;

            &::after, &::before {
                visibility: visible;
                opacity: 1;
                margin-left: 1px;
            }
        }
    }

    .bigger-radius{
        border-radius: 7px;
    }
</style>