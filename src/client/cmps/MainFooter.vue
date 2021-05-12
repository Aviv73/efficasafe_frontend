<template>
    <footer class="main-footer">
        <img src="@/client/assets/imgs/logo-symbol.png" alt="Efficasafe logo" class="main-footer-logo" />
        <small class="main-footer-details">
            Copyright © efficasafe | All RIghts Reserved | Site Last Updated {{ lastSiteUpdate | moment('LL') }}
            | <router-link to="/privacy-statement" class="link">Privacy Policy</router-link> | Complaints Procedure
            <router-link to="/terms-and-conditions" class="link">Terms and Conditions</router-link>
            | Email: <a href="mailto:info@efficasafe.com" class="link">info@efficasafe.com</a>
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