<template>
    <section></section>
</template>

<script>

import { storageService } from '@/cms/services/storage.service';

export default {
    async created() {
        storageService.store('show-failed-login', true);
        this.$router.push('/')
    }
};
</script>