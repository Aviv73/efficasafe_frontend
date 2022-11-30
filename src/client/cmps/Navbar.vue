<template>
  <nav class="navbar no-print" :class="{ light: isNavIntersecting }" ref="navbar">
    <div class="main-containerr">
      <div class="actual-nav">
        <div class="navbar-msgs flex-center nav-part">
          <div class="flex-center">
            <router-link to="/" title="Home" class="logo">
              <img src="@/client/assets/imgs/efficasafe-logo-light.svg" alt="Efficasafe" />
              <img class="logo-name" src="@/client/assets/imgs/efficasafe-light.svg" alt="Efficasafe" />
            </router-link>
          </div>
        </div>

        <template>
          <button class="navbar-toggle" @click="toggleNavActive" title="Side menu">
            <menu-icon title="" />
          </button>
          <router-link v-if="isScreenNarrow" to="/" title="Home" class="logo-mobile">
            <img src="@/client/assets/imgs/efficasafe-logo-light.svg" alt="Efficasafe" />
            <img class="logo-name" src="@/client/assets/imgs/efficasafe-light.svg" alt="Efficasafe" />
          </router-link>
          <div class="navbar-overlay" :class="{ active: isNavActive }" @click="toggleNavActive"></div>
          <ul class="navbar-nav nav-part" :class="{ active: isNavActive }" v-hammer:swipe.left="toggleNavActive">
            <li @click="toggleNavActive" class="list-logo-container">
              <!-- <router-link to="/" title="Home" class="logo">
                <img src="@/client/assets/imgs/efficasafe-logo.svg" alt="Efficasafe" />
                <img class="logo-name" src="@/client/assets/imgs/efficasafe.svg" alt="Efficasafe" />
              </router-link> -->
              <button v-if="isScreenNarrow" class="navbar-side-nav-close-btn" @click.stop="toggleNavActive(false)">
                <close-icon title="" />
              </button>
            </li>
            <!-- <li>
                            <button v-if="!isScreenNarrow && ($route.name === 'Results' || $route.name === 'Boosters' || $route.name === 'InteractionDetails' || $route.name === 'VinteractionDetails')" 
                                @click="activeReleventTour"
                                :title="tourBtnTitle"
                                class="tour-btn">
                                    Take a tour
                            </button>
                        </li> -->
            <li class="navbar-nav-item">
              <dropdown :linksToKeepOpen="['About', 'PrinciplesAndProcesses', 'ContactUs']" :dontHover="isScreenNarrow">
                <template #activator>
                  <div class="flex-align-center">
                    <span> About </span>
                  </div>
                </template>
                <template #content>
                  <div class="navbar-user-dropdown">
                    <div class="navbar-user-dropdown-links">
                      <router-link @click.native="toggleNavActive" to="/about" class="navbar-user-dropdown-item"> About us </router-link>
                      <router-link @click.native="toggleNavActive" to="/principles-and-processes" class="navbar-user-dropdown-item"> Editorial Principles </router-link>
                      <router-link @click.native="toggleNavActive" to="/contact" class="navbar-user-dropdown-item"> Contact us </router-link>
                    </div>
                  </div>
                </template>
              </dropdown>
            </li>
            <li class="navbar-nav-item" @click="toggleNavActive" v-if="!loggedInUser || loggedInUser.type !== 'subscribed'">
              <router-link to="/subscribe"> Pricing </router-link>
            </li>
            <li class="navbar-nav-item" @click="toggleNavActive">
              <router-link to="/search"> Interaction checker </router-link>
            </li>
            <li class="navbar-nav-item" v-if="false">
              <dropdown :dontHover="isScreenNarrow">
                <template #activator>
                  <div class="flex-align-center">
                    <span> Knowladge center </span>
                  </div>
                </template>
                <template #content>
                  <div class="navbar-user-dropdown">
                    <div class="navbar-user-dropdown-links">
                      <router-link @click.native="toggleNavActive" to="/index" class="navbar-user-dropdown-item"> Index </router-link>
                      <router-link @click.native="toggleNavActive" to="/articles" class="navbar-user-dropdown-item"> Articles </router-link>
                      <router-link @click.native="toggleNavActive" to="/thumb_rules" class="navbar-user-dropdown-item"> Thumb rules </router-link>
                      <router-link @click.native="toggleNavActive" to="/new_studies" class="navbar-user-dropdown-item"> New studies </router-link>
                    </div>
                  </div>
                </template>
              </dropdown>
            </li>
          </ul>
        </template>

        <div class="nav-search">
          <router-link to="/search">
            <img src="@/client/assets/imgs/search-icon-header.png" alt="Search" />
          </router-link>
        </div>

        <div class="nav-part last-part">
          <button class="video-btn" @click="openVideoModal">
            <span>Introduction</span>
            <img src="@/client/assets/imgs/introduction-play-btn.svg" alt="Play" />
          </button>

          <dropdown v-if="loggedInUser" class="user-dropdown">
            <template #activator>
              <div class="flex-align-center">
                <!-- <span v-if="true" class="updated user-updated" title="Updated interactions">{{ updatedCount || 5 }}</span> -->
                <span v-if="updatedCount" class="updated user-updated" title="Updated interactions">{{ updatedCount }}</span>

                <span class="flex">
                  {{ loggedInUser.username }}
                </span>
              </div>
            </template>
            <template #content>
              <div class="navbar-user-dropdown">
                <div class="trial-msg" v-if="isTrialMode">
                  <template v-if="loggedInUser.type === 'trial' || true">
                    <p v-if="freeTrialTime > 5">
                      <!-- {{freeTrialMsg}} -->
                      Trial ends on {{ trialEndTime }}
                    </p>
                    <p v-else-if="freeTrialTime > 0" class="warn">
                      <!-- {{freeTrialMsg}} -->
                      Trial ends on {{ trialEndTime }}
                    </p>
                    <router-link class="err" v-else to="/subscribe">Trial ended on {{ trialEndTime }}</router-link>
                  </template>
                  <p v-else-if="!loggedInUser.email_verified">Verify your email for a free trial</p>
                </div>
                <div class="navbar-user-dropdown-links">
                  <router-link to="/account" class="navbar-user-dropdown-item account-col">
                    <span>Account</span>
                    <!-- <span v-if="true" class="updated" title="Updated interactions">{{ updatedCount || 5 }}</span> -->

                    <span v-if="updatedCount" class="updated" title="Updated interactions">{{ updatedCount }}</span>
                  </router-link>
                  <!-- <router-link
                                        to="/contact"
                                        class="navbar-user-dropdown-item"
                                    >
                                        Contact us
                                    </router-link> -->
                </div>
                <button class="navbar-user-dropdown-item" @click="onLogout">Logout</button>
              </div>
            </template>
          </dropdown>
          <button v-else class="login-btn username-container" id="loginBtn" @click="onLogin">Login</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { eventBus, EV_update_nav } from '@/cms/services/eventBus.service';

