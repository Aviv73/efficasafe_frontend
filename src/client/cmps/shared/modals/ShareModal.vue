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
                <span v-if="!hasShareSupport" class="flex-coloumn">
                    <span class="radios">
                        <radio
                            v-model="mailWith"
                            name="mailWith"
                            value="gmail"
                            label="Gmail"
                        />
                        <radio
                            v-model="mailWith"
                            name="mailWith"
                            value="default"
                            label="default"
                        />
                    </span>
                        <button
                        class="share-modal-content-btn share-btn"
                        @click="onShare"
                    >
                        Share by mail
                    </button>
                </span>
                <button
                    class="share-modal-content-btn share-btn"
                    v-else
                    @click="onShare"
                >
                    Share
                </button>
            </div>
        </main>
    </aside>
</template>

<script>
import Radio from '@/client/cmps/common/Radio';

import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';
import LinkVariantIcon from 'vue-material-design-icons/LinkVariant';

export default {
    data() {
        return {
            mailWith: 'default',
            shareURL: `${window.location.origin}${this.$route.fullPath}`
        }
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        hasShareSupport() {
            return this.isScreenNarrow && 'share' in navigator;
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
                if (this.mailWith === 'gmail') {
                    const url = `
                        https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=I want to share something important with you&body=I found this at efficasafe.com, %0D%0A the herb-drug interaction platform
                        %0D%0A %0D%0A ${this.shareURL} %0D%0A
                    `;
                    window.open(url, '_blank').focus();
                } else {
                    window.open(`
                        mailto:?to=&subject=I want to share something important with
                        you&body=I found this at efficasafe.com, %0D%0A the herb-drug interaction platform
                        %0D%0A %0D%0A ${this.shareURL} %0D%0A
                    `);
                }
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
        LinkVariantIcon,
        Radio
    }
}
</script>