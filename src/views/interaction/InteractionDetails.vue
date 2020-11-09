<template>
  <section
    class="interaction-details"
    v-if="interaction"
  >
    <confirm-delete
      v-model="dialog"
      type="interaction"
      :dialog="dialog"
      @delete-confirm="removeInteraction"
      @delete-cancel="dialog = false"
    />
    <div class="action-container">
      <v-btn color="primary" to="/interaction">
        <v-icon small left>mdi-arrow-left</v-icon>Back to Interactions
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" :to="`/interaction/edit/${interaction._id}`">
        <v-icon small left>mdi-pencil</v-icon>Edit
      </v-btn>
      <v-btn color="error" @click="displayDialog">
        <v-icon small left>mdi-delete</v-icon>Delete
      </v-btn>
    </div>

    <v-card class="info-container">
      <v-card-title class="interaction-details-title">
        <h2 v-if="interaction.side1Material">
          {{ interaction.side1Material.name }}
        </h2>
        <span class="spacing">&</span>
        <h2 v-if="interaction.side2Material">
          {{ interaction.side2Material.name }}
        </h2>
        <h2 v-if="interaction.side2Label">{{ interaction.side2Label.name }}</h2>
      </v-card-title>

      <span class="info-title">Is Active:</span>
      <span>{{ interaction.isActive ? 'Active' : 'Not Active' }}</span>

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
        >{{ interaction.side2Material.name }}</router-link
      >

      <span class="info-title" v-if="interaction.side2Label">
        Side 2 Label:
      </span>
      <router-link
        class="info-value"
        v-if="interaction.side2Label"
        :to="`/label/${interaction.side2Label._id}`"
      >
        {{ interaction.side2Label.name }}
      </router-link>

      <h3 class="info-title">Draft Name:</h3>
      <p class="info-value">{{ interaction.side2DraftName }}</p>

      <h3 class="info-title">Source:</h3>
      <p class="info-value">{{ interaction.src }}</p>

      <h3 class="info-title">Recommendation:</h3>
      <p class="info-value">{{ recommendation }}</p>

      <h3 class="info-title">Summary:</h3>
      <p 
        class="info-value" 
        v-html="txtWithRefs('summary')"
        ref="summary"
        ></p>

      <span class="info-title">Note:</span>
      <p class="info-value">{{ interaction.note }}</p>

      <h3 class="info-title">Level of evidence:</h3>
      <span class="info-value">{{ interaction.evidenceLevel }}</span>

      <h3 class="info-title">Review of studies:</h3>
      <div>
        <p 
          class="info-value" 
          v-html="txtWithRefs('reviewOfStudies')"
          ref="reviewOfStudies"
          ></p>
      </div>

      <reference-table
        class="refs-table"
        :isInteraction="true"
        :references="interactionRefs"
        v-if="interactionRefs.length"
      />

      <h3 class="info-title">Indications:</h3>
      <v-chip-group column>
        <v-chip
          v-for="(indication, idx) in interaction.indications"
          :key="idx"
          >{{ indication }}</v-chip
        >
      </v-chip-group>

      <h3 class="info-title">Lab Tests:</h3>
      <p class="info-value">{{ interaction.monitor.labTests }}</p>

      <h3 class="info-title">Other Tests:</h3>
      <p class="info-value">{{ interaction.monitor.otherTests }}</p>

      <h3 class="info-title">Symptoms:</h3>
      <p class="info-value">{{ interaction.monitor.symptoms }}</p>

      <h2 class="info-title">Editor's Draft:</h2>
      <span></span>

      <h3 class="info-title">General:</h3>
      <div class="info-value">{{ interaction.editorDraft.general }}</div>

      <h3 class="info-title">Info Side 1:</h3>
      <div class="info-value">{{ interaction.editorDraft.infoSide1 }}</div>

      <h3 class="info-title">Info Side 2:</h3>
      <div class="info-value">{{ interaction.editorDraft.infoSide2 }}</div>

      <h3 class="info-title">Gates:</h3>
      <v-chip-group column>
        <v-chip
          v-for="(gate, idx) in interaction.editorDraft.gates"
          :key="idx"
          >{{ gate }}</v-chip
        >
      </v-chip-group>
    </v-card>
    <icons-map />
  </section>
</template>

<script>
import { interactionService } from '@/services/interaction.service';
import confirmDelete from '@/cmps/general/ConfirmDelete';
import referenceTable from '@/cmps/common/ReferenceTable';
import iconsMap from '@/cmps/general/IconsMap';

export default {
  data() {
    return {
      interaction: null,
      dialog: false,
      sides: {
        side1Material: null,
        side1Label: null,
        side2Material: null,
        side2Label: null,
      },
      interactionRefs: []
    };
  },
  watch: {
    '$route.params.id'() {
      this.loadInteraction();
    }
  },
  methods: {
    txtWithRefs(propName) {
      let txt = this.interaction[propName];
      const refsOrder = interactionService.getRefsOrder(txt);
      refsOrder.forEach((refNum) => {
        const idx = this.interactionRefs.findIndex(
          (ref) => ref.draftIdx === refNum
        );
        txt = txt.replaceAll(refNum + '', idx + 1);
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
      const material = await this.$store.dispatch({
        type: 'loadMaterial',
        matId,
      });
      this.interactionRefs = material.refs.filter((ref) =>
        this.interaction.refs.includes(ref.draftIdx)
      );
      this.sortRefs();
    },
    async loadInteraction() {
      const intId = this.$route.params.id;
      if (intId) {
        const interaction = await this.$store.dispatch({
          type: 'loadInteraction',
          intId,
        });
        this.interaction = interaction;
        this.getReferences();
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
      refIdxs.forEach(idx => {
        refs.push({ ...this.interactionRefs[idx - 1] });
      })
      return refs;
    },
    setRefsToolTip() {
      const { summary, reviewOfStudies } = this.$refs;
      const summarySubs = summary.querySelectorAll('sub');
      const reviewSubs = reviewOfStudies.querySelectorAll('sub');
      const elSubs = [ ...summarySubs, ...reviewSubs ];
      for (let i = 0; i < elSubs.length; i++) {
        const refIdxs = interactionService.getRefsOrder(elSubs[i].innerText);
        if (!refIdxs[0]) return;
        const elTooltip = document.createElement('aside');
        const refs = this.getRefsFromIdxs(refIdxs);
        elTooltip.classList.add('refs-tooltip');
        let htmlStr = '<ul>';
        for (let j = 0; j < refs.length; j++) {
          htmlStr += `<li class="tooltip-item">
            <p><span>${j + 1}</span>.${refs[j].txt}</p>
            <a href="${refs[j].link}" target="_blank">${refs[j].link}</a>
          </li>`;
        }
        htmlStr += '</ul>';
        elTooltip.innerHTML = htmlStr;
        elSubs[i].appendChild(elTooltip);
      }
    }
  },
  computed: {
    recommendation() {
      var reco = this.interaction.recommendation;
      if (reco.charAt(reco.length - 1) === '.') {
        return reco.substring(0, reco.length - 1);
      }
      return reco;
    }
  },
  created() {
    this.loadInteraction();
  },
  updated() {
    this.setRefsToolTip();
  },
  components: {
    confirmDelete,
    referenceTable,
    iconsMap
  },
};
</script>