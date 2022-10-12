<template>
    <div class="video-modal">
        <div class="video-modal-cover" @click.stop="closeModal"></div>
        <div class="video-modal-content txt-center">
            <button @click="closeModal" class="close-modal-btn">
                <close-icon :size="14" />
            </button>
            <h2 class="title">Efficasafe video tutorial</h2>
            <div class="video-container">
                <iframe
                    allowfullscreen="allowfullscreen"
                    allow='autoplay'
                    :width="iframeSize.width"
                    :height="iframeSize.height"
                    :src="currLink"
                >
                </iframe>
            </div>
            <div class="btn-container">
                <button v-if="currVideoIdx !== 0" @click="setCurrIndex(-1)">
                    Previous
                </button>
                <button
                    v-if="currVideoIdx !== links.length - 1"
                    @click="setCurrIndex(1)"
                >
                    Next
                </button>
                <button v-else @click="closeModal">Done</button>
            </div>
        </div>
    </div>
</template>

<script>

import CloseIcon from 'vue-material-design-icons/Close';

export default {
    components:{
        CloseIcon
    },
    data() {
        return {
            links: ['SmuEDcWPGH8', 'kBgZNJxR6ZA', '-8GzFTaoDAw'],
            currVideoIdx: 0,
        };
    },
    methods: {
        closeModal() {
            this.$emit('closeVideo');
        },
        setCurrIndex(value) {
            this.currVideoIdx += value;
        },
    },
    computed: {
        currLink() {
            const youtubeLink = 'https://www.youtube.com/embed/';
            return `${youtubeLink}${this.links[this.currVideoIdx]}?autoplay=1&cc_load_policy=1&vq=hd720`;
        },
        isScreenMobile() {
            return this.$store.getters.isScreenMobile;
        },
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        isScreenWide(){
            return !this.isScreenNarrow && !this.isScreenMobile
        },
        iframeSize() {
            if(this.isScreenWide){
                return {
                    width: '900',
                    height: '450',
                };

            }
            if(this.isScreenNarrow){
                return {
                    width: '600',
                    height: '315',
                };

            }
            return { width: '330', height: '250' };
        },
    },
};
</script>

