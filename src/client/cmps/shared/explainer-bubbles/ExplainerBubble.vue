<template>
    <portal :to="destination">
        <bubble>
            <p>EXPLAINER CONTENT...</p>
        </bubble>
    </portal>
</template>

<script>
import Bubble from './Bubble';

export default {
    props: {
        destination: {
            type: String,
            required: true
        },
        offsetY: {
            type: Number,
            default: 0
        },
        offsetX: {
            type: Number,
            default: 0
        }
    },
    components: {
        Bubble
    }
}
</script>