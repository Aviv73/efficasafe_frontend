<template>
  <div>
    <section class="interaction-details" v-if="interaction">
      <div class="container">
        <confirm-delete
          v-model="dialog"
          type="interaction"
          :dialog="dialog"
          @delete-confirm="removeInteraction"
          @delete-cancel="dialog = false"
        />
        <div class="action-container">
          <v-btn color="primary" @click="$router.go(-1)">
            <v-icon small left>mdi-arrow-left</v-icon>Back
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" v-if="!isArchive" @click="cloneInteraction">
            <v-icon small left>mdi-content-copy</v-icon>Clone
          </v-btn>
          <v-btn color="primary" :to="`/interaction/edit/${interaction._id}`" v-if="!isArchive">
            <v-icon small left>mdi-pencil</v-icon>Edit
          </v-btn>
          <v-btn color="error" @click="displayDialog" v-if="!isArchive">
            <v-icon small left>mdi-delete</v-icon>Delete
          </v-btn>
        </div>

        <v-card class="info-container">
          <v-card-title class="interaction-details-title justify-center">
            <h2 v-if="interaction.side1Material && !interaction.side2Label">
              {{ interaction.side1Material.name }}
            </h2>
            <span class="spacing" v-if="!interaction.side2Label">&</span>
            <h2 v-if="interaction.side2Material">
              {{ interaction.side2Material.name }}
            </h2>
            <h2 v-if="interaction.side2Label">{{ interaction.side2Label.name }}</h2>
          </v-card-title>

          <h3 class="info-title">Recommendation:</h3>
          <p class="info-value" v-recommendation-color>{{ recommendation }}</p>

          <h3 class="info-title">Level of evidence:</h3>
          <span class="info-value">{{ interaction.evidenceLevel }}</span>

          <span class="info-title" v-if="interaction.side2Label">
            Side 2 Label:
          </span>
          <div class="info-value" v-if="interaction.side2Label">
            <router-link :to="`/label/${interaction.side2Label._id}`">
              {{ interaction.side2Label.name }}
            </router-link>
            <v-btn
              v-if="!isArchive"
              class="icon"
              icon
              title="View label's materials"
              @click="labelDialog = true"
            >
              <v-icon color="primary">mdi-eye</v-icon>
            </v-btn>
          </div>

          <h3 class="info-title" v-if="interaction.side2DraftName">Draft Name:</h3>
          <p class="info-value" v-if="interaction.side2DraftName">{{ interaction.side2DraftName }}</p>

          <h3 class="info-title" v-if="interaction.updatedAt">Updated At:</h3>
          <p class="info-value" v-if="interaction.updatedAt">{{ interaction.updatedAt | moment('MMM Do YYYY') }}</p>

          <h3 class="info-title">Summary:</h3>
          <p class="info-value" v-html="formatRefs(interaction.summary)" ref="summary"></p>

          <div 
            class="info-title text-capitalize"
            v-if="interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptons"
          > 
            What to monitor:
          </div>
          <div class="info-value" v-if="interaction.monitor.labTests || interaction.monitor.otherTests || interaction.monitor.symptons || interaction.monitor.general"> 
            <span class="text-capitalize" v-if="interaction.monitor.labTests">Lab tests: </span>
            <span v-if="interaction.monitor.labTests">{{ interaction.monitor.labTests }}</span>

            <span class="text-capitalize" v-if="interaction.monitor.otherTests"> Other tests: </span>
            <span v-if="interaction.monitor.otherTests">{{ interaction.monitor.otherTests }}</span>

            <span class="text-capitalize" v-if="interaction.monitor.symptons"> Symptons: </span>
            <span v-if="interaction.monitor.symptons">{{ interaction.monitor.symptons }}</span>
            
            <span class="text-capitalize" v-if="interaction.monitor.general"> General: </span>
            <span v-if="interaction.monitor.general">{{ interaction.monitor.general }}</span>
          </div>

          <span class="info-title" v-if="interaction.note">Note:</span>
          <p class="info-value" v-if="interaction.note">{{ interaction.note }}</p>

          <h3 class="info-title" v-if="interaction.reviewOfStudies">Review of studies:</h3>
          <div class="info-value" v-if="interaction.reviewOfStudies">
            <p
              v-html="formatRefs(interaction.reviewOfStudies)"
              ref="reviewOfStudies"
            />
          </div>

          <span class="info-title" v-if="side2Pathways.length">Pathways:</span>
          <interaction-pathways
            ref="pathwaySection"
            class="info-value"
            v-if="side2Pathways.length"
            :side1Pathways="side1Pathways"
            :side2Pathways="side2Pathways"
            :side2Name="interaction.side2Material.name"
            :side1Name="interaction.side1Material.name"
            :side1RefsLength="interactionRefs.length"
            :side2RefsLength="side2Refs.length"
            :combinedRefs="combinedRefs"
            :relevantSide1Pathways="relevantSide1Pathways"
            :formatRefs="formatRefs"
          />

          <reference-table
            class="refs-table"
            :isInteraction="true"
            :references="combinedRefs"
            v-if="combinedRefs.length"
          />

          <span class="info-title" v-if="interaction.side1Material">
            Side 1 Material:
          </span>
          <router-link
            class="info-value"
            v-if="interaction.side1Material"
            :to="`/material/${interaction.side1Material._id}`"
          >
            {{ interaction.side1Material.name }}
          </router-link>

          <span class="info-title" v-if="interaction.side2Material">
            Side 2 Material:
          </span>
          <router-link
            class="info-value"
            v-if="interaction.side2Material"
            :to="`/material/${interaction.side2Material._id}`"
            >
              {{ interaction.side2Material.name }}
            </router-link>

          <h3 class="info-title" v-if="interaction.indications.length">Indications:</h3>
          <v-chip-group column v-if="interaction.indications.length">
            <v-chip
              v-for="(indication, idx) in interaction.indications"
              :key="idx"
              >{{ indication }}</v-chip>
          </v-chip-group>

        </v-card>
        <icons-map />
      </div>
      <v-dialog
          v-model="labelDialog"
          max-width="1400"
        >
        <label-peek 
          v-if="interaction.side2Label"
          :labelId="interaction.side2Label._id" 
          @close-label-dialog="labelDialog = false"
          @view-material="goToVinteraction"
          />
      </v-dialog>
    </section>
    <entity-not-found v-if="isNotFound" entity="interaction" />
  </div>
