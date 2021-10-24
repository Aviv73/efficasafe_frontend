<template>
    <section class="recommendations-modal">
        <header class="recommendations-modal-header">
            <h3 class="recommendations-modal-title">Recommendations</h3>
            <button
                class="close-btn"
                @click="close"
            >
                <close-icon :size="14" />
            </button>
        </header>
        <main class="recommendations-modal-content">
            <div class="line">
                <div class="icon-container red"><cancel-icon :size="14"/></div>
                <p class="txt">Avoid coadministration</p>
            </div>
            <div class="line">
                <div class="icon-container red"><cancel-icon :size="14"/></div>
                <p class="txt">Coadministration is not advised</p>
            </div>
            <div class="line">
                <div class="icon-container yellow">!</div>
                <p class="txt">Caution should be taken	</p>
            </div>
            <div class="line">
                <div class="icon-container yellow">!</div>
                <p class="txt">Coadministration is not contraindicated but Caution should be taken</p>
            </div>
            <div class="line">
                <div class="icon-container yellow">!</div>
                <p class="txt">Coadministration is possible but Caution should be taken</p>
            </div>
            <div class="line">
                <div class="icon-container green"><span>✔</span></div>
                <p class="txt">Coadministration is not contraindicated</p>
            </div>
            <div class="line">
                <div class="icon-container green"><span>✔</span></div>
                <p class="txt">Coadministration is not contraindicated and may even be advised</p>
            </div>
            <div class="line">
                <div class="icon-container green"><span>✔</span></div>
                <p class="txt">Coadministration is possible</p>
            </div>
            <div class="line">
                <div class="icon-container green"><span>✔</span></div>
                <p class="txt">Coadministration is possible and may even be advised</p>
            </div>
            <div class="line">
                <div class="icon-container green"><span>✔</span></div>
                <p class="txt">Coadministration is advised</p>
            </div>
        </main>
        <section class="recommendations-modal-txt">
            <p><span>Coadministration is possible</span> - The combination has been examined in clinical trials and was found to be safe.</p>
            <p><span>Coadministration is not contraindicated</span> - The combination has been only examined in preclinical studies.</p>
        </section>
    </section>
</template>

<script>

import CloseIcon from 'vue-material-design-icons/Close';
import CancelIcon from 'vue-material-design-icons/Cancel';

export default {
    methods: {
        close(){
            this.$emit('close-modal');
        }
    },
    components: {
        CloseIcon,
        CancelIcon
    }
}
</script>