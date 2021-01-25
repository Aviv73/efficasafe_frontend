<template>
  <section class="d-bank-interaction-details">
      <div class="container">
        <main v-if="!isLoading && interaction">
            <header class="pb-4">
                <v-btn color="primary" @click="$router.go(-1)">
                    <v-icon small left>mdi-arrow-left</v-icon>Back
                </v-btn>
                <v-btn :color="isTextFormatted ? 'secondary' : 'primary'" @click="isTextFormatted = !isTextFormatted">
                    <v-icon small left>{{ isTextFormatted ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}</v-icon>View {{ isTextFormatted ? 'origin' : 'formatted' }} text
                </v-btn>
            </header>
            <v-card class="d-bank-interaction-details-content px-3">
                <v-card-title class="d-bank-interaction-details-content-title px-0">
                    {{ `${interaction.subject_drug.name} & ${interaction.affected_drug.name}` }}
                    <figure>
                        <img :src="require(`@/assets/drugbank.png`)" alt="DrugBank logo" />
                        <figcaption class="caption">powered by</figcaption>
                    </figure>
                </v-card-title>

                <div class="text-capitalize">Recommendation:</div>
                <div v-recommendation-color>{{ interaction.recommendation }}</div>

                <div class="text-capitalize">Severity:</div>
                <div>{{ interaction.severity }}</div>

                <div class="text-capitalize">Level of evidence:</div>
                <div>{{ interaction.evidence_level }}</div>

                <div class="text-capitalize">Summary:</div>
                <p>{{ interaction.summary }}</p>

                <div class="text-capitalize" v-if="interaction.extended_description">Extended description:</div>
                <p 
                    v-if="interaction.extended_description"
                    ref="extendedDescription"
                    v-html="isTextFormatted ? getRefsToDisplay(interaction.extended_description) : interaction.extended_description" 
                />

                <div class="text-capitalize" v-if="interaction.management">Management:</div>
                <p 
                    v-if="interaction.management"
                    ref="management"
                    v-html="isTextFormatted ? getRefsToDisplay(interaction.management) : interaction.management"
                />

                <v-divider class="d-bank-interaction-details-content-divider my-2" />
                <d-bank-refs-table 
                        class="d-bank-interaction-details-content-table"
                        :refs="interactionRefs"
                        :isEdit="false"
                    />
            </v-card>
        </main>
        <entity-not-found 
            entity="featured interaction"
            v-if="!isLoading && !interaction"
        />
        <loader class="d-bank-interaction-details-loader" v-if="isLoading" />
      </div>
  </section>
</template>

<script>
import { drugBankService } from '@/services/drug-bank.service';
import { interactionService } from '@/services/interaction.service';
import loader from '@/cmps/general/LoadingCmp';
import entityNotFound from '@/cmps/general/EntityNotFound';
import dBankRefsTable from '@/cmps/d-bank-interaction/DBankRefsTable';

export default {
    wrongRefsMap: drugBankService.getWrongRefsMap(),
    data() {
        return {
            isLoading: false,
            isTextFormatted: true,
            interaction: null
        }
    },
    watch: {
        '$route.params.id': {
            handler() {
                this.loadInteraction();
            }
        }
    },
    computed: {
        interactionRefs() {
            let refIdx = 1;
            return Object.keys(this.interaction.references).reduce((acc, key) => {
                const moreRefs = this.interaction.references[key].map(
                    ({ ref_id, pubmed_id, citation, title, url }) => {
                    return {
                        ref_id,
                        pubmed_id: pubmed_id || '',
                        citation: citation || '',
                        title: title || '',
                        url: url || '',
                        draftIdx: refIdx++
                    }
                });
                acc = acc.concat(moreRefs);
                return acc;
            }, []);
        }
    },
    methods: {
        async loadInteraction() {
            this.isLoading = true;
            const { id } = this.$route.params;
            const interaction = await this.$store.dispatch({ type: 'getFeaturedInteraction', id });
            this.interaction = interaction;
            this.isLoading = false;
        },
        getRefsToDisplay(txt) {
            const regex = /\[(.*?)\]/g;
            const matches = txt.match(regex);
            if (!matches) return txt;
            matches.forEach(match => {
                let formatedMatch = this.replaceWrongRefs(match);
                this.interactionRefs.forEach(({ ref_id, draftIdx }) => {
                    if (formatedMatch.includes(ref_id)) {
                        formatedMatch = formatedMatch.replace(ref_id, draftIdx);
                    } else {
                        const refId = ref_id.replace(/\D/g,'');
                        formatedMatch = formatedMatch.replace(refId, draftIdx);
                    }
                });
                formatedMatch = formatedMatch.replace('[', '(');
                formatedMatch = formatedMatch.replace(']', ')');
                formatedMatch = `<sub>${interactionService.formatRefStrs(formatedMatch)}</sub>`;
                
                const beforeIdx = txt.indexOf(match) - 1;
                if (txt.charAt(beforeIdx) === '.') {
                    txt = txt.substring(0, beforeIdx) + txt.substring(beforeIdx + 1);
                    formatedMatch = ` ${formatedMatch}.`;
                }
                
                txt = txt.replace(match, formatedMatch);
            });
            return txt;
        },
        replaceWrongRefs(refStr) {
            const { wrongRefsMap } = this.$options;
            Object.keys(wrongRefsMap).forEach(wrongRef => {
                if (refStr.includes(wrongRef)) {
                    refStr = refStr.replaceAll(wrongRef, wrongRefsMap[wrongRef]);
                }
            });
            return refStr;
        },
        setRefsToolTip() {
            const { extendedDescription, management } = this.$refs;
            const elSubs = [ 
                ...extendedDescription.querySelectorAll('sub'),
                ...management.querySelectorAll('sub') 
            ];
            for (let i = 0; i < elSubs.length; i++) {
                const refsOrder = interactionService.getRefsOrder(elSubs[i].innerText);
                const refs = this.getRefsFromIdxs(refsOrder);

                elSubs[i].addEventListener('mouseenter', this.setTooltipPos);
                const elTooltip = document.createElement('aside');
                elTooltip.classList.add('refs-tooltip');
                let htmlStr = '<ul>';
                refs.forEach(ref => {
                    htmlStr += `<li class="tooltip-item">
                        <p><span>${ref.draftIdx}</span>.${ref.citation || ref.title}</p>
                        <a href="${ref.pubmed_id ? `https://pubmed.ncbi.nlm.nih.gov/${ref.pubmed_id}` : ref.url}" class="ref-link" target="_blank">
                            ${ref.pubmed_id ? `https://pubmed.ncbi.nlm.nih.gov/${ref.pubmed_id}` : ref.url}
                        </a>
                    </li>`;
                });
                htmlStr += '</ul>';
                elTooltip.innerHTML = htmlStr;
                elSubs[i].appendChild(elTooltip);
            }
        },
        getRefsFromIdxs(refIdxs) {
            const refs = [];
            refIdxs.forEach(idx => {
                const ref = this.interactionRefs.find(ref => ref.draftIdx === idx);
                refs.push(ref);
            })
            return refs;
        },
        setTooltipPos(ev) {
            const elTooltip = ev.target.querySelector('.refs-tooltip');
            if (ev.clientX + elTooltip.offsetWidth > window.innerWidth) {
                elTooltip.style.transformOrigin = 'top right';
                elTooltip.style.left = `unset`;
                elTooltip.style.right = `0`;
            }
        }
    },
    created() {
        this.loadInteraction();
        ///~ await this function and get side1 pathways using this.interaction.subject_drug.drugbank_id
        ///~ get side 2 pathways by his drugbank_id from our materials ?
    },
    updated() {
        this.setRefsToolTip();
    },
    components: {
        loader,
        entityNotFound,
        dBankRefsTable
    }
}
</script>