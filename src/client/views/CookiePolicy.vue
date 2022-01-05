<template>
    <section class="terms-and-conditions">
        <page-header />
        <article>
            <div class="main-container">
                <h1 class="heading1 bottom-gap">Cookie Policy</h1>
                <h2 class="heading2">
                    What are cookies and how are they used on this website?
                </h2>
                <p class="bottom-gap">
                    Cookies are small text files that are stored on your
                    computer when you visit websites. We use cookies to make
                    this website work effectively and to track usage of the site
                    so we can continue to make improvements and develop the site
                    appropriately.
                </p>
                <h2 class="heading2">What cookies are used on this website?</h2>
                <ol class="bottom-gap">
                    <li>
                        Connect.sid - Allows you to stay logged in to the
                        website after exiting/refreshing.
                    </li>
                    <li>
                        Autopilot - Allows us to send you emails.
                    </li>
                    <li>
                        GA - We use Google Analytics to keep track of the app's statistics.
                    </li>
                </ol>
                <h2 class="heading2">How do I change my cookie settings?</h2>
                <p>
                    By default, cookies should be enabled on your computer or
                    device. If not, your experience on this website will be
                    negatively impacted. You can also alter your cookie settings
                    in your browser. 
                </p>
                <p class="bottom-gap">Find out more at <a class="link" href="https://www.aboutcookies.org/" target="_blank">AboutCookies.org</a>.</p>
            </div>
        </article>
    </section>
</template>

<script>
import PageHeader from '@/client/cmps/shared/PageHeader';

export default {
    components: {
        PageHeader,
    },
};
</script>
