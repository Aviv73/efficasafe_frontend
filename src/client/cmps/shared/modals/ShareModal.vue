<template>
    <aside class="share-modal">
        <header class="share-modal-header flex-space-between">
            <share-variant-icon :size="18" />
            <h5>Share your search results</h5>
            <button
                class="close-btn"
                @click="closeModal"
            >
                <close-icon :size="14" />
            </button>
        </header>
        <main class="share-modal-content">
            <button
                class="share-modal-content-btn copy-btn"
                :class="{
                    'copy-success': linkCopySuccess,
                    'copy-fail': linkCopyFail
                }"
                v-clipboard:copy=" newTokenCode ?  shareURLWithToken : shareURL"
                v-clipboard:success="onCopy"
                v-clipboard:error="onCopyFail"
            >
                <link-variant-icon :size="14" />
                {{ linkCopySuccess ? 'Link copied' : linkCopyFail ? 'Copy failed' : 'Copy link' }}
            </button>
            <div class="flex-align-center">
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
import { storageService } from '@/cms/services/storage.service';
import { tokenService } from '@/cms/services/token.service';

import Radio from '@/client/cmps/common/Radio';

import ShareVariantIcon from 'vue-material-design-icons/ShareVariant';
import LinkVariantIcon from 'vue-material-design-icons/LinkVariant';
import CloseIcon from 'vue-material-design-icons/Close';

export default {
    data() {
        return {
            mailWith: storageService.load('prefferd-mail-service') || 'default',
            linkCopySuccess: false,
            linkCopyFail: false,
            newTokenCode: null
        }
    },
    computed: {
        shareURL() {
            return `${window.location.origin}${this.$route.fullPath}`;
        },
        shareURLWithToken(){
            return `${window.location.origin}${this.$route.fullPath}&share=${this.newTokenCode}`
        },
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
        async onShare() {
            const linkToShare = this.newTokenCode ? encodeURIComponent(this.shareURLWithToken) : encodeURIComponent(this.shareURL)
            if (this.hasShareSupport) {
                const shareData = {
                    title: 'Efficasafe',
                    text: 'share your search results',
                    url: linkToShare
                };
                navigator.share(shareData);
            } else {
                storageService.store('prefferd-mail-service', this.mailWith);
                const emailEnding = this.newTokenCode ? '%0D%0A%0D%0APlease note, this link will only be valid for a week.' : ''
                if (this.mailWith === 'gmail') {
                    const url = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=I want to share something important with you&body=I found this at efficasafe.com, the herb-drug interaction platform.%0D%0A${linkToShare}${emailEnding}`;
                    window.open(url, '_blank').focus();
                } else {
                    window.open(`mailto:?to=&subject=I want to share something important with you&body=I found this at efficasafe.com, the best herb-drug interaction platform.%0D%0A${linkToShare}${emailEnding}`);
                }
            }
        },
        closeModal() {
            this.linkCopyFail = false;
            this.linkCopySuccess = false;
            this.$emit('close-modal');
        },
        onCopy() {
            this.linkCopySuccess = true;
        },
        onCopyFail() {
            this.linkCopyFail = true;
        }
    },
    async created(){
        if(this.$route.path === "/search" || this.$route.path === "/search/positive-boosters"){
            const newTokenCode = await tokenService.add()
            this.newTokenCode = newTokenCode
        }
    },
    components: {
        ShareVariantIcon,
        LinkVariantIcon,
        CloseIcon,
        Radio
    }
}
</script>