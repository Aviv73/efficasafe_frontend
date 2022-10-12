<template>
    <section class="home">
        <header class="flex-coloumn">
            <h1 class="flex-coloumn">
                <a href="/">
                    <img
                        src="@/client/assets/imgs/logo.png"
                        alt="Efficasafe Logo"
                    />
                </a>
                <span class="header">
                    <span class="font-bold">Herb-Drug-Supplement</span>
                    Interaction platform
                </span>
            </h1>
            <div class="home-container flex-coloumn">
                <autocomplete
                    class="home-search"
                    :placeholder1="
                        isScreenNarrow
                            ? 'Add drug / herb'
                            : 'Add drug / herb / supplement'
                    "
                    placeholder2="Add another"
                    @item-selected="goToSearch"
                />
                <button class="btn home-cta" @click="searchWithBtn">
                    Get interactions
                </button>
                <h2 class="home-subheader">
                    Optimizing <span class="keyword1">efficacy</span> and
                    <span class="keyword2">safety</span>
                </h2>

                <template v-if="managementData">
                    <div v-if="isFirstTime" class="home-ftu-container">
                        <h3 class="first">Try our platform - Get {{managementData.freeSearchesNum}} free searches</h3>
                        <h3 class="card">No credit card required.</h3>
                    </div>
                    <div v-else-if="!loggedInUser" class="home-ftu-container">
                        <h3 class="first">Get a free {{managementData.freeTrailDaysNum}} day trial of unlimited searches and features!</h3>
                        <h3 class="card">No credit card required.</h3>
                        <button class="trial-btn" @click="$emit('signup');">Start a free trial now</button>
                    </div>
                </template>
                
            </div>
        </header>
        <section class="home-stats">
            <div class="home-container">
                <h3 class="stats-header">Our database is based on:</h3>
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
            <div v-if="isScreenNarrow" class="home-container">
                <swiper class="home-swiper home-container" auto-play>
                    <div class="home-stats-quote">
                        <div class="home-stats-quote-img-container">
                            <img
                                src="@/client/assets/imgs/recommender2.png"
                                class="quote-img"
                                alt=""
                            />
                            <p>
                                Michal Kirsh, ND, RH AHG, Head of herbalism
                                program, Broshim School of complementary
                                medicine.
                            </p>
                        </div>
                        "This site is by far the most fully comprehensive,
                        reliable resource I have come across for herb-drug
                        interactions. I believe that professionals have been
                        waiting for something like this to come along for a very
                        long time."
                    </div>
                    <div class="home-stats-quote">
                        <div class="home-stats-quote-img-container">
                            <img
                                src="@/client/assets/imgs/recommender4.png"
                                class="quote-img"
                                alt=""
                            />
                            <p>Vardit Kalamaro, Pharm.D</p>
                        </div>
                        "This site is so easy to use it has quickly become an
                        integral part of my everyday practice as a clinical
                        pharmacist. There is no better drug-supplement
                        interaction checker than Efficasafe. Easy to use, and
                        good for quick decision making."
                    </div>
                    <div class="home-stats-quote">
                        <div class="home-stats-quote-img-container">
                            <img
                                src="@/client/assets/imgs/recommender3.png"
                                class="quote-img"
                                alt=""
                            />
                            <p>
                                Inbale Dressler, ND, RH AHG, Davidoff cancer
                                center, Integrative Medicine Unit.
                            </p>
                        </div>
                        "So much more than just an interaction checker. I can
                        save my searches (my patients) and even get notified
                        when the interactions I saved have been updated. That’s
                        a game-changer that enables better patient care, which
                        at the end of the day, is what we are all aiming for."
                    </div>
                    <div class="home-stats-quote">
                        <div class="home-stats-quote-img-container">
                            <img
                                src="@/client/assets/imgs/recommender1.png"
                                class="quote-img"
                                alt=""
                            />
                            <p>Keren Volkomir, Naturopth.</p>
                        </div>
                        "Finally! One site with everything in it. Efficasafe
                        allows me to search, cross-reference and get all the
                        information I need, in seconds. This kind of
                        scientifically backed information is priceless to me as
                        a Naturopath."
                    </div>
                    <template #navigation-prev>
                        <chevron-left-icon :size="36" title="" />
                    </template>
                    <template #navigation-next>
                        <chevron-right-icon :size="36" title="" />
                    </template>
                </swiper>
            </div>
            <div v-else class="home-container">
                <swiper class="home-swiper home-container" auto-play>
                    <div class="home-stats-quote-wide">
                        <img
                            src="@/client/assets/imgs/recommender2.png"
                            class="quote-img"
                            alt=""
                        />
                        <div class="home-stats-quote-txt-container">
                            <p>
                                "This site is by far the most fully
                                comprehensive, reliable resource I have come
                                across for herb-drug interactions. I believe
                                that professionals have been waiting for
                                something like this to come along for a very
                                long time."
                            </p>
                            <p class="title">
                                Michal Kirsh, ND, RH AHG, Head of herbalism
                                program, Broshim School of complementary
                                medicine.
                            </p>
                        </div>
                    </div>
                    <div class="home-stats-quote-wide">
                        <img
                            src="@/client/assets/imgs/recommender4.png"
                            class="quote-img"
                            alt=""
                        />
                        <div class="home-stats-quote-txt-container">
                            <p>
                                "This site is so easy to use it has quickly
                                become an integral part of my everyday practice
                                as a clinical pharmacist. There is no better
                                drug-supplement interaction checker than
                                Efficasafe. Easy to use, and good for quick
                                decision making."
                            </p>
                            <p class="title">Vardit Kalamaro, Pharm.D</p>
                        </div>
                    </div>
                    <div class="home-stats-quote-wide">
                        <img
                            src="@/client/assets/imgs/recommender3.png"
                            class="quote-img"
                            alt=""
                        />
                        <div class="home-stats-quote-txt-container">
                            <p>
                                "So much more than just an interaction checker.
                                I can save my searches (my patients) and even
                                get notified when the interactions I saved have
                                been updated. That’s a game-changer that enables
                                better patient care, which at the end of the
                                day, is what we are all aiming for."
                            </p>
                            <p class="title">
                                Inbale Dressler, ND, RH AHG, Davidoff cancer
                                center, Integrative Medicine Unit.
                            </p>
                        </div>
                    </div>
                    <div class="home-stats-quote-wide">
                        <img
                            src="@/client/assets/imgs/recommender1.png"
                            class="quote-img"
                            alt=""
                        />
                        <div class="home-stats-quote-txt-container">
                            <p>
                                "Finally! One site with everything in it.
                                Efficasafe allows me to search, cross-reference
                                and get all the information I need, in seconds.
                                This kind of scientifically backed information
                                is priceless to me as a Naturopath."
                            </p>
                            <p class="title">Keren Volkomir, Naturopth.</p>
                        </div>
                    </div>
                    <template #navigation-prev>
                        <chevron-left-icon :size="36" title="" />
                    </template>
                    <template #navigation-next>
                        <chevron-right-icon :size="36" title="" />
                    </template>
                </swiper>
            </div>
        </section>
        <section class="home-content">
            <ul class="home-content-list">
                <li class="home-content-list-item">
                    <article class="main-container">
                        <h1>Search</h1>
                        <p class="margin-bottom-40">
                            <span class="font-bold">Cross check</span> multiple
                            Drug-Drug and Herb-Supplement-Drug interactions
                            instantly.
                        </p>
                        <p>
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
            <button class="btn home-cta bottom-btn" @click="searchWithBtn">
                Get interactions
            </button>
             <template v-if="managementData">
                    <div v-if="isFirstTime" class="home-ftu-container bottom">
                        <h3 class="first">Try our platform - Get {{managementData.freeSearchesNum}} free searches</h3>
                        <h3 class="card">No credit card required.</h3>
                    </div>
                    <div v-else-if="!loggedInUser" class="home-ftu-container bottom">
                        <h3 class="first">Get a free {{managementData.freeTrailDaysNum}} day trial of unlimited searches and features!</h3>
                        <h3 class="card">No credit card required.</h3>
                        <button class="trial-btn" @click="$emit('signup');">Start a free trial now</button>
                    </div>
            </template>
        </section>
        <welcome-modal v-if="welcomeModal" @closeModal="welcomeModal = false" />
        <pass-change-success
            v-if="passwordModal"
            @closeModal="passwordModal = false"
        />
    </section>
