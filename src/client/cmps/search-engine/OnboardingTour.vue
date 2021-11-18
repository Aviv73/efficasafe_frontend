<template>
    <aside>
        <v-tour
            name="onboarding-interaction-tour"
            :steps="onboardingInteractionSteps"
            :callbacks="onboardingInteractionTourCallbacks"
        />
        <v-tour
            name="onboarding-no-searches-tour"
            :steps="onboardingNoSerchesSteps"
            :callbacks="onboardingNoSearchesTourCallbacks"
        />
        <v-tour
            name="onboarding-tour"
            :steps="onboardingTourSteps"
            :callbacks="onboardingTourCallbacks"
        />
        <v-tour
            name="boosters-tour"
            :steps="boostersTourSteps"
            :callbacks="boostersTourCallbacks"
        />
    </aside>
</template>

<script>
import { storageService } from '@/cms/services/storage.service';
import BoostersImg1 from '@/client/assets/imgs/pb1.png';
import BoostersImg2 from '@/client/assets/imgs/pb2.png';
import BoostersImg3 from '@/client/assets/imgs/pb3.png';
import OnboardingNoSearchImg from '@/client/assets/imgs/onboradingNoSearch.jpg';
import OnboardingImg1 from '@/client/assets/imgs/onboarding1.jpg';
import OnboardingImg2 from '@/client/assets/imgs/onboarding2.jpg';
import OnboardingImg3 from '@/client/assets/imgs/onboarding3.jpg';
import OnboardingImg4 from '@/client/assets/imgs/onboarding4.jpg';
import OnboardingImg5 from '@/client/assets/imgs/onboarding5.jpg';
import OnboardingImg6 from '@/client/assets/imgs/onboarding6.jpg';
import OnboardingImg7 from '@/client/assets/imgs/onboarding7.jpg';
import OnboardingImg8 from '@/client/assets/imgs/onboarding8.jpg';
import OnboardingImg9 from '@/client/assets/imgs/onboarding9.png';
import OnboardingImg10 from '@/client/assets/imgs/onboarding10.png';
import interactionImg1 from '@/client/assets/imgs/int1.png';
import interactionImg2 from '@/client/assets/imgs/int2.png';
import interactionImg3 from '@/client/assets/imgs/int3.png';
import interactionImg4 from '@/client/assets/imgs/int4.png';
import interactionImg5 from '@/client/assets/imgs/int5.png';
import interactionImg6 from '@/client/assets/imgs/int6.png';
import interactionImg7 from '@/client/assets/imgs/int7.png';

