<template>
  <section class="features-container">
    <header v-if="isHomePage" class="page-header flex-center">
      <router-link to="/">
        <img :src="require('@/client/assets/imgs/flat-logo.png')" alt="Logo" />
      </router-link>
    </header>
    <section class="home-content">
      <!-- <h1 class="title">Efficasafe Features</h1> -->
      <ul class="features-content-list">
        <article v-if="isScreenNarrow" class="card-outside">
          <div class="card-img-container">
            <img src="@/client/assets/imgs/features-capsules/int-checker.svg" alt="Efficasafe" />
          </div>
          <h1>Interaction checker</h1>
          <p>
            Our interaction checker has the most extensive data, giving you a higher level of assurance.<br />
            Enables instant cross-checking of multiple Drug-Drug and Herb-Supplement-Drug interactions.<br />
            Provides detailed study reviews, summaries, concise recommendations, and pharmacokinetic data.
          </p>
        </article>
        <li class="features-content-list-item">
          <article class="card-inner">
            <img class="inner-img" src="@/client/assets/imgs/features-capsules/int-checker.svg" alt="Efficasafe" />
            <h1>Interaction checker</h1>
            <p class="margin-bottom-40">
              Our interaction checker has the most extensive data, giving you a higher level of assurance.<br />Enables instant cross-checking of multiple Drug-Drug and Herb-Supplement-Drug interactions.<br />
              Provides detailed study reviews, summaries, concise recommendations, and pharmacokinetic data.
            </p>
          </article>
          <div class="img-container">
            <img src="@/client/assets/imgs/features-capsules/features1.svg" alt="Efficasafe" />
          </div>
          <!-- <img src="@/client/assets/imgs/capsules1.svg" alt="Capsules" class="capsules capsules-1" /> -->
        </li>
        <article v-if="isScreenNarrow" class="card-outside">
          <div class="card-img-container">
            <img src="@/client/assets/imgs/features-capsules/opti.svg" alt="Efficasafe" />
          </div>

          <h1>Optimizers</h1>
          <p>Optimizers are combinations of drugs and supplements that either increase drug efficacy or reduce toxicity and adverse events or ideally do both. <br />efficasafe is the only platform to present these unique combinations and allow you to upgrade your treatment plan.</p>
        </article>
        <li class="features-content-list-item">
          <article class="card-inner">
            <img class="inner-img" src="@/client/assets/imgs/features-capsules/opti.svg" alt="Efficasafe" />
            <h1>Optimizers</h1>
            <p>
              Optimizers are combinations of drugs and supplements that either increase drug efficacy or reduce toxicity and adverse events or ideally do both.<br />
              efficasafe is the only platform to present these unique combinations and allow you to upgrade your treatment plan.
            </p>
          </article>
          <div class="img-container">
            <!-- <img src="@/client/assets/imgs/features-capsules/features4.svg" alt="Efficasafe" /> -->
            <img src="@/client/assets/imgs/features-capsules/opti1.jpg" alt="Efficasafe" />
          </div>

          <!-- <img src="@/client/assets/imgs/capsules2.svg" alt="Capsules" class="capsules capsules-2" /> -->
        </li>
        <article v-if="isScreenNarrow" class="card-outside">
          <div class="card-img-container">
            <img src="@/client/assets/imgs/features-capsules/monitoring.svg" alt="Efficasafe" />
          </div>
          <h1>Monitoring Tools</h1>
          <p>In order to provide safe and effective treatment in the long run, efficasafe provides detailed insights into which clinical and laboratory parameters (lab tests, symptoms, etc.) should be monitored per interaction or for the entire patient profile.</p>
        </article>
        <li class="features-content-list-item">
          <article class="card-inner">
            <img class="inner-img" src="@/client/assets/imgs/features-capsules/monitoring.svg" alt="Efficasafe" />

            <h1>Monitoring Tools</h1>
            <p>In order to provide safe and effective treatment in the long run, efficasafe provides detailed insights into which clinical and laboratory parameters (lab tests, symptoms, etc.) should be monitored per interaction or for the entire patient profile.</p>
          </article>
          <div class="img-container flex-center">
            <img src="@/client/assets/imgs/features-capsules/wtm.jpg" alt="Efficasafe" />
          </div>
        </li>
        <article v-if="isScreenNarrow" class="card-outside">
          <div class="card-img-container">
            <img src="@/client/assets/imgs/features-capsules/monogr.svg" alt="Efficasafe" />
          </div>
          <h1>Monographs</h1>
          <p>A comprehensive overview of Drugs, Herbs, and Supplements literature, including general information, medicinal uses, safety concerns (sensitivities, adverse events, and toxicity), and more.</p>
        </article>
        <li class="features-content-list-item">
          <article class="card-inner">
            <img class="inner-img" src="@/client/assets/imgs/features-capsules/monogr.svg" alt="Efficasafe" />
            <h1>Monographs</h1>
            <p>A comprehensive overview of Drugs, Herbs, and Supplements literature, including general information, medicinal uses, safety concerns (sensitivities, adverse events, and toxicity), and more.</p>
          </article>
          <div class="img-container">
            <img src="@/client/assets/imgs/features-capsules/monogr.jpg" alt="Efficasafe" />
          </div>
        </li>
        <article v-if="isScreenNarrow" class="card-outside">
          <div class="card-img-container">
            <img src="@/client/assets/imgs/features-capsules/alerts.svg" alt="Efficasafe" />
          </div>

          <h1>Alerts</h1>
          <p>As new data is added to an interaction, an alert appears in your patient's record to keep you updated on the latest research and help you provide the best treatment.</p>
        </article>
        <li class="features-content-list-item">
          <article class="card-inner">
            <img class="inner-img" src="@/client/assets/imgs/features-capsules/alerts.svg" alt="Efficasafe" />

            <h1>Alerts</h1>
            <p>As new data is added to an interaction, an alert appears in your patient's record to keep you updated on the latest research and help you provide the best treatment.</p>
          </article>
          <div class="img-container">
            <img src="@/client/assets/imgs/features-capsules/features5.svg" alt="Efficasafe" />
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
export default {
  computed: {
    isScreenNarrow() {
      return this.$store.getters.isScreenNarrow;
    },
    isHomePage() {
      return this.$route.name === 'features';
    }
  }
};
</script>

<style></style>
