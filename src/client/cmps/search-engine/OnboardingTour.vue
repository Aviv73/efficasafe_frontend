<template>
    <aside>
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
import BoostersImg1 from '@/client/assets/imgs/pb1.jpg';
import BoostersImg2 from '@/client/assets/imgs/pb2.jpg';
import BoostersImg3 from '@/client/assets/imgs/pb3.jpg';
import OnboardingImg1 from '@/client/assets/imgs/onboarding1.jpg';
import OnboardingImg2 from '@/client/assets/imgs/onboarding2.jpg';
import OnboardingImg3 from '@/client/assets/imgs/onboarding3.jpg';

export default {
    data() {
        return {
            onboardingTourSteps: [
                {
                    target: '.v-tour-step-0',
                    content: '<p class="v-step-txt">Let us show you around! insert your materials here</p>',
                    params: {
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-step-1',
                    content: `
                        <div class="v-step-container">
                            <p class="v-step-txt">
                                Click on any material to see more info on the material and its interactions within the search plus a link to all of its interactions
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
                    target: '.v-tour-step-2',
                    content: `
                        <p class="v-step-txt">
                            You can sort results by name, recommendation or level of evidence
                        </p>
                        <img
                            class="onboarding-img"
                            src="${OnboardingImg2}"
                            alt="Explanatory usage image"
                        />
                    `,
                    params: {
                        placement: 'top',
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-step-3',
                    content: '<p class="v-step-txt">Hover to view recommendation reasoning</p>',
                    params: {
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-step-4',
                    content: '<p class="v-step-txt">Hover to view evidence level index</p>',
                    params: {
                        enableScrolling: false
                    }
                },
                {
                    target: '.v-tour-step-5',
                    content: `
                        <p class="v-step-txt">Change to vertical view</p>
                        <img
                            class="boosters-img"
                            src="${OnboardingImg3}"
                            alt="Explanatory usage image"
                        />
                    `,
                    params: {
                        placement: 'left',
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
                    target: '.v-tour-step-6',
                    content: '<p class="v-step-txt">Optimize treatment with synergistics</p>',
                    params: {
                        placement: 'top',
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
                    target: '.v-tour-step-7',
                    content: '<p class="v-step-txt">Gain valuable insights on clinical and laboratory parameters to monitor</p>',
                    params: {
                        placement: 'top',
                        enableScrolling: false
                    },
                    before: () => new Promise((resolve) => {
                        const elNav = document.querySelector('.search-engine-nav');
                        const maxScroll = elNav.scrollWidth - elNav.clientWidth;
                        elNav.scrollLeft += maxScroll;
                        resolve();
                    })
                }
            ],
            onboardingTourCallbacks: {
                onStop: () => {
                    storageService.store('did-onboarding-tour', true);
                }
            },
            boostersTourSteps: [
                {
                    target: '.pb-tour-step-0',
                    content: `
                        <p class="v-step-txt">
                            This tab will show you positive combinations
                            with the drugs that are in your search
                        </p>
                        <img
                            class="boosters-img"
                            src="${BoostersImg1}"
                            alt="Usage example"
                        />
                        <p class="v-step-txt">The order of the drugs shown is set by the recommendations</p>
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
                            A click on each drug will show you all the herbs and/or
                            supplements that can be coadministered with the drug
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
                            A click on each herb/supplement will show you the interaction
                            with the chosen drug followed by the interactions of this
                            herb/supplement with the other drugs in your search
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
                    storageService.store('did-p-boosters-tour', true);
                }
            }
        }
    }
}
</script>