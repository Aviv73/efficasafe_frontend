<template>
    <section class="about-hebrew-page"  style="direction: ltr;">
        <page-header/>
        <article class="about-hebrew-page-container">
            <h1 class="title">What makes <span class="highlight">Efficasafe</span> the best interaction platform in the world?</h1>
            <section>
                <p>The platform's uniqueness lies first and foremost – in the quantity of scientific data</p>
                <p>reviewed in each interaction.</p>
                <p>Much more than in any other platform.</p>
                <p>How much more? Let’s see...</p>
                <p class="sub-title-4">Here is an example. This oncology patient has prescriptions for 4 drugs and 3 herbs:</p>
            </section>
            <img class="img1 center" src="@/client/assets/imgs/about-img-1.png" alt="">
            <section>
                <p class="sub-title" >In the table below, you will find the results obtained when searching for interactions between these drugs and supplements on various search engines, including:</p>
                <p class="english">Micromedex, UpToDate, Medscape, Webmd, Drugs.com, Rxlist, NaturalMedicines, BodyBalancerpro</p>
                <p class="sub-title-2" >Please pay attention to the numbers in each interaction:</p>
                <p>The first number is the total number of sources.</p>
                <p>The second number indicates clinical studies.</p>
                <p class="sub-title-4">And the third number, if stated, indicates meta-analyses.</p>
            </section>
            <img class="img2 center" src="@/client/assets/imgs/about-hebrew-img-4.jpeg" alt="">
            <section>
                <p class="sub-title-3">On average, the results ranged from 4-6 sources per interaction, of which 2-3 are clinical.</p>
                <p class="sub-title-4">Now, let's examine the amount of evidence on <span class="highlight">Efficasafe</span>:</p>
            </section>
            <img class="img2 center" src="@/client/assets/imgs/about-hebrew-img-2.jpeg" alt="">
            <section>
                <p class="sub-title-3">Much, much higher...</p>
                <p>As you may have noticed, not only is the amount of evidence different, but the recommendations themselves are entirely different.</p>
                <p>While all platforms warn against different combinations, <span class="highlight">Efficasafe's</span> recommendations are positive.</p>
                <p>In some cases, the clinical recommendations state that coadministration may even be advised.</p>
            </section>
            <section>
                <p>How can this be possible?</p>
                <p>The answer is, you guessed it, the amount of data.</p>
                <p class="sub-title-3">The large number of clinical studies conducted on each combination allows for more accurate conclusions and a higher confidence level.</p>
                <p>Let us explain.</p>
                <p>Here’s an example, let’s say you want to combine Cinnamon (Cinnamomum zeylanicum) with Metformin (the drug of choice for high blood sugar).</p>
                <p>If there are only one or two studies that show that Cinnamon reduces blood glucose levels, it only makes sense to assume that coadministration with sugar-lowering drugs may lead to enhanced activity and in the worst-case scenario, even cause hypoglycemia.</p>
                <p class="sub-title-3">Therefore, it also makes sense and right to warn against coadministration.</p>
                <p>But, if there are 8 Meta-analyses, reviewing 35 clinical studies in which Cinnamon was given to people with diabetes,</p>
                <p>And of them, 9 studies examined the coadministration of Cinnamon with sugar-lowering drugs, including Metformin,</p>
                <p>And all of these studies have found the coadministration to be not only safe but also more effective than the drugs alone in improving a variety of diabetes indices,</p>
                <p>And in none of the studies has there been a single case of hypoglycemia,</p>
                <p class="sub-title-3">And there is not even a single hypoglycemia case reported in the professional literature,</p>
                <p>Then the conclusions are entirely different…</p>
                <p>Or in other words, maybe size does matter :)</p>
            </section>
            <div class="sign-up-btn-container">
                <button @click="openSignup" class="sign-up-btn">
                    Sign up now
                </button>
            </div>
            <section>
                <p class="space-bottom">And it's not just the large pool of data that <span class="highlight">Efficasafe's</span> platform has to offer. It also:</p>
                <ul>
                    <li>Allows unlimited search of medications and supplements </li>
                    <li>Includes Drug-Drug Interactions and Herb-Supplement-Drug Interactions </li>
                    <li>Provides ratings on the quality of the supporting evidence</li>
                    <li>Offers a short and clear summary for those looking for a quick answer, but also provides a full breakdown of the evidence</li>
                    <li>Includes positive and negative recommendations</li>
                    <li>Suggests what interactions require monitoring</li>
                    <li>Provides pharmacokinetic analysis for each interaction</li>
                </ul>
            </section>
            <section>
                <p>Oh, one more thing…</p>
                <p>Do you know how after every patient intake, you need to carefully consider which herbs and/or supplements you should recommend your patient?</p>
                <p><span class="highlight">Efficasafe</span> does that too and in a whole new way.</p>
                <p class="sub-title-3">The platform shows all the recommended combinations with drugs, allowing you to discover combinations that may enhance drug efficacy and/or reduce toxicity and adverse events.</p>
                <p class="sub-title-3"><span class="highlight">We call this feature Optimizers.</span></p>
                <p>And that's not all. There are more features to discover still.</p>
                <p class="sub-title-4">Sign up for <span class="highlight">Efficasafe</span> today and start seeing (search) results!</p>
            </section>
            <section>
                <p>By the way, we have not forgotten about our patient.</p>
                <p class="sub-title-4">This is how his healthcare provider sees him:</p>
            </section>
            <img class="img2 center border" src="@/client/assets/imgs/about-hebrew-img-3.jpeg" alt="">
            <p>Sign up now, and you, too, will be able to see more clearly!</p>
            <div class="sign-up-btn-container">
                <button @click="openSignup" class="sign-up-btn">
                    Sign up now
                </button>
            </div>
        </article>
    </section>
</template>

<script>

import PageHeader from '@/client/cmps/shared/PageHeader';

export default {
  name: 'WeAreBetter',
  components:{
      PageHeader
  },
  computed:{
      loggedInUser() {
            return this.$store.getters.loggedInUser;
        }
  },
  methods:{
      openSignup(){
          if(this.loggedInUser) return
          this.$emit('signup');
      }
  }
}
</script>