</template>

<script>
import Swiper from '@/client/cmps/common/Swiper';
import AnimatedInteger from '@/client/cmps/common/AnimatedInteger';
import Autocomplete from '@/client/cmps/shared/Autocomplete';
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight';
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft';
import WelcomeModal from '../cmps/shared/modals/WelcomeModal';
import PassChangeSuccess from '../cmps/shared/modals/PassChangeSuccess';
import { storageService } from '@/cms/services/storage.service';
import { eventBus, EV_clear_input, EV_show_user_msg } from '@/cms/services/eventBus.service';

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
            isFirstTime: false
        };
    },
    computed: {
        isScreenNarrow() {
            return this.$store.getters.isScreenNarrow;
        },
        loggedInUser() {
            return this.$store.getters.loggedInUser;
        },
        freeSearchesCount() {
            return this.$store.getters.getFreeSearchesCount;
        },
        managementData(){
            return this.$store.getters.getManagementData;
        },
    },
    methods: {
        goToSearch(query) {
            if(query.nestedMaterials.length){
                this.searches = [...this.searches, ...query.nestedMaterials]
            }else{
                this.searches.push(query.txt);
            }
            if (!this.loggedInUser) {
                if (this.freeSearchesCount <= 0) {
                    this.$emit('showAuth');
                    return;
                }
                this.$store.commit('reduceFreeSearches');
            }
            if (this.searches.length >= 2) {
                const searchQuery = this.searches.map( (q, idx) => {
                    const firstChar = idx === 0 ? '?' : '&'
                    return `${firstChar}q=${q}`
                }).join('')
                this.$router.push(`/search${searchQuery}`);
            } else if (this.searches.length === 1) {
                eventBus.$emit(EV_clear_input);
            }
        },
        searchWithBtn() {
            if (!this.loggedInUser) {
                if (this.freeSearchesCount <= 0) {
                    this.$emit('showAuth');
                    return;
                }
                this.$store.commit('reduceFreeSearches');
            }
            if (this.searches.length === 0) {
                this.$router.push(`/search`);
            }
            if (this.searches.length === 1) {
                this.$router.push(`/search?q=${this.searches[0]}`);
            }
        },
    },
    async created() {
        this.stats = await this.$store.dispatch({ type: 'getStatistics' });
        const isFirstTime = storageService.load('first')
        if(!isFirstTime){
            this.isFirstTime = true
            storageService.store('first', true)
        }
        if (this.$route.query.congratulations) this.welcomeModal = true;
        if (this.$route.query.passwordreset) this.passwordModal = true;
        if (this.$route.query.subscribed) eventBus.$emit(EV_show_user_msg, 'Subscription successful', 5000, 'success')
        if (this.$route.query.emailPrefs) eventBus.$emit(EV_show_user_msg, 'Your email preferences were successfully updated', 5000, 'success')
        if (this.$route.query.trailAdded) eventBus.$emit(EV_show_user_msg, 'Your trial time has been updated successfully', 5000, 'success')
        if (storageService.load('show-failed-login')){
            eventBus.$emit('login-not-same-provider')
            storageService.remove('show-failed-login')
        } 
        
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