</template>

<script>
import { interactionService } from '@/cms/services/interaction.service';
import { utilService } from '@/cms/services/util.service';
import { eventBus, EV_addInteraction } from '@/cms/services/eventBus.service';
import confirmDelete from '@/cms/cmps/general/ConfirmDelete';
import referenceTable from '@/cms/cmps/common/ReferenceTable';
import labelPeek from '@/cms/cmps/interaction/edit/LabelPeek';
import iconsMap from '@/cms/cmps/general/IconsMap';
import entityNotFound from '@/cms/cmps/general/EntityNotFound'; 
import InteractionPathways from '@/cms/cmps/interaction/InteractionPathways';

export default {
  side1Refs: [],
  data() {
    return {
      interaction: null,
      dialog: false,
      labelDialog: false,
      sides: {
        side1Material: null,
        side2Material: null,
        side2Label: null,
      },
      interactionRefs: [],
      side1Pathways: [],
      side2Pathways: [],
      side2Refs: [],
      isArchive: false,
      isNotFound: false
    };
  },
  watch: {
    '$route.params.id'() {
      this.loadInteraction();
    }
  },
  computed: {
    combinedRefs() {
      let nextDraftIdx = 1;
      /// this reduce is necessary because some pathways are omitted, so pathwayRefs isn't relevant
      /// otherways this.side2Refs instead of side2Refs will do
      const side2Refs = this.relevantSide2Pathways.reduce((acc, pathway) => {
          pathway.references.forEach((pubmedId, idx) => {
              const isValidUrl = (typeof pubmedId === 'string' && pubmedId.startsWith('http'));
              const ref = {
                  draftIdx: nextDraftIdx++,
                  type: '',
                  txt: pathway.fullReferences[idx],
                  link: (isValidUrl) ? pubmedId : `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}`,
                  pubmedId: (isValidUrl) ? 0 : pubmedId
              };
              const isUnique = acc.findIndex(currRef => currRef.link === ref.link) === -1;
              if (isUnique) acc.push(ref);
          });
          return acc;
      }, []);
      return this.interactionRefs.concat(side2Refs, this.pathwayRefs);
    },
    relevantSide2Pathways() {
      return this.side2Pathways.filter(pathway => (pathway.type === 'enzyme' && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) ||
      (pathway.type === 'transporter' && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) ||
      (pathway.type === 'carrier' && (!pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor'))));
    },
    relevantSide1Pathways() {
      return this.side1Pathways.filter(pathway => {
          const idx = this.relevantSide2Pathways.findIndex(side2Pathway => side2Pathway.name.replace('CYP', '').toUpperCase() === pathway.name.replace('CYP', '').toUpperCase());
          return idx !== -1;
      });
    },
    pathwayRefs() {
      const txt = this.relevantSide1Pathways.reduce((acc, pathway) => {
        acc += pathway.influence + ' ';
        return acc;
      }, '');
      const sortedRefs = interactionService.getSortedRefs(txt, this.$options.side1Refs);
      return sortedRefs.filter(ref => this.interactionRefs.findIndex(currRef => currRef.link === ref.link) === -1);
    },
    recommendation() {
      var reco = this.interaction.recommendation;
      if (reco.charAt(reco.length - 1) === '.') {
        return reco.substring(0, reco.length - 1);
      }
      return reco;
    }
  },
  methods: {
    async getPathways() {
      const { _id } = this.interaction.side2Material;
      const { pathways, pathwayRefs } = await this.$store.dispatch({ type: 'loadMaterial', matId: _id });
      this.side2Pathways = pathways;
      this.side2Refs = pathwayRefs.filter((ref, idx, refs) => {
        return refs.findIndex(currRef => currRef.link === ref.link) === idx;
      });
    },
    async cloneInteraction() {
      const interactionCopy = JSON.parse(JSON.stringify(this.interaction));
      delete interactionCopy._id;
      
      const savedInteraction = await this.$store.dispatch({ type: 'saveInteraction', interaction: interactionCopy });
      eventBus.$emit(EV_addInteraction, {
          name: '',
          isNotice: true,
          type: 'interaction COPY',
          _id: savedInteraction._id,
      });
      this.$router.push(`/interaction/edit/${savedInteraction._id}`);
    },
    goToVinteraction(material) {
      this.$router.push(`/interaction/${this.$route.params.id}/${material._id}`);
    },
    formatRefs(txt, isPathwaysRefs = false) {
      if (!this.combinedRefs.length) return;
      const refsOrder = interactionService.getRefsOrder(txt, false, false).filter(num => txt.indexOf(num) > -1);
      let lastRefIdx = 0;
      refsOrder.forEach((refNum) => {
        let draftIdx = this.combinedRefs.findIndex(ref => ref && ref.draftIdx === refNum) + 1;
        if (isPathwaysRefs) {
          const sameRefs = this.combinedRefs.filter(ref => ref && ref.draftIdx === refNum);
          if (sameRefs.length > 1) {
            const ref = sameRefs.find(ref => this.side2Refs.findIndex(currRef => currRef.link === ref.link) === -1);
            draftIdx = this.combinedRefs.indexOf(ref) + 1;
          }
        }
        let refIdx = txt.indexOf(refNum, lastRefIdx + draftIdx.toString().length);
        if (!utilService.checkIfInsideRef(txt, refIdx) || lastRefIdx === refIdx) {
          let cnt = 0;
          while (txt.charAt(refIdx) === txt.charAt(refIdx + cnt)) {
            cnt++;
          }
          refIdx = txt.indexOf(refNum, refIdx + cnt);
        }
        if (lastRefIdx + draftIdx.toString().length > refIdx) lastRefIdx = refIdx + draftIdx.toString().length;
        else lastRefIdx = refIdx;
        if (refIdx > -1) {
          txt = txt.slice(0, lastRefIdx) +
          txt.slice(lastRefIdx, (lastRefIdx + refNum.toString().length)).replace(refNum, draftIdx) +
          txt.slice(lastRefIdx + refNum.toString().length);
        } 
      });
      return txt;
    },
    sortRefs() {
      const txt = `${this.interaction.summary} ${this.interaction.reviewOfStudies}`;
      const sortedRefs = interactionService.getSortedRefs(
        txt,
        this.interactionRefs
      );
      this.interactionRefs = sortedRefs;
    },
    async getReferences() {
      const matId = this.interaction.side1Material._id;
      const { refs, pathways } = await this.$store.dispatch({
        type: 'loadMaterial',
        matId,
      });
      this.side1Pathways = pathways;
      this.$options.side1Refs = refs;
      this.interactionRefs = refs.filter((ref) =>
        this.interaction.refs.includes(ref.draftIdx)
      );
      this.sortRefs();
    },
    async loadInteraction() {
      const intId = this.$route.params.id;
      if (intId) {
        const interaction = await this.$store.dispatch({
          type: (this.isArchive) ? 'loadArchiveInteraction' : 'loadInteraction',
          intId,
        });
        this.interaction = interaction;
        if (this.interaction) {
          await this.getReferences();
          if (this.interaction.side2Material) {
            await this.getPathways();
          }
          this.setRefsToolTip();
        } else {
          this.isNotFound = true;
        }
      }
    },
    async removeInteraction() {
      const interaction = JSON.parse(JSON.stringify(this.interaction));
      const intId = interaction._id;
      const saveToArchive = this.$store.dispatch({
        type: 'saveInteractionToArchive',
        interaction,
      });
      const removeInteraction = this.$store.dispatch({
        type: 'removeInteraction',
        intId,
      });
      Promise.all([saveToArchive, removeInteraction]).then(() => {
        this.$router.push('/interaction');
      });
    },
    displayDialog() {
      this.dialog = true;
    },
    getRefsFromIdxs(refIdxs) {
      const refs = [];
      refIdxs.forEach((idx) => {
        refs.push({ ...this.combinedRefs[idx - 1] });
      });
      return refs;
    },
    setRefsToolTip() {
      const { pathways, pathways2 } = this.$refs.pathwaySection ? this.$refs.pathwaySection.$refs : { pathways: null, pathways2: null };
      const { summary, reviewOfStudies } = this.$refs;
      const summarySubs = summary ? summary.querySelectorAll('sub') : [];
      const reviewSubs = reviewOfStudies ? reviewOfStudies.querySelectorAll('sub') : [];
      const pathwaySubs = pathways ? pathways.querySelectorAll('sub') : [];
      const pathway2Subs = pathways2 ? pathways2.querySelectorAll('sub') : [];
      const elSubs = [...summarySubs, ...reviewSubs, ...pathwaySubs, ...pathway2Subs ];
      for (let i = 0; i < elSubs.length; i++) {
        const refIdxs = interactionService.getRefsOrder(elSubs[i].innerText);
        if (!refIdxs.length) continue;
        
        elSubs[i].innerText = interactionService.formatRefStrs(elSubs[i].innerText);
        elSubs[i].addEventListener('mouseenter', this.setTooltipPos);
        
        const elTooltip = document.createElement('aside');
        const refs = this.getRefsFromIdxs(refIdxs);
        elTooltip.classList.add('refs-tooltip');
        let htmlStr = '<ul>';
        for (let j = 0; j < refs.length; j++) {
          let draftIdx = this.combinedRefs.findIndex(ref => ref && ref.draftIdx === refs[j].draftIdx) + 1;
          if (i >= elSubs.length - pathway2Subs.length) {
            const sameRefs = this.combinedRefs.filter(ref => ref && ref.draftIdx === refs[j].draftIdx);
            if (sameRefs.length > 1) {
              const ref = sameRefs.find(ref => this.side2Refs.findIndex(currRef => currRef.link === ref.link) === -1);
              draftIdx = this.combinedRefs.indexOf(ref) + 1;
            }
          }
          htmlStr += `<li class="tooltip-item">
            <p><span>${draftIdx}</span>.${this.formatedRefTxt(refs[j].txt)}</p>
            <a href="${refs[j].link}" class="ref-link" target="_blank">${refs[j].link}</a>
          </li>`;
        }
        htmlStr += '</ul>';
        elTooltip.innerHTML = htmlStr;
        elSubs[i].appendChild(elTooltip);
      }
    },
    setTooltipPos(ev) {
      const elTooltip = ev.target.querySelector('.refs-tooltip');
      if (ev.clientX + elTooltip.offsetWidth > window.innerWidth) {
        elTooltip.style.transformOrigin = 'top right';
        elTooltip.style.left = `unset`;
        elTooltip.style.right = `0`;
      }
    },
    formatedRefTxt(fullRefTxt) {
        if (!fullRefTxt) return '';
        const doiIdx = fullRefTxt.indexOf('doi');
        if (doiIdx !== -1) {
            return fullRefTxt.substring(0, doiIdx).trim();
        }
        const PmidIdx = fullRefTxt.indexOf('PMID');
        if (PmidIdx !== -1) {
            return fullRefTxt.substring(0, PmidIdx).trim();
        }
        return fullRefTxt;
    }
  },
  created() {
    if (this.$route.name === 'ArchiveInteractionDetails') {
      this.isArchive = true;
    }
    this.loadInteraction();
  },
  components: {
    confirmDelete,
    referenceTable,
    labelPeek,
    InteractionPathways,
    iconsMap,
    entityNotFound
  }
};
</script>