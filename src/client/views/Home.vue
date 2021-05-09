<template>
    <section class="home">
        <welcome-modal v-if="welcomeModal" @closeModal="welcomeModal = false" />
        <pass-change-success
            v-if="passwordModal"
            @closeModal="passwordModal = false"
        />
        <header class="flex-coloumn">
            <h1 class="flex-coloumn">
                <a href="/">
                    <img
                        src="@/client/assets/imgs/logo.png"
                        alt="Efficasafe Logo"
                    />
                </a>
                <span>
                    Optimizing <span class="keyword1">efficacy</span> and
                    <span class="keyword2">safety</span>
                </span>
            </h1>
            <div class="home-container">
                <autocomplete
                    class="home-search"
                    :placeholder1="
                        isScreenNarrow
                            ? 'Search drug / herb'
                            : 'Search drug / herb / supplement'
                    "
                    placeholder2="Add another"
                    @item-selected="goToSearch"
                />
                <h2 class="home-subheader">
                    <span class="font-bold">Herb-Drug-Supplement</span>
                    Interaction platform
                </h2>
            </div>
        </header>
        <section class="home-stats">
            <div class="home-container">
                <ul class="flex-space-between">
                    <li class="flex-coloumn">
                        <animated-integer
                            :value="stats.totalClinicalCount"
                            :duration="2.5"
                        />
                        Clinical trials
                    </li>
                    <li class="flex-coloumn">
                        <animated-integer
                            :value="stats.totalPreClinicalCount"
                            :duration="2.5"
                        />
                        Pre-clinical trials
                    </li>
                    <li class="flex-coloumn">
                        <animated-integer
                            :value="stats.totalArticlesCount"
                            :duration="2.5"
                        />
                        Other articles
                    </li>
                </ul>
            </div>
            <div class="home-container">
                <swiper class="home-swiper home-container" auto-play>
                    <p class="home-stats-quote">
                        Finally! One site with everything in it. I believe that
                        professionals have been waiting for something like this
                        to come along for a very long time.
                        <span>Dr. Mark Epstein</span>
                    </p>
                    <p class="home-stats-quote">
                        Efficasafe allows me to search, cross-reference and get
                        all the information I need, in seconds. It also gives me
                        positive interactions - something I have never been able
                        to access anywhere else.
                        <span>Daniel Miller, PHD</span>
                    </p>
                    <p class="home-stats-quote">
                        This site is one of the most fully comprehensive,
                        reliable resources I have come across for herb-drug
                        interactions. This kind of scientifically backed
                        information is priceless to me as a physician.
                        <span>Dr. John Barrion</span>
                    </p>
                    <p class="home-stats-quote">
                        I'll admit that I'm not the most tech-savvy person. This
                        site is so easy to use it has quickly become my go-to
                        for all medicinal interactions and an integral part of
                        my everyday practice as a pharmacist.
                        <span>Silvia Augustus, PharmD</span>
                    </p>
                    <p class="home-stats-quote">
                        ...So much more than just an interaction checker. I can
                        save my searches and even get recommendations on what to
                        monitor. Both features enable better patient care, which
                        at the end of the day, is what we are all aiming for.
                        <span>Margaret Elsindor</span>
                    </p>
                    <template #navigation-prev>
                        <chevron-left-icon :size="36" />
                    </template>
                    <template #navigation-next>
                        <chevron-right-icon :size="36" />
                    </template>
                </swiper>
            </div>
        </section>
        <section class="home-content">
            <ul class="home-content-list">
                <li class="home-content-list-item">
                    <article class="main-container">
                        <h1>Search</h1>
                        <p>
                            <span class="font-bold">Cross check</span> multiple
                            Drug-Drug and Herb-Supplement-Drug interactions
                            instantly.
                            <span class="font-bold">Receive</span> concise
                            recommendations, summaries, and detailed study
                            reviews.
                        </p>
                    </article>
                    <img
                        src="@/client/assets/imgs/capsules1.svg"
                        alt="Capsules"
                        class="capsules capsules-1"
                    />
                </li>
                <li class="home-content-list-item">
                    <article class="main-container">
                        <h1>Optimize treatment</h1>
                        <p>
                            <span class="font-bold">Provide</span> the best
                            integrative treatment through access to vital
                            information on both negative and synergistic
                            Herb-Supplement-Drug interactions.
                        </p>
                    </article>
                    <img
                        src="@/client/assets/imgs/capsules2.svg"
                        alt="Capsules"
                        class="capsules capsules-2"
                    />
                </li>
                <li class="home-content-list-item">
                    <article class="main-container">
                        <h1>Ensure safety</h1>
                        <p>
                            <span class="font-bold">Provide</span> optimal
                            protection from undesired interactions.
                        </p>
                    </article>
                </li>
                <li class="home-content-list-item">
                    <article class="main-container">
                        <h1>Monitor</h1>
                        <p>
                            <span class="font-bold">Gain valuable</span>
                            insights on which clinical and laboratory parameters
                            to monitor per individual patient profile or
                            interaction.
                        </p>
                    </article>
                </li>
                <li class="home-content-list-item">
                    <article class="main-container">
                        <h1>Empower patients</h1>
                        <p>
                            <span class="font-bold">Supply</span> reliable,
                            referenced information to help patients better
                            understand their medications and/or supplements.
                        </p>
                    </article>
                </li>
            </ul>
        </section>
    </section>
</template>

<script>
import Swiper from '@/client/cmps/common/Swiper';
import AnimatedInteger from '@/client/cmps/common/AnimatedInteger';
import Autocomplete from '@/client/cmps/shared/Autocomplete';
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue';
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft.vue';
import WelcomeModal from '../cmps/shared/modals/WelcomeModal.vue';
import PassChangeSuccess from '../cmps/shared/modals/PassChangeSuccess.vue';

export default {
    name: 'Home',
    data() {
        return {
            stats: {
                totalClinicalCount: 0,
                totalPreClinicalCount: 0,
                totalArticlesCount: 0,
            },
            searches: [],
            welcomeModal: false,
            passwordModal: false,
        };
    },
    computed: {
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
    },
    methods: {
        goToSearch(query) {
            this.searches.push(query);
            if (this.searches.length === 2) {
                const [q1, q2] = this.searches;
                this.$router.push(`/search?q=${q1}&q=${q2}`);
            }
        },
    },
    async created() {
        this.stats = await this.$store.dispatch({ type: 'getStatistics' });
        if (this.$route.query.congratulations) this.welcomeModal = true;
        if (this.$route.query.passwordreset) this.passwordModal = true;
    },
    components: {
        Swiper,
        AnimatedInteger,
        Autocomplete,
        ChevronRightIcon,
        ChevronLeftIcon,
        WelcomeModal,
        PassChangeSuccess,
    },
};
</script>