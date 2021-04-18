<template>
    <div class="interaction-capsules">
        <div class="interaction-capsules-side">
            <span :title="side1Name">{{ side1Name }}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="cap cap-left"
                viewBox="0 0 24.192 48.001"
            >
                <path 
                    :fill="color"
                    d="M24.192,48h-.221A23.973,23.973,0,0,1,0,24,23.96,23.96,0,0,1,23.972,0h.221V4.132a21.046,21.046,0,0,0-6.841,1.532A20.58,20.58,0,0,0,10.8,9.929a19.82,19.82,0,0,0-4.414,6.326,19.338,19.338,0,0,0,0,15.492A19.81,19.81,0,0,0,10.8,38.071a20.585,20.585,0,0,0,6.548,4.265,21.043,21.043,0,0,0,6.841,1.532V48Z"
                    transform="translate(24.192 48.001) rotate(180)"
                />
            </svg>
        </div>
        <div class="interaction-capsules-side">
        <span :title="side2Name">{{ side2Name }}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="cap cap-right"
                viewBox="0 0 24.192 48.001"
            >
                <path
                    :fill="color"
                    d="M24.192,0h-.221A23.973,23.973,0,0,0,0,24,23.96,23.96,0,0,0,23.971,48h.221V43.869a21.046,21.046,0,0,1-6.841-1.532A20.58,20.58,0,0,1,10.8,38.072a19.82,19.82,0,0,1-4.414-6.326,19.338,19.338,0,0,1,0-15.492A19.81,19.81,0,0,1,10.8,9.93a20.585,20.585,0,0,1,6.548-4.265,21.042,21.042,0,0,1,6.841-1.532V0Z"
                />
            </svg>
        </div>
        <span
            class="layer"
            v-for="n in vInteractionCount"
            :key="n"
            :style="{ 'transform': `translateX(-${n * 5}px)` }"
        />
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: '#b1b1b1'
        },
        vInteractionCount: {
            type: Number,
            required: true
        }
    },
    computed: {
        side1Name() {
            return this.name.split('&')[0].trim();
        },
        side2Name() {
            return this.name.split('&')[1].trim();
        }
    }
};
</script>