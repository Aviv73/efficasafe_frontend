<template>
    <section class="home">
        <header>
            <h1>
                <a href="/">
                    <img
                        src="@/client/assets/imgs/logo.png"
                        alt="Efficasafe Logo"
                    />
                </a>
                <span>
                    Optimizing <span class="keyword1">efficacy</span> and
                    <span class="keyword2">safety</span>
                    <span class="sub"> of integrated medical treatments </span>
                </span>
            </h1>
            <div class="home-container">
                <form @submit.prevent="" class="home-form">
                    <input type="text" placeholder="Search herb / drug" />
                    <input type="text" placeholder="Add another" />
                </form>
            </div>
        </header>
        <section class="home-stats">
            <div class="home-container">
                <ul class="flex-space-between">
                    <li>
                        <span>1,150</span>
                        Clinical trials
                    </li>
                    <li>
                        <span>48,000</span>
                        Pre-clinical trials
                    </li>
                    <li>
                        <span>93,414</span>
                        Articles
                    </li>
                </ul>
            </div>
            <div class="home-container">
                <swiper class="home-swiper home-container">
                    <p class="home-stats-quote">
                        Finally! One site with everything in it. I believe
                        that professionals have been waiting for something
                        like this to come along for a very long time.
                        <span>Dr. Jonathan Rosenzweig, MD</span>
                    </p>
                    <p class="home-stats-quote">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        <span>Dr. Meshulam Nahari, MD</span>
                    </p>
                    <p class="home-stats-quote">
                        Chicken pig doner, beef ribs picanha venison prosciutto fatback ribeye brisket.
                        Beef ribs chislic ribeye turducken filet mignon prosciutto.
                        <span>Dr. Sus, MD</span>
                    </p>
                </swiper>
            </div>
        </section>
        <section class="home-content">
            <ul class="home-content-list">
                <li class="home-content-list-item">
                    <!-- <article>
                        <h1>Search</h1>
                        <p>
                            Cross check multiple Drug-Drug and Herb-Supplement-Drug interactions instantly.
                            Receive concise recommendations, summaries, and detailed study reviews.
                        </p>
                    </article> -->
                </li>
                <li class="home-content-list-item"></li>
                <li class="home-content-list-item"></li>
                <li class="home-content-list-item"></li>
                <li class="home-content-list-item"></li>
            </ul>
        </section>
    </section>
</template>

<script>
import Swiper from '@/client/cmps/common/Swiper';

export default {
    name: 'Home',
    components: {
        Swiper
    }
};
</script>