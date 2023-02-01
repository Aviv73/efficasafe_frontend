<template>
  <section style="direction: ltr">
    <page-header />
    <article class="we-are-better-page main-container">
      <section class="text-center">
        <h1 class="title">What makes <span class="highlight">Efficasafe</span> the best <br />interaction platform in the world?</h1>
        <div>
          <p class="secondary-txt">
            Our platform stands out from the rest due to the sheer volume of scientific data that we review in each interaction.
            <br />
            We go above and beyond to ensure that our conclusions are as accurate as possible..
          </p>
        </div>
      </section>
      <section>
        <h3 class="sub-title">Let’s look at an example.</h3>
        <p>A patient (John smith) who is prescribed 4 drugs (Warfarin, Atorvastatin, Metformin, Ritalin) and wants to take 3 supplements (Turmeric, Cinnamon, Omega-3).</p>
        <p>Here is a table listing all <strong>possible interactions</strong>, with the recommendations according to leading interaction databases.</p>
        <p>Please note the numbers in each cell.</p>
      </section>
      <section>
        <p>Numbers from left: <strong>(1)</strong>(2)(3) = Total number of references (1)<strong>(2)</strong>(3) = Number of clinical trials (1)(2)<strong>(3)</strong> = Meta-analyses <i>(If presented)</i></p>
        <img src="@/client/assets/imgs/we-are-better-table.png" alt="" />
      </section>
      <section class="flex wrap example-section">
        <div class="card-like">
          <p>
            As you can see in the table, in comparison to other platforms that only include a small number of references and clinical trials for each interaction, efficasafe’s extensive data collection allows us to provide <strong>more in-depth and trustworthy information</strong>. In fact, our
            extensive data often leads to different conclusions than those drawn by platforms with less information.
          </p>
        </div>
        <div class="example-wrapper">
          <p>Take the <strong>combination</strong> of Cinnamon and Metformin, a popular diabetes medication, <strong>for example.</strong></p>
          <p>
            While other platforms may caution against this combination due to limited data (a maximum of 5 studies), efficasafe’s conclusion, based on a larger amount of data (11 systematic reviews and 53 clinical trials, 10 of which were randomized controlled trials (RCTs) that examined the
            coadministration of Cinnamon and antidiabetic drugs including Metformin) is that it is not only safe but can even be more effective than the drug alone.
          </p>
          <p class="paragraph">As you can see, it’s all about the data.</p>
          <p>
            <strong>Having a larger amount of data allows for more precise conclusions to be drawn, enabling you to make better-informed decisions and improve patient care.</strong>
          </p>
        </div>
      </section>
      <section>
        <section class="wait-container">
          <h2 class="wait-title">
            <p class="card-like secondary-txt text-center">But wait, could there be other supplements that are more effective?</p>
            <div class="material-imgs">
              <img class="material-img" src="@/client/assets/imgs/we-are-better-material.svg" alt="" />
              <img class="material-leaves-img" src="@/client/assets/imgs/we-are-better-leaves.svg" alt="" />
            </div>
            <img class="material-leaves-img-2" src="@/client/assets/imgs/we-are-better-leaves-2.svg" alt="" />
          </h2>
        </section>
        <section>
          <h3 class="sub-title">Meet the optimizers.</h3>
          <p>Optimizers are combinations of drugs and supplements that either increase drug efficacy or reduce toxicity and adverse events or preferably do both. Efficasafe presents these unique combinations and allows you to <strong>optimize your treatment plan</strong>.</p>
        </section>
        <section>
          <p class="sub-title">Here’s what it looks like:</p>
          <img src="@/client/assets/imgs/we-are-better-optimizers-sample.png" alt="" />
        </section>
        <section class="card-like even-more">
          <h3 class="sub-title">There is even more.</h3>
          <h3 class="sub-title">The platform also provides you with:</h3>
          <ul>
            <li>Patient monitoring tools</li>
            <li>Newest updates directly to patients’ records</li>
            <li>Full monographs of drugs, herbs, and supplements</li>
          </ul>
        </section>

        <a v-if="!this.loggedInUser" class="subscribe-btn self-center fit-content" @click="$emit('signup')"> <button>Start a Free Trial</button></a>

        <router-link v-else-if="this.loggedInUser.type !== 'subscribed'" class="subscribe-btn self-center fit-content" to="/subscribe">
          <button>Subscribe now!</button>
        </router-link>
      </section>
    </article>
  </section>
