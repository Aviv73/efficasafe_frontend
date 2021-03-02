<template>
    <section class="home">
        <header>
            <h1>
                <a href="/">
                    <img
                        src="@/client/assets/imgs/logo-symbol.png"
                        alt="Logo"
                    />
                    <img
                        src="@/client/assets/imgs/logo-txt.png"
                        alt="Efficasafe"
                    />
                </a>
            </h1>
            <section class="home-content">
              <div class="container">
                <div class="home-content-container">
                  <font-awesome-icon icon="chevron-left" class="chevron fa-2x" />
                  <form @submit.prevent="" class="home-content-form">
                    <input type="text" placeholder="Search herb / drug" />
                    <input type="text" placeholder="Add another" />
                  </form>
                  <font-awesome-icon icon="chevron-right" class="chevron fa-2x" />
                </div>
              </div>
            </section>
            <h2 class="home-subheader">
                Optimizing efficacy and safety of integrated medical treatments
            </h2>
        </header>
        <section class="home-stats">
            <ul class="flex-space-between">
                <li>
                    <span>1150</span>
                    Clinical trials
                </li>
                <li>
                    <span>48000</span>
                    Pre-clinical trials
                </li>
                <li>
                    <span>93414</span>
                    Articles
                </li>
            </ul>
        </section>
        <footer class="home-footer">
            <span class="home-footer-txt">
                Cross-check multiple drugs, herbs and supplements in order to
                optimize safety and efficiency of integrative medical care.
            </span>
            <img
                src="@/client/assets/imgs/logo-symbol.png"
                alt="Logo"
                class="home-footer-logo"
            />
        </footer>
        <span class="hr" />
    </section>
</template>

<script>
export default {
    name: 'Home',
};
</script>
