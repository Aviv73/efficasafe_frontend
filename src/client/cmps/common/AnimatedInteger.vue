<template>
    <span>{{ valueToDisplay }}</span>
</template>

<script>
import gsap from 'gsap';

export default {
    props: {
        value: {
            default: 0
        },
        duration: {
            default: 1.5
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
            return this.displayValue.toLocaleString('en-US');
        }
    }
}
</script>