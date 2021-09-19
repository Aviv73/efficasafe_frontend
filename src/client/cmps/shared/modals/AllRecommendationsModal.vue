<template>
    <section class="recommendations-modal">
        <header class="recommendations-modal-header">
            <button
                class="close-btn"
                @click="close"
            >
                <close-icon :size="14" />
            </button>
        </header>
        <main class="recommendations-modal-content">
            <div class="red-recomm">
                <p>Avoid coadministration</p>
                <p>Coadministration is not advised</p>
            </div>
            <div class="yellow-recomm">
                <p>Caution should be taken	</p>
                <p>Coadministration is not contraindicated but Caution should be taken</p>
                <p>Coadministration is possible but Caution should be taken</p>
            </div>
            <div class="green-recomm">
                <p>Coadministration is not contraindicated</p>
                <p>Coadministration is not contraindicated and may even be advised</p>
                <p>Coadministration is possible</p>
                <p>Coadministration is possible and may even be advised</p>
                <p>Coadministration is advised</p>
            </div>
        </main>
    </section>
</template>

<script>

import CloseIcon from 'vue-material-design-icons/Close';

export default {
    methods: {
        close(){
            this.$emit('close-modal');
        }
    },
    components: {
        CloseIcon
    }
}
</script>