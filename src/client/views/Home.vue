<template>
    <section class="home">
      <header>
        <h1>
            <a href="/">
                <img src="@/client/assets/imgs/logo-symbol.png" alt="Logo" />
                <img src="@/client/assets/imgs/logo-txt.png" alt="Efficasafe" />
            </a>
        </h1>
        <section class="home-search">SERCH GOES HERE!</section>
        <h2 class="home-subheader">
            Optimizing efficacy and safety of integrated medical treatments
        </h2>
      </header>
        <section class="home-stats">
          <ul>
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
          Cross-check multiple drugs, herbs and supplements in order to optimize
          <span class="d-block">safety and efficiency of integrative medical care.</span>
          <img src="@/client/assets/imgs/logo-symbol.png" alt="Logo" class="home-footer-logo" />
        </footer>
        <span class="hr"></span>
    </section>
</template>

<script>
export default {
    name: 'Home',
};
</script>
