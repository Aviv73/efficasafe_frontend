<template>
  <section class="label-interaction-preview">
    <template v-if="!isOneGroup">
      <div class="label-interaction-preview-group" v-for="(atcGroup, idx) in atcGroupedVinteractions" :key="idx">
        <collapse @collapse-closed="onCollapseToggle(idx)" :ref="`collapse-${idx}`">
          <template #header>
            <div class="label-interaction-preview-group-header table-row" @click="onCollapseToggle(idx)">
              <span class="table-col">
                <interaction-capsules :name="getGroupName(atcGroup.name)" :vInteractionCount="atcGroup.vInteractions.length" :showDraftName="false" :localize="true" :color="color" />
              </span>
              <span class="table-col" :title="interaction.recommendation">
                {{ shortRecommendation }}
              </span>
              <span class="table-col">
                {{ interaction.evidenceLevel }}
                <span class="de-activator">
                  <chevron-up-icon class="opened" title="" />
                  <chevron-down-icon class="closed" title="" />
                </span>
              </span>
            </div>
          </template>
          <template #content>
            <component v-for="vInteraction in atcGroup.vInteractions" :key="vInteraction.side2Material._id" :is="vInteractionHeaderEl" :to="`/interaction/${vInteraction._id}/${vInteraction.side2Material._id}`">
              <collapse>
                <template #header>
                  <div class="label-interaction-preview-group-header table-row child">
                    <span class="table-col">
                      <interaction-capsules :name="`${vInteraction.side1Material.name} & ${vInteraction.side2Material.name}`" :vInteractionCount="0" :showDraftName="false" :localize="true" :color="color" />
                    </span>
                    <span class="table-col" :title="interaction.recommendation">
                      {{ shortRecommendation }}
                    </span>
                    <span class="table-col">
                      <span class="refs-length">
                        {{ interaction.evidenceLevel }}
                      </span>
                      <span class="refs" v-if="interaction.refs">
                        {{ `(${interaction.refs.length + getPathwayRefCount(vInteraction.side2Material._id)})` }}
                      </span>
                    </span>
                  </div>
                </template>
                <template #content>
                  <div v-if="!link" class="summary-container">
                    <h3 class="font-bold">Summary</h3>
                    <long-txt :txt="vInteraction.summary" :maxChars="250" :expandable="false" :overflowSymb="getInteractionLink(vInteraction)" isHTML />
                  </div>
                </template>
                <template #de-activator>
                  <collapse-toggle-icon />
                </template>
              </collapse>
            </component>
          </template>
          <template #de-activator>
            <collapse-toggle-icon />
          </template>
        </collapse>
      </div>
    </template>
    <template v-else>
      <div class="label-interaction-preview-list" :class="{ 'is-empty': !atcGroupedVinteractions.length }" v-if="restOfVinteractions.length">
        <component v-for="vInteraction in restOfVinteractions" :key="vInteraction.side2Material._id" :is="vInteractionHeaderEl" :to="`/interaction/${vInteraction._id}/${vInteraction.side2Material._id}`">
          <collapse>
            <template #header>
              <div class="label-interaction-preview-group-header table-row">
                <span class="table-col">
                  <interaction-capsules :name="`${vInteraction.side1Material.name} & ${vInteraction.side2Material.name}`" :vInteractionCount="0" :showDraftName="false" :localize="true" :color="color" />
                </span>
                <span class="table-col" :title="interaction.recommendation">
                  {{ shortRecommendation }}
                </span>
                <span class="table-col">
                  {{ interaction.evidenceLevel }}
                  <span class="refs" v-if="interaction.refs">
                    {{ `(${interaction.refs.length + getPathwayRefCount(vInteraction.side2Material._id)})` }}
                  </span>
                </span>
              </div>
            </template>
            <template #content>
              <div v-if="!link" class="summary-container">
                <h3 class="font-bold">Summary</h3>
                <long-txt :txt="vInteraction.summary" :maxChars="250" :expandable="false" :overflowSymb="getInteractionLink(vInteraction)" isHTML />
              </div>
            </template>
            <template #de-activator>
              <collapse-toggle-icon />
            </template>
          </collapse>
        </component>
      </div>
    </template>
    <loader v-if="isLoading" class="loader" />
  </section>
