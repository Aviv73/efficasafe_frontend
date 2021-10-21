<template>
    <section class="about-page">
        <page-header />
        <article class="about-page-container">
            <h1 class="heading1">About us</h1>
            <p class="about-page-opener about-page-paragraph">
              Our mission is to provide doctors, pharmacists,
              and healthcare providers access to the most extensive, updated,
              evidence-based interaction data,
              enabling them to optimize the efficacy and safety of integrative medical care.
            </p>
            <h2 class="heading2">Our story</h2>
            <p class="about-page-paragraph">
              As professional healthcare providers,
              we understand that in order to make informed clinical decisions,
              it is vital to have reliable, easily accessible information at hand.
              With vast amounts of information available from a diverse range of sources,
              there is not always time or opportunity to sift through all the data.
              Efficasafe solves this challenge by aggregating and organizing relevant
              information into concise clinical recommendations, accessible in real-time.
            </p>
            <div class="about-page-card">
                Efficasafe encourages doctors to <span class="marked">inquire</span> what herbs,
                drugs and supplements the patient is taking and the <span class="marked">reliable data</span> to know,
                in real-time whether or not negative or synergistic <span class="marked">interactions</span> may occur.
                They can utilize the data to <span class="marked">recommend</span> supplements that <span class="marked">support</span> prescribed
                drugs for <span class="marked">increased efficacy</span>. <span class="marked">That’s revolutionary!</span>
            </div>
            <h2 class="heading2">Our editorial philosophy</h2>
            <ul class="styled-ul">
                <li>
                    <span class="marked">Content:</span>
                    all of our content is evidence-based, reviewed and developed from accepted medical
                    sources.
                </li>
                <li>
                    <span class="marked">Clarity:</span>
                    all of our information is analyzed and organized to provide clear and concise
                    clinically-relevant data for use at the point of care.
                </li>
                <li>
                    <span class="marked">Conflict of interest:</span>
                    we do not accept advertisements or any other kind of commercial support.
                </li>
            </ul>
            <router-link
              class="about-page-link"
              to="/principles-and-processes"
            >
              Read more
            </router-link>
            <h2 class="heading2 txt-center">Testimonials</h2>
            <swiper
              hide-navigation
              pagination-prev-next
              auto-play
            >
                <div class="about-page-slide">
                    <div class="about-page-slide-card">
                        “I’ll admit that I’m not the most tech-savvy person.
                        This site is so easy to navigate that I can find exactly
                        what I need quickly and without technical know-how.
                        Efficasafe has quickly become my go-to for all medicinal
                        interactions and an integral part of my everyday practice as a pharmacist.”
                    </div>
                    <div class="about-page-slide-card">
                        “Efficasafe allows me to search,
                        cross-reference and get all the information I need,
                        in seconds. It also gives me positive interactions – something
                        I have never been able to access anywhere else.
                        This kind of scientifically backed information is priceless to me as a physician.”
                    </div>
                </div>
                <div class="about-page-slide">
                    <div class="about-page-slide-card"> 
                        “I'll admit that I'm not the most tech-savvy person. This
                        site is so easy to use it has quickly become my go-to
                        for all medicinal interactions and an integral part of
                        my everyday practice as a pharmacist.”
                    </div>
                    <div class="about-page-slide-card"> 
                        “...So much more than just an interaction checker. I can
                        save my searches and even get recommendations on what to
                        monitor. Both features enable better patient care, which
                        at the end of the day, is what we are all aiming for.”
                    </div>
                </div>
                <template #pagination-prev>
                    <chevron-left-circle-icon
                        :size="32"
                        fillColor="#205072"
                        title=""
                    />
                </template>
                <template #pagination-next>
                    <chevron-right-circle-icon
                        :size="32"
                        fillColor="#205072"
                        title=""
                    />
                </template>
            </swiper>
            <h2 class="heading2 txt-center">Powered by</h2>
            <div class="flex-center">
                <img
                  class="about-page-drugbank-logo"
                  :src="require('@/cms/assets/drugbank.png')"
                  alt="Drugbank logo"
                />
            </div>
        </article>
    </section>
</template>

<script>
import PageHeader from '@/client/cmps/shared/PageHeader';
import Swiper from '@/client/cmps/common/Swiper';

import ChevronLeftCircleIcon from 'vue-material-design-icons/ChevronLeftCircle';
import ChevronRightCircleIcon from 'vue-material-design-icons/ChevronRightCircle';

export default {
  components: {
    Swiper,
    ChevronLeftCircleIcon,
    ChevronRightCircleIcon,
    PageHeader
  }
}
</script>