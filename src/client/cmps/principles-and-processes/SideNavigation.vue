<template>
    <aside class="side-navigation">
        <ul class="side-navigation-nav" :class="{ 'sticky': sticky }">
            <li class="side-navigation-nav-item">
                <collapse hide-de-activator allow-overflow>
                <template #header>
                    <a href="#practice" class="primary-header" :class="{ 'active': $route.hash === '#practice' }">
                        <span class="de-activator inline-start">
                            <chevron-up-icon class="opened" title="" />
                            <chevron-down-icon class="closed" title="" />
                        </span>
                        Practice
                    </a>
                </template>
                <template #content>
                    <a
                        href="#EvidenceBasedFoundation"
                        title="Evidence-Based Foundation"
                        :class="{ 'active': $route.hash === '#EvidenceBasedFoundation' }"
                    >
                        Evidence-Based Foundation
                    </a>
                    <a
                        href="#ReliableContributors"
                        title="Reliable contributors"
                        :class="{ 'active': $route.hash === '#ReliableContributors' }"
                    >
                        Reliable contributors
                    </a>
                    <a
                        href="#ObjectiveAndUnbiased"
                        title="Objective and unbiased"
                        :class="{ 'active': $route.hash === '#ObjectiveAndUnbiased' }"
                    >
                        Objective and unbiased
                    </a>
                    <a
                        href="#ClinicallyPractical"
                        title="Clinically practical"
                        :class="{ 'active': $route.hash === '#ClinicallyPractical' }"
                    >
                        Clinically practical
                    </a>
                    <a
                        href="#SafetyBasedOnScience"
                        title="Safety based on science"
                        :class="{ 'active': $route.hash === '#SafetyBasedOnScience' }"
                    >
                        Safety based on science
                    </a>
                    <a
                        href="#StandardsRemainStandards"
                        title="Standards remain standards"
                        :class="{ 'active': $route.hash === '#StandardsRemainStandards' }"
                    >
                        Standards remain standards
                    </a>
                </template>
                </collapse>
            </li>
            <li class="side-navigation-nav-item">
                <collapse hide-de-activator allow-overflow>
                    <template #header>
                        <a
                            href="#process"
                            class="primary-header"
                            :class="{ 'active': $route.hash === '#process' }"
                        >
                            <span class="de-activator inline-start">
                                <chevron-up-icon class="opened" title="" />
                                <chevron-down-icon class="closed" title="" />
                            </span>
                            Process
                        </a>
                    </template>
                    <template #content>
                        <a
                            href="#QualityAndQuantity"
                            title="Quality and quantity"
                            :class="{ 'active': $route.hash === '#QualityAndQuantity' }"
                        >
                            Quality and quantity
                        </a>
                        <a
                            href="#ContinuousSearch"
                            title="Continuous Search"
                            :class="{ 'active': $route.hash === '#ContinuousSearch' }"
                        >
                            Continuous Search
                        </a>
                    </template>
                </collapse>
            </li>
            <li class="side-navigation-nav-item">
                <collapse hide-de-activator allow-overflow>
                    <template #header>
                        <a
                            href="#literature"
                            class="primary-header"
                            :class="{ 'active': $route.hash === '#literature' }"
                        >
                            <span class="de-activator inline-start">
                                <chevron-up-icon class="opened" title="" />
                                <chevron-down-icon class="closed" title="" />
                            </span>
                            Literature
                        </a>
                    </template>
                    <template #content>
                        <a
                            href="#aSystematicApproach"
                            title="A systematic approach"
                            :class="{ 'active': $route.hash === '#aSystematicApproach' }"
                        >
                            A systematic approach
                        </a>
                        <a
                            href="#criticalAppraisal"
                            title="Critical appraisal"
                            :class="{ 'active': $route.hash === '#criticalAppraisal' }"
                        >
                            Critical appraisal
                        </a>
                        <a
                            href="#consistency"
                            title="Consistency"
                            :class="{ 'active': $route.hash === '#consistency' }"
                        >
                            Consistency
                        </a>
                        <a
                            href="#peerReview"
                            title="Peer review"
                            :class="{ 'active': $route.hash === '#peerReview' }"
                        >
                            Peer review
                        </a>
                    </template>
                </collapse>
            </li>
            <li class="side-navigation-nav-item">
                <collapse hide-de-activator allow-overflow>
                    <template #header>
                        <a
                            href="#currentContent"
                            class="primary-header"
                            :class="{ 'active': $route.hash === '#currentContent' }"
                        >
                            <span class="de-activator inline-start">
                                <chevron-up-icon class="opened" title="" />
                                <chevron-down-icon class="closed" title="" />
                            </span>
                            Current content
                        </a>
                    </template>
                    <template #content>
                        <a
                            href="#contentPrioritization"
                            title="Content prioritization"
                            :class="{ 'active': $route.hash === '#contentPrioritization' }"
                        >
                            Content prioritization
                        </a>
                        <a
                            href="#continuousUpdates"
                            title="Continuous updates, innovation, and improvement"
                            :class="{ 'active': $route.hash === '#continuousUpdates' }"
                        >
                            Continuous updates, innovation, and improvement
                        </a>
                    </template>
                </collapse>
            </li>
            <li class="side-navigation-nav-item">
                <a
                    href="#conclusion"
                    class="primary-header"
                    :class="{ 'active': $route.hash === '#conclusion' }"
                >
                    Conclusion
                </a>
            </li>
        </ul>
    </aside>
</template>

<script>
import Collapse from '@/client/cmps/common/Collapse';

import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';

export default {
    props: {
        sticky: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Collapse,
        ChevronUpIcon,
        ChevronDownIcon
    }
}
</script>