</template>

<script>
import { interactionUIService } from '@/cms/services/interaction-ui.service';
import { interactionService } from '@/cms/services/interaction.service';

import Collapse from '@/client/cmps/common/Collapse';
import LongTxt from '@/client/cmps/common/LongTxt';
import InteractionCapsules from '@/client/cmps/shared/InteractionCapsules';

import Loader from '@/client/cmps/common/icons/Loader';
import CollapseToggleIcon from '@/client/cmps/common/icons/CollapseToggleIcon';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';

export default {
  props: {
    interaction: {
      type: Object,
      required: true
    },
    material: {
      type: Object,
      required: true
    },
    shortRecommendation: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    materialIds: {
      type: Array,
      required: true
    },
    link: {
      type: Boolean,
      default: false
    },
    parentIdx: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      vInteractions: [],
      isLoading: false,
      restOfVinteractions: []
    };
  },
  computed: {
    atcGroupVinteractionMap() {
      const copy = [...this.vInteractions];
      const map = this.vInteractions.reduce((acc, vinteraction) => {
        vinteraction.atcParentGroups.forEach(atcGroup => {
          const atcGroupName = atcGroup.split(' ').splice(0).join(' ');
          if (atcGroupName.toLowerCase().includes('combination') || atcGroupName.toLowerCase().includes('combinations') || atcGroupName.toLowerCase().includes('and')) return acc;
          if (!acc[atcGroupName]) {
            acc[atcGroupName] = [];
          }
          if (!acc[atcGroupName].includes(vinteraction.side2Material._id)) {
            const idx = copy.findIndex(v => v.side2Material._id === vinteraction.side2Material._id);
            if (idx !== -1) {
              acc[atcGroupName].push(vinteraction.side2Material._id);
              copy.splice(idx, 1);
            }
          }
        });
        return acc;
      }, {});
      const labelName = this.interaction.side2Label.name.split('&')[1].trim();
      const lastKeyName = `XXX More ${labelName}`;
      map[lastKeyName] = [];
      Object.keys(map).forEach(key => {
        if (key === lastKeyName) return;
        if (map[key].length === 1) {
          map[lastKeyName].push(map[key][0]);
          delete map[key];
        }
      });
      map[lastKeyName] = map[lastKeyName].concat(copy.map(c => c.side2Material._id));

      Object.keys(map).forEach(key => {
        if (!map[key].length) {
          delete map[key];
        }
      });

      this.setRestOfVinteractions(map[lastKeyName]);

      return map;
    },
    atcGroupedVinteractions() {
      let groupedVinteractions = Object.keys(this.atcGroupVinteractionMap).reduce((acc, atcGroup) => {
        const ids = this.atcGroupVinteractionMap[atcGroup];
        let vInteractions = [];
        ids.forEach(id => {
          const matching = this.vInteractions.filter(vinteraction => vinteraction.side2Material._id === id);
          vInteractions = vInteractions.concat(matching);
        });
        acc.push({ name: atcGroup, vInteractions: vInteractions });
        return acc;
      }, []);
      groupedVinteractions.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      return groupedVinteractions;
    },
    vInteractionHeaderEl() {
      return this.link ? 'router-link' : 'span';
    },
    openCollapses() {
      return this.$store.getters.openCollapses.Results;
    },
    isOneGroup() {
      const keys = Object.keys(this.atcGroupVinteractionMap);
      return keys.length === 1 && keys[0].startsWith('XXX More');
    }
  },
  methods: {
    async getRelatedMaterials() {
      this.isLoading = true;
      const { interaction } = this;
      const labelId = interaction.side2Label._id;
      const criteria = { limit: 0, page: 0, labelId };
      const relatedMaterials = await this.$store.dispatch({
        type: 'getMaterials',
        criteria,
        doCache: true,
        cacheKey: `labelCache${interaction.side2Label._id}`
      });
      this.relatedMaterials = relatedMaterials;
      this.vInteractions = relatedMaterials.map(({ _id, name, type, atcPaths, drugBankId }) => {
        return {
          _id: interaction._id,
          side1Material: interaction.side1Material,
          side2Material: {
            _id,
            name,
            type
          },
          side2Label: null,
          recommendation: interaction.recommendation,
          isVirtual: true,
          side2DraftName: interaction.side2DraftName,
          drugBankId,
          summary: interaction.summary,
          atcParentGroups: atcPaths.map(atcPath => atcPath.filter((path, idx) => idx === 3)).flat(1)
        };
      });
      this.isLoading = false;
    },
    restoreCollapses() {
      Object.entries(this.openCollapses).forEach(([key, value]) => {
        Object.keys(value).forEach(idx => {
          if (this.parentIdx === +key) {
            this.$nextTick(() => {
              const elCollapse = this.$refs[`collapse-${idx}`][0];
              elCollapse.isContentVisible = true;
            });
          }
        });
      });
    },
    onCollapseToggle(idx) {
      const cacheData = {
        key: this.$route.fullPath,
        idx,
        parentIdx: this.parentIdx
      };
      interactionService.cacheSearchState(cacheData);
    },
    getInteractionLink(interaction) {
      const url = `/interaction/${interaction._id}/${interaction.side2Material._id}`;
      return `.
                <a class="interaction-link" href="${url}">
                    Read more...
                </a>
            `;
    },
    getGroupName(groupNameWithId) {
      let noIdGroupName = groupNameWithId.split(' ').splice(1).join(' ');
      if (!noIdGroupName) noIdGroupName = noIdGroupName.replace(/\[(.*?)\]/g, '');
      return `${this.interaction.side1Material.name} & ${noIdGroupName}`;
    },
    getPathwayRefCount(materialId) {
      const { pathways } = this.relatedMaterials.find(m => m._id === materialId);
      const side2Pathways = pathways.reduce((acc, pathway) => {
        if (((pathway.type === 'enzyme' || pathway.type === 'transporter') && (pathway.actions.includes('substrate') || pathway.actions.includes('binder'))) || (pathway.type === 'carrier' && !pathway.actions.includes('inducer') && !pathway.actions.includes('inhibitor'))) {
          acc.push(pathway);
        }

        return acc;
      }, []);
      const seenRefsMap = {};
      const side2Refs = side2Pathways.reduce((acc, pathway) => {
        pathway.references.forEach(ref => {
          if (!seenRefsMap[ref]) {
            acc.push(ref);
            seenRefsMap[ref] = true;
          }
        });
        return acc;
      }, []);
      const side1PathwayRefs = this.material.pathways.reduce((acc, pathway) => {
        const idx = side2Pathways.findIndex(side2Pathway => side2Pathway.name?.replace('CYP', '').toUpperCase() === pathway.name?.replace('CYP', '').toUpperCase());
        if (idx !== -1) {
          const refs = interactionUIService.getRefsOrder(pathway.influence);
          refs.forEach(ref => {
            if (!seenRefsMap[ref]) {
              if (!this.interaction.refs.includes(ref)) {
                acc.push(ref);
              }
              seenRefsMap[ref] = true;
            }
          });
        }
        return acc;
      }, []);
      const refs = interactionUIService.getRefsOrder(this.material.effectOnDrugMetabolism);
      const moreRefs = refs.reduce((acc, ref) => {
        if (!seenRefsMap[ref]) {
          acc.push(ref);
          seenRefsMap[ref] = true;
        }
        return acc;
      }, []);
      return side2Refs.length + side1PathwayRefs.length + moreRefs.length;
    },
    setRestOfVinteractions(ids) {
      if (!ids) return;
      ids.forEach(id => {
        const matching = this.vInteractions.filter(vinteraction => vinteraction.side2Material._id === id);
        this.restOfVinteractions = this.restOfVinteractions.concat(matching);
      });
    }
  },
  async created() {
    await this.getRelatedMaterials();
    this.restoreCollapses();
  },
  components: {
    Collapse,
    InteractionCapsules,
    ChevronUpIcon,
    LongTxt,
    ChevronDownIcon,
    CollapseToggleIcon,
    Loader
  }
};
</script>
