<template>
    <div
        class="interaction-capsules"
        :class="{
            'dup': showDraftName,
            'group': isGroup || isLabel
        }"
    >
        <div
            class="interaction-capsules-side"
            :class="{
                'dense': dense,
                'wide': onDetailsPage
            }"
            v-if="!showDraftName && !isMaterialGroup"
        >
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
        <div
            class="interaction-capsules-side"
            :class="{
                'dense': dense,
                'wide': onDetailsPage
            }"
        >
        <svg
            v-if="showDraftName || isMaterialGroup"
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
        <span :title="draftNameFullContent">
            {{ draftNameContent }}
        </span>
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
        <span v-if="isGroup || isLabel">
            <span
                class="layer"
                v-for="n in 3"
                :key="n"
                :style="{
                    'transform': `translateX(-${n * 5}px)`
                }"
            />
        </span>
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
        },
        localize: {
            type: Boolean,
            required: true
        },
        showDraftName: {
            type: Boolean,
            required: true
        },
        draftName: {
            type: String,
            default: ''
        },
        isLabel: {
            type: Boolean,
            default: false
        },
        dense: {
            type: Boolean,
            default: false
        },
        onDetailsPage: {
            type: Boolean,
            default: false
        },
        isMaterialGroup: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isGroup() {
            return this.vInteractionCount > 0;
        },
        draftNameFullContent() {
            const nameToDisplay = (this.showDraftName && this.draftName) ? this.draftName : this.side2Name;
            return (this.vInteractionCount) ? `${nameToDisplay} (${this.vInteractionCount})` : nameToDisplay;
        },
        draftNameContent() {
            const nameToDisplay = (this.showDraftName && this.draftName) ? this.draftName : this.side2Name;
            if (nameToDisplay.length >= 14 && this.isGroup) {
                return `${nameToDisplay.substring(0, 12)}...(${this.vInteractionCount})`;
            }
            return (this.vInteractionCount) ? `${nameToDisplay} (${this.vInteractionCount})` : nameToDisplay;
        },
        side1Name() {
            if (!this.name || this.isMaterialGroup) return '';
            const side1Name = this.name.split('&')[0].trim();
            if (this.onDetailsPage) return side1Name;
            if (this.$store.getters.materialNamesMap[side1Name]) {
                return this.$store.getters.materialNamesMap[side1Name].join(', ');
            }
            return side1Name;
        },
        side2Name() {
            if (!this.name) return '';
            if (this.isMaterialGroup) return this.name;
            const side2Name = this.name.split('&')[1].trim();
            if (!this.localize) return side2Name;
            if (this.$store.getters.materialNamesMap[side2Name]) {
                return this.$store.getters.materialNamesMap[side2Name].join(', ');
            }
            return side2Name;
        }
    }
};
</script>