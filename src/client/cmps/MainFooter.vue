<template>
    <footer class="main-footer">
        <img src="@/client/assets/imgs/logo-symbol.png" alt="Efficasafe logo" class="main-footer-logo" />
        <small class="main-footer-details">
            <span class="d-block">
                Copyright © efficasafe | All RIghts Reserved | Site Last Updated {{ lastSiteUpdate | moment('LL') }} | Phone: +972-35105050 | Address: Naturopedia Ltd, 11 Hatavor st. Tel-Aviv
            </span>
            <router-link to="/terms-and-conditions" class="link">Terms and Conditions</router-link>
            | <router-link to="/privacy-statement" class="link">Privacy Policy</router-link>
            | Email: <a href="mailto:contact@efficasafe.com" class="link">contact@efficasafe.com</a>
        </small>
    </footer>
</template>

<script>
export default {
    computed: {
        lastSiteUpdate() {
            return new Date(document.lastModified);
        }
    }
}
</script>