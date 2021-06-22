<template>
    <section class="page-not-found flex-coloumn">
        <error-404 />
        <button
            class="btn"
            @click="$router.push('/')"
        >
            Go back
        </button>
    </section>
</template>

<script>
import Error404 from '@/client/cmps/shared/Error404';

export default {
    components: {
        Error404
    }
}
</script>