export default {
    data() {
        return {
            onboardingInteractionSteps:[
                {
                    target: '.v-tour-interaction-step-4',
                    content: `
                        <div class="v-step-container v-step-wide-container">
                            <p class="v-step-txt">
                                Let us help you understand the Supplement-Drug interaction page.
                            </p>
                            <p class="v-step-txt">
                                It begins with a summary of the evidence. 
                                We write this part only after we thoroughly review all the studies.
                                Then we suggest clinical and laboratory parameters to monitor.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${interactionImg1}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-interaction-step-4',
                    content: `
                        <div class="v-step-container" style="width: 32rem;">
                            <p class="v-step-txt">
                                Hover the mouse pointer over the rating on the top right to see full details of the research included.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${interactionImg2}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-interaction-step-4',
                    content: `
                        <div class="v-step-container">
                            <p class="v-step-txt">
                                If special warnings apply, they will appear here.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${interactionImg3}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-interaction-step-4',
                    content: `
                        <div class="v-step-container v-step-wide-container">
                            <p class="v-step-txt">
                                You can go deeper and explore a detailed review of each study.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${interactionImg4}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-interaction-step-4',
                    content: `
                        <div class="v-step-container v-step-wide-container">
                            <p class="v-step-txt">
                                These interactions also contain a unique pharmacokinetic section.
                                Drug metabolism shows the different metabolism pathways of the drug.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${interactionImg5}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-interaction-step-4',
                    content: `
                        <div class="v-step-container v-step-wide-container">
                            <p class="v-step-txt">
                                There is a summary of the supplement’s effect on the different pathways, and detailed research on each pathway.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${interactionImg6}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-interaction-step-4',
                    content: `
                        <div class="v-step-container" style="width: 27rem;">
                            <p class="v-step-txt">
                                As you probably noticed, we like colors, so:
                            </p>
                            <img
                                class="onboarding-img"
                                src="${interactionImg7}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-interaction-step-4',
                    content: `
                        <div class="v-step-container">
                            <p class="v-step-txt">
                                That's it!
                            </p>
                            <p class="v-step-txt">
                                Now it’s up to you to use this data wisely and optimize the treatment!
                            </p>
                        </div>
                    `,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
            ],
            onboardingInteractionTourCallbacks: {
                onStop: () => {
                    storageService.store('did-onboarding-interaction-tour1', true);
                }
            },
            onboardingNoSerchesSteps:[
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container">
                            <p class="v-step-txt">
                                Welcome! 
                            </p>
                            <p class="v-step-txt">
                                Let’s take a quick tour.
                            </p>
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container first-tour" style="width: 27rem;">
                            <p class="v-step-txt">
                                Type your search terms in the search box, and select from the dropdown results.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${OnboardingNoSearchImg}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container big-container">
                            <p class="v-step-txt">
                                Click on any search result to discover more information.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${OnboardingImg1}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container big-container">
                            <p class="v-step-txt">
                                A <span style="color: #F6D55C">yellow info icon</span> means the supplement you searched is still under construction. Your search will give it priority.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${OnboardingImg9}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container big-container">
                            <p class="v-step-txt">
                                A <span style="color: #E63946">red info icon</span> means that the drug or supplement you searched is already in the list.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${OnboardingImg10}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container v-step-wide-container">
                            <p class="v-step-txt">
                                You can filter the category of interactions. 
                            </p>
                            <img
                                class="onboarding-img"
                                src="${OnboardingImg2}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <p class="v-step-txt">
                            Sort results by A-Z, type (Drug or Supplement), or Recommendation.
                        </p>
                        <img
                            class="onboarding-img"
                            src="${OnboardingImg3}"
                            alt="Explanatory usage image"
                        />
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container v-step-wide-container">
                            <p class="v-step-txt">
                                Interact with the info icon to view recommendations and evidence level ratings.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${OnboardingImg4}"
                                alt="Explanatory usage image"
                            />
                        </div>  
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <p class="v-step-txt">Change to vertical view and see the whole picture!</p>
                        <img
                            class="boosters-img"
                            src="${OnboardingImg5}"
                            alt="Explanatory usage image"
                        />
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    },
                    before: () => new Promise((resolve) => {
                        const elNav = document.querySelector('.search-engine-nav');
                        const maxScroll = elNav.scrollWidth - elNav.clientWidth;
                        elNav.scrollLeft += maxScroll;
                        resolve();
                    })
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <p class="v-step-txt">Check out positive boosters for the drugs you searched.</p>
                        <img
                            class="boosters-img"
                            src="${OnboardingImg6}"
                            alt="Explanatory usage image"
                        />
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    },
                    before: () => new Promise((resolve) => {
                        const elNav = document.querySelector('.search-engine-nav');
                        const maxScroll = elNav.scrollWidth - elNav.clientWidth;
                        elNav.scrollLeft += maxScroll;
                        resolve();
                    })
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <p class="v-step-txt">Gain valuable insights on clinical and laboratory parameters to monitor.</p>
                        <img
                            class="boosters-img"
                            src="${OnboardingImg7}"
                            alt="Explanatory usage image"
                        />
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    },
                    before: () => new Promise((resolve) => {
                        const elNav = document.querySelector('.search-engine-nav');
                        const maxScroll = elNav.scrollWidth - elNav.clientWidth;
                        elNav.scrollLeft += maxScroll;
                        resolve();
                    })
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <p class="v-step-txt">As a registered user, you can save your searches for quick access.</p>
                        <img
                            class="boosters-img"
                            src="${OnboardingImg8}"
                            alt="Explanatory usage image"
                        />
                        <p class="v-step-txt">You can find the saved searches in your account.</p>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    },
                }
            ],
            onboardingNoSearchesTourCallbacks: {
                onStop: () => {
                    storageService.store('did-onboarding-tour1', true);
                    storageService.store('did-onboarding-no-searches-tour1', true);
                }
            },
            onboardingTourSteps: [
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container">
                            <p class="v-step-txt">
                                Welcome! 
                            </p>
                            <p class="v-step-txt">
                                Let’s take a quick tour.
                            </p>
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container big-container">
                            <p class="v-step-txt">
                                Click on any search result to discover more information.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${OnboardingImg1}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container big-container">
                            <p class="v-step-txt">
                                A <span style="color: #F6D55C">yellow info icon</span> means the supplement you searched is still under construction. Your search will give it priority.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${OnboardingImg9}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container big-container">
                            <p class="v-step-txt">
                                A <span style="color: #E63946">red info icon</span> means that the drug or supplement you searched is already in the list.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${OnboardingImg10}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <div class="v-step-container v-step-wide-container">
                            <p class="v-step-txt">
                                You can filter the category of interactions.
                            </p>
                            <img
                                class="onboarding-img"
                                src="${OnboardingImg2}"
                                alt="Explanatory usage image"
                            />
                        </div>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <p class="v-step-txt">
                            Sort results by A-Z, type (Drug or Supplement), or Recommendation.
                        </p>
                        <img
                            class="onboarding-img"
                            src="${OnboardingImg3}"
                            alt="Explanatory usage image"
                        />
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                    <div class="v-step-container v-step-wide-container">
                        <p class="v-step-txt">
                            Interact with the info icon to view recommendations and evidence level ratings.
                        </p>
                        <img
                            class="onboarding-img"
                            src="${OnboardingImg4}"
                            alt="Explanatory usage image"
                        />
                    </div>    
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <p class="v-step-txt">Change to vertical view and see the whole picture!</p>
                        <img
                            class="boosters-img"
                            src="${OnboardingImg5}"
                            alt="Explanatory usage image"
                        />
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    },
                    before: () => new Promise((resolve) => {
                        const elNav = document.querySelector('.search-engine-nav');
                        const maxScroll = elNav.scrollWidth - elNav.clientWidth;
                        elNav.scrollLeft += maxScroll;
                        resolve();
                    })
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <p class="v-step-txt">Check out positive boosters for the drugs you searched.</p>
                        <img
                            class="boosters-img"
                            src="${OnboardingImg6}"
                            alt="Explanatory usage image"
                        />
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    },
                    before: () => new Promise((resolve) => {
                        const elNav = document.querySelector('.search-engine-nav');
                        const maxScroll = elNav.scrollWidth - elNav.clientWidth;
                        elNav.scrollLeft += maxScroll;
                        resolve();
                    })
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <p class="v-step-txt">Gain valuable insights on clinical and laboratory parameters to monitor.</p>
                        <img
                            class="boosters-img"
                            src="${OnboardingImg7}"
                            alt="Explanatory usage image"
                        />
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    },
                    before: () => new Promise((resolve) => {
                        const elNav = document.querySelector('.search-engine-nav');
                        const maxScroll = elNav.scrollWidth - elNav.clientWidth;
                        elNav.scrollLeft += maxScroll;
                        resolve();
                    })
                },
                {
                    target: '.v-tour1-step-0',
                    content: `
                        <p class="v-step-txt">As a registered user, you can save your searches for quick access.</p>
                        <img
                            class="boosters-img"
                            src="${OnboardingImg8}"
                            alt="Explanatory usage image"
                        />
                        <p class="v-step-txt">You can find the saved searches in your account.</p>
                    `,
                    params: {
                        placement: 'right-end',
                        enableScrolling: false
                    },
                }
            ],
            onboardingTourCallbacks: {
                onStop: () => {
                    storageService.store('did-onboarding-tour1', true);
                    storageService.store('did-onboarding-no-searches-tour1', true);
                }
            },
            boostersTourSteps: [
                {
                    target: '.pb-tour-step-0',
                    content: `
                        <p class="v-step-txt">
                            This tab will show you positive boosters for what you searched.
                        </p>
                        <p class="v-step-txt">
                            First for the drugs, and then for the supplements.
                        </p>
                        <img
                            class="boosters-img"
                            src="${BoostersImg1}"
                            alt="Usage example"
                        />
                    `,
                    params: {
                        placement: 'left-start',
                        enableScrolling: false
                    }
                },
                {
                    target: '.pb-tour-step-0',
                    content: `
                        <p class="v-step-txt">
                            A click on each drug will show you all the supplements that can be coadministered with the drug.
                        </p>
                        <img
                            class="boosters-img"
                            src="${BoostersImg2}"
                            alt="Usage example"
                        />
                    `,
                    params: {
                        placement: 'left-start',
                        enableScrolling: false
                    }
                },
                {
                    target: '.pb-tour-step-0',
                    content: `
                        <p class="v-step-txt">
                            A click on each supplement will show you the interaction with the chosen drug followed by the interactions 
                            of this supplement with the other drugs in your search, so you can see the whole picture at a glance.
                        </p>
                        <img
                            class="boosters-img"
                            src="${BoostersImg3}"
                            alt="Usage example"
                        />
                    `,
                    params: {
                        placement: 'left-start',
                        enableScrolling: false
                    }
                }
            ],
            boostersTourCallbacks: {
                onStop: () => {
                    storageService.store('did-p-boosters-tour1', true);
                }
            }
        }
    }
}
</script>