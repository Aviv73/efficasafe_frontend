<template>
    <div class="about-page">
        <header class="about-page-header flex-center">
            <router-link to="/">
              <img :src="require('@/client/assets/imgs/flat-logo.png')" alt="Logo" />
            </router-link>
        </header>
        <article class="about-page-container">
            <h1>About us</h1>
            <p class="about-page-opener about-page-paragraph">
              Our mission is to provide doctors, pharmacists,
              and healthcare providers access to the most extensive, updated,
              evidence-based interaction data,
              enabling them to optimize the efficacy and safety of integrative medical care.
            </p>
            <h2>Our story</h2>
            <p class="about-page-paragraph">
              As professional healthcare providers,
              we understand that to make informed clinical decisions,
              it is vital to have reliable, easily accessible information at hand.
              With vast amounts of information available from a diverse range of sources,
              there is not always time or opportunity to sift through all the data.
              Efficasafe solves this challenge by aggregating and organizing relevant
              information into concise clinical recommendations, accessible in real-time.
            </p>
            <div class="about-page-card">
                Efficasafe encourages doctors to <span>inquire</span> what herbs,
                drugs and supplements the patient is taking and the <span>reliable data</span> to know,
                in real-time whether or not negative or synergistic <span>interactions</span> may occur.
                They can utilize the data to <span>recommend</span> supplements that <span>support</span> prescribed
                drugs for <span>increased efficacy</span>. <span>That’s revolutionary!</span>
            </div>
            <h2>Our editorial philosophy</h2>
        </article>
    </div>
</template>
