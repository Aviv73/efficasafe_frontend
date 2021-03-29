<template>
    <span>{{ valueToDisplay }}</span>
</template>

<script>
import gsap from 'gsap';

export default {
    props: {
        value: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number,
            default: 1.5
        },
        locale: {
            type: String,
            default: 'en-US'
        }
    },
    data() {
        return {
            displayValue: this.value,
            tweenValue: this.value
        }
    },
    watch: {
        value() {
            gsap.to(this, {
                duration: this.duration,
                tweenValue: this.value,
                onUpdate: () => {
                    this.displayValue = Math.ceil(this.tweenValue);
                }
            });
        }
    },
    computed: {
        valueToDisplay() {
            return this.displayValue.toLocaleString(this.locale);
        }
    }
}
</script>