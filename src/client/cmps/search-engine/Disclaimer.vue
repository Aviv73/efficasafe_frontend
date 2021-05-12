<template>
    <aside class="disclaimer">
        <h2 class="heading1">Disclaimer</h2>
        <main>
            <p>
                This website, Efficasafe.com, is not to be used as a substitute for medical advice,
                diagnosis or treatment of any health condition or problem.
                This website is for general health information only and is intended
                for professional use only. Users of this website should not rely on information
                provided on this website for their own health problems.
                Any questions regarding your own health should be addressed to your
                own physician or other healthcare provider.
            </p>
            <p>
                You are hereby advised to consult with a physician or other professional
                health-care provider prior to making any decisions,
                or undertaking any actions or not undertaking any actions
                related to any health care problem or issue you might have at any time,
                now or in the future. In using this website you agree that neither Naturopedia LTD
                and the Efficasafe website nor any other party is or will be liable or otherwise
                responsible for any decision made or any action taken or any action not taken due
                to your use of any information presented at this website.
                Use of this website does not create an expressed or implied physician-patient relationship.
                Naturopedia LTD and the Efficasafe website do not assume any risk whatsoever
                for your use of this website or the information contained herein.
            </p>
            <p>
                Naturopedia LTD and the Efficasafe website make no warranties nor express
                or implied representations whatsoever regarding the accuracy, completeness,
                timeliness, comparative or controversial nature, or usefulness of any information
                contained or referenced on this website. Health-related information changes frequently
                and therefore information contained on this website may be outdated,
                incomplete or incorrect.
            </p>
            <p>
                By clicking "Continue" below or by any further use of this website I
                accept all of the
                <router-link to="terms-and-conditions" class="link">terms and conditions</router-link>
                as detailed <router-link to="terms-and-conditions" class="link">here</router-link>.
            </p>
        </main>
        <footer class="disclaimer-actions">
            <button class="btn" @click="$emit('approved-use')">Continue</button>
        </footer>
    </aside>
</template>