import Dropdown from '@/client/cmps/common/Dropdown';

import CloseIcon from 'vue-material-design-icons/Close';
import MenuIcon from 'vue-material-design-icons/Menu';
// import MenuDownIcon from 'vue-material-design-icons/MenuDown';
// import HomeIcon from 'vue-material-design-icons/Home';
// import VideoIcon from 'vue-material-design-icons/Youtube';

export default {
  name: 'Navbar',
  data: () => ({
    isNavActive: false,
    isNavIntersecting: false,
    updatedUserSearches: null
  }),
  computed: {
    isTrialMode() {
      // return true;
      return this.loggedInUser && this.loggedInUser.type !== 'subscribed';
    },
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow;
    },
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    userSearches() {
      return this.$store.getters.userSearches;
    },
    freeTrialTime() {
      const {
        loggedInUser: { trialTime }
      } = this.$store.getters;
      const timeLeft = trialTime - Date.now();
      const daysLeft = timeLeft / (1000 * 3600 * 24);
      return daysLeft > 0 ? Math.ceil(daysLeft) : 0;
    },
    tourBtnTitle() {
      if (this.$route.name === 'Results') {
        return 'Get to know our search features';
      }
      if (this.$route.name === 'Boosters') {
        return 'Get to know the Optimizers';
      }
      return 'Get to know the interaction structure';
    },
    freeTrialMsg() {
      if (this.isScreenNarrow) {
        if (this.freeTrialTime === 1) return `Free Trial -  ${this.freeTrialTime} day`;
        return `Free Trial -  ${this.freeTrialTime} days`;
      }
      if (this.freeTrialTime === 1) return `Free Trial - you have ${this.freeTrialTime} day left`;
      return `Free Trial - you have ${this.freeTrialTime} days left`;
    },
    updatedCount() {
      let updatesMap = {};
      if (!this.updatedUserSearches && !this.userSearches) return 0;
      const searches = this.updatedUserSearches || this.userSearches;
      searches.forEach(search => {
        if (search.updates && search.updates.length) {
          search.updates.forEach(update => {
            if (!updatesMap[update.interactionName]) updatesMap[update.interactionName] = true;
          });
        }
      });
      return Object.keys(updatesMap).length;
    },
    trialEndTime() {
      const timePts = new Date(this.loggedInUser.trialTime).toString().split(' ');
      return `${timePts[1]} ${timePts[2]}`;
    }
    // daysTime5() {
    //     return 1000 * 60 * 60 * 24 * 5;
    // }
  },
  methods: {
    activeReleventTour() {
      if (this.$route.name === 'Results') {
        eventBus.$emit('start-tour');
      }
      if (this.$route.name === 'Boosters') {
        eventBus.$emit('start-boosters-tour');
      }
      if (this.$route.name === 'InteractionDetails' || this.$route.name === 'VinteractionDetails') {
        eventBus.$emit('start-interaction-tour');
      }
    },
    openVideoModal() {
      eventBus.$emit('open-video');
    },
    toggleNavActive(val) {
      if (!this.isScreenNarrow) return;
      this.isNavActive = typeof val === 'boolean' ? val : !this.isNavActive;
    },
    onSubscribe() {
      this.$router.push('/subscribe');
    },
    onLogin() {
      this.$emit('login');
    },
    onSignUp() {
      this.$emit('signup');
    },
    async onLogout() {
      await this.$store.dispatch({ type: 'logout' });
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    setNavClassName() {
      if (this.$route.name !== 'Home') {
        this.isNavIntersecting = false;
        return;
      }
      const intersectingEl = document.querySelector('section.home-content');
      const elNav = this.$refs.navbar;
      this.isNavIntersecting = window.scrollY >= intersectingEl.offsetTop - elNav.offsetHeight;
    }
  },
  mounted() {
    document.addEventListener('scroll', this.setNavClassName);
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.setNavClassName);
  },
  created() {
    eventBus.$on(EV_update_nav, searches => {
      this.updatedUserSearches = searches;
    });
  },
  components: {
    CloseIcon,
    MenuIcon,
    Dropdown
    // MenuDownIcon,
    // HomeIcon,
    // VideoIcon
  }
};
</script>
