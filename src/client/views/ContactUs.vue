<template>
    <section class="contact-us">
        <div class="contact-us-container side-by-side-container">
            <span class="brim-start" />
            <header>
                <router-link to="/">
                    <img :src="require('@/client/assets/imgs/flat-logo.png')" alt="Logo" />
                </router-link>
                <h2 class="heading1">Contact us</h2>
                <p>
                    <span class="d-block">
                        We are here to answer any questions you may have.
                    </span>
                    Reach out to us by completing the form below and we'll respond as soon as we can.
                </p>
            </header>
            <main>
                <form @submit.prevent="">
                </form>
            </main>
            <span class="brim-end" />
        </div>
    </section>
</template>

<script>
export default {

}
</script>