</template>

<script>
import PageHeader from '@/client/cmps/shared/PageHeader';

export default {
  name: 'WeAreBetter',
  components: {
    PageHeader
  },
  created() {
    console.log('user', this.loggedInUser);
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    }
  },
  methods: {
    openSignup() {
      if (this.loggedInUser) return;
      this.$emit('signup');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/client/styles/setup/_variables.scss';
.main-container {
  max-width: 1150px;
}
.we-are-better-page {
  line-height: 1.5rem;
  h1 {
    font-size: 2rem;
    font-weight: bold;
    line-height: 2.5rem;
  }
  display: flex;
  flex-direction: column;
  gap: 30px;
  section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  p:nth-child(2) {
    // margin-bottom: 10px;
  }
  img {
    width: 100%;
  }
  .sub-title {
    font-weight: bold;
  }
  .subscribe-btn {
    margin: 15px 0px;
  }
  .card-like {
    padding: 16px;
    border: 1px solid #a5a5a5;
    box-shadow: -3px 6px 3px rgba(19, 49, 70, 0.56);
    border-radius: 12px;
  }
  .card-like:not(:first-child) {
    margin-bottom: 50px;
  }
  button {
    font-size: 1.375rem;
    color: white;
    font-weight: bold;
    background-color: #133146;
    width: 220px;
    height: 50px;
    border-radius: 40px;
    margin: 0 auto;
    margin: 20px 0px;
  }
  .fit-content {
    width: fit-content;
  }

  .example-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }

  // .example-section {
  //   :nth-child(2) {
  //     display: flex;
  //     flex-direction: column;
  //     gap: 20px;
  //     flex: 1;
  //   }
  // }

  .inner-container {
    gap: 30px;
    display: flex;
    flex-direction: column;
    max-width: 950px;
    margin: 0 auto;
  }

  .wait-container {
    margin: 15px 0px;
  }
  .wait-title {
    position: relative;
    z-index: 5;
    color: #55c595;
    font-size: 1.25rem;
    width: 70%;
    align-self: center;
    margin: 20px 0px;
    .card-like {
      border-radius: 50px;
      position: relative;
      background-color: white;
      z-index: 1;
    }
    .material-imgs {
      z-index: 1;
      position: absolute;
      width: 40px;
      height: 60px;
      right: 0;
      top: 10px;
      transform: translate(50%, -50%);

      .material-leaves-img {
        position: absolute;
        z-index: -1;
        right: -13px;
        top: -30px;
        width: 50px;
        height: 70px;
      }
    }
    .material-leaves-img-2 {
      position: absolute;
      z-index: -3;
      right: 15px;
      top: -30px;
      width: 25px;
      height: 50px;
    }
  }

  @media (max-width: $break-narrow) {
    gap: 25px;
    font-size: 12px;
    line-height: 1rem;
    .wait-title {
      width: 90%;
    }
    h1 {
      font-size: 1rem;
      line-height: 1.2rem;
    }
    p:not(:last-child) {
      margin-bottom: 10px;
    }
    .example-section {
      gap: 30px;
      .card-like {
        width: unset;
      }
    }

    .card-like {
      font-size: 13px !important;
    }
    .inner-container {
      gap: 25px;
      max-width: unset;
    }
    .secondary-txt {
      font-size: 0.875rem;
    }
    // section {
    //     gap: unset;
    // }
    .wait-title {
      .material-imgs {
        width: 25px;
        height: 45px;
        right: 2.5px;
        top: 50%;
        .material-leaves-img {
          right: -12.5px;
          top: -40px;
          width: 30px;
          height: 60px;
        }
      }
      .material-leaves-img-2 {
        display: none;
      }
    }
  }
}
</style>
