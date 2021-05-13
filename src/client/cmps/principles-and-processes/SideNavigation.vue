<template>
    <aside class="side-navigation">
        <ul class="side-navigation-nav">
            <li class="side-navigation-nav-item">
                <collapse hide-de-activator>
                <template #header>
                    <a href="#practice" class="primary-header">Practice</a>
                </template>
                <template #content>
                    <a href="#EvidenceBasedFoundation" title="Evidence-Based Foundation">
                        Evidence-Based Foundation
                    </a>
                    <a href="#ReliableContributors" title="Reliable contributors">
                        Reliable contributors
                    </a>
                    <a href="#ObjectiveAndUnbiased" title="Objective and unbiased">
                        Objective and unbiased
                    </a>
                    <a href="#ClinicallyPractical" title="Clinically practical">
                        Clinically practical
                    </a>
                    <a href="#SafetyBasedOnScience" title="Safety based on science">
                        Safety based on science
                    </a>
                    <a href="#StandardsRemainStandards" title="Standards remain standards">
                        Standards remain standards
                    </a>
                </template>
                </collapse>
            </li>
            <li class="side-navigation-nav-item">
                <collapse hide-de-activator>
                    <template #header>
                        <a href="#process" class="primary-header">Process</a>
                    </template>
                    <template #content>
                        <a href="#QualityAndQuantity" title="Quality and quantity">
                            Quality and quantity
                        </a>
                        <a href="#ContinuousSearch" title="Continuous Search">
                            Continuous Search
                        </a>
                    </template>
                </collapse>
            </li>
            <li class="side-navigation-nav-item">
                <collapse hide-de-activator>
                    <template #header>
                        <a href="#literature" class="primary-header">Literature</a>
                    </template>
                    <template #content>
                        <a href="#aSystematicApproach" title="A systematic approach">
                            A systematic approach
                        </a>
                        <a href="#criticalAppraisal" title="Critical appraisal">
                            Critical appraisal
                        </a>
                        <a href="#consistency" title="Consistency">
                            Consistency
                        </a>
                        <a href="#peerReview" title="Peer review">
                            Peer review
                        </a>
                    </template>
                </collapse>
            </li>
            <li class="side-navigation-nav-item">
                <collapse hide-de-activator>
                    <template #header>
                        <a href="#currentContent" class="primary-header">Current content</a>
                    </template>
                    <template #content>
                        <a href="#contentPrioritization" title="Content prioritization">
                            Content prioritization
                        </a>
                        <a href="#continuousUpdates" title="Continuous updates, innovation, and improvement">
                            Continuous updates, innovation, and improvement
                        </a>
                    </template>
                </collapse>
            </li>
            <li class="side-navigation-nav-item">
                <a href="#conclusion" class="primary-header">Conclusion</a>
            </li>
        </ul>
    </aside>
</template>

<script>
import Collapse from '@/client/cmps/common/Collapse';

export default {
    components: {
        Collapse
    }
}
</script>