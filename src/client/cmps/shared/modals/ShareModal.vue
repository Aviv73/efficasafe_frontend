<template>
    <aside class="share-modal">
        <header class="share-modal-header flex-align-center">
            <share-variant-icon :size="18" />
            Share your search results
        </header>
        <main class="share-modal-content">
            <button
                class="share-modal-content-btn copy-btn"
                v-clipboard:copy="shareURL"
                v-clipboard:success="onCopy"
                v-clipboard:error="onCopyFail"
            >
                <link-variant-icon :size="14" />
                Copy link
            </button>
            <div class="flex-align-center">
                <button
                    class="share-modal-content-btn cancel-btn"
                    @click="$emit('close-modal')"
                >
                    Cancel
                </button>
                <button
                    class="share-modal-content-btn share-btn"
                    v-if="!hasShareSupport"
                    @click="onShare"
                >
                    Share by mail
                </button>
                <button
                    class="share-modal-content-btn share-btn"
                    v-else
                >
                    Share
                </button>
            </div>
        </main>
    </aside>
</template>

<script>
import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';
import LinkVariantIcon from 'vue-material-design-icons/LinkVariant';

export default {
    data() {
        return {
            shareURL: `${window.location.origin}/${this.$route.fullPath}`
        }
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        hasShareSupport() {
            return 'share' in navigator;
        }
    },
    methods: {
        onShare() {
            if (this.hasShareSupport) {
                const shareData = {
                    title: 'Efficasafe',
                    text: 'share your search results',
                    url: this.shareURL
                };
                navigator.share(shareData);
            } else {
                window.open(`mailto:${this.loggedInUser.email}?subject=Efficasafe interactions&body=${this.shareURL}`);
            }
        },
        onCopy(ev) {
            // UserMsg cmp copied to clipboard
            console.log('Copied', ev.text);
        },
        onCopyFail() {
            // UserMsg cmp copy to clipboard failed
            console.log('Failed to copy text');
        }
    },
    components: {
        ShareVariantIcon,
        LinkVariantIcon
    }
}
</script>