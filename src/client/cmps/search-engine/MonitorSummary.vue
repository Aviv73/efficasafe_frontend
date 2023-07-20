<template>
  <section class="monitor-summary">
    <template>
      <div class="interaction-preview-header WTM-title table-row">
        <span class="monitor-summary-header table-col">
          <span class="capsule">
            Ensure patient safety by monitoring these:
            <!-- <span class="de-activator">
              <chevron-up-icon class="opened" title="" />
              <chevron-down-icon class="closed" title="" />
            </span> -->
          </span>
        </span>
        <span class="table-col" />
        <span class="table-col" />
      </div>
    </template>
    <template>
      <div class="interaction-preview-content">
        <ul class="monitor-summary-list">
          <li v-if="generalTxt">
            <span class="monitor-summary-list-header font-bold">General:</span>
            {{ generalTxt | capitalize }}
          </li>
          <li v-if="labTestsTxt">
            <span class="monitor-summary-list-header font-bold">Lab Tests:</span>
            {{ labTestsTxt | capitalize }}
          </li>
          <li v-if="materialsLabTestsTxt">
            <span>Nurtrient levels:</span>
            {{ materialsLabTestsTxt }}
          </li>
          <li v-if="otherTestsTxt">
            <span class="monitor-summary-list-header font-bold">Other Tests:</span>
            {{ otherTestsTxt | capitalize }}
          </li>
          <li v-if="symptomsTxt">
            <span class="monitor-summary-list-header font-bold">Symptoms:</span>
            {{ symptomsTxt | capitalize }}
          </li>
        </ul>
      </div>
    </template>
    <template v-if="materialsWithDeplations.length">

      <br>
      <div class="interaction-preview-content">
        <ul class="monitor-summary-list">
          <li>
            <p class="font-bold">Drug-induced deficiencies:</p>
          </li>
          <li v-for="mat in materialsWithDeplations" :key="mat._id">
            <MaterialDepletionsSection hoverMsg="Add to search results" :onClickMatCb="addMaterialToSearch" :material="mat"/>
          </li>
        </ul>
      </div>
      <br>
      <div class="interaction-preview-content" v-if="materialsSymtoms && materialsSymtoms.length">
        <ul class="monitor-summary-list">
          <li>
            <p class="font-bold">Deficiency Symptoms:</p>
          </li>
          <li v-for="symp in materialsSymtoms" :key="symp">
            {{ symp }}
          </li>
        </ul>
        <br>
      </div>
    </template>
    <p class="monitor-summary-footer">
      This monitoring guidance is for Drug vs. Herb/Supplement interactions. <br />
      Click each one for specifics.<br />
      Drug-Drug monitoring specifics can be found on each Drug-Drug interaction page.
    </p>
  </section>
  <!-- <section class="monitor-summary">
    <collapse :isMonitorSummary="true">
      <template #header>
        <div class="interaction-preview-header WTM-title table-row">
          <span class="monitor-summary-header table-col">
            <span class="capsule">
              Ensure patient safety by monitoring these:
              <span class="de-activator">
                <chevron-up-icon class="opened" title="" />
                <chevron-down-icon class="closed" title="" />
              </span>
            </span>
          </span>
          <span class="table-col" />
          <span class="table-col" />
        </div>
      </template>
      <template #content>
        <div class="interaction-preview-content">
          <ul class="monitor-summary-list">
            <li v-if="generalTxt">
              <span class="monitor-summary-list-header font-bold">General:</span>
              {{ generalTxt | capitalize }}
            </li>
            <li v-if="labTestsTxt">
              <span class="monitor-summary-list-header font-bold">Lab Tests:</span>
              {{ labTestsTxt | capitalize }}
            </li>
            <li v-if="otherTestsTxt">
              <span class="monitor-summary-list-header font-bold">Other Tests:</span>
              {{ otherTestsTxt | capitalize }}
            </li>
            <li v-if="symptomsTxt">
              <span class="monitor-summary-list-header font-bold">Symptoms:</span>
              {{ symptomsTxt | capitalize }}
            </li>
          </ul>
        </div>
      </template>
      <template #de-activator>
        <collapse-toggle-icon />
      </template>
    </collapse>
  </section> -->
</template>

<script>
import MaterialDepletionsSection from '../common/MaterialDepletionsSection.vue';
import { eventBus } from '@/cms/services/eventBus.service';
// import Collapse from '@/client/cmps/common/Collapse';

// import CollapseToggleIcon from '@/client/cmps/common/icons/CollapseToggleIcon';
// import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
// import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';

const msgsToMentionSource = ['Blood drug level', 'Exacerbation of drug adverse reactions', 'exacerbation of symptoms for which the drug is being given', 'exacerbation of toxicity symptoms', 'reduction of drug efficacy', 'potentiation or reduction of drug efficacy'].map(c => c.toLowerCase());

export default {
  props: {
    interactions: {
      type: Array,
      required: true
    },
    materials: {
      type: Array
    }
  },
  data() {
    return {
      flatInteractions: []
    };
  },
  computed: {
    generalTxt() {
      return this.getMonitorTxt('general');
    },
    labTestsTxt() {
      return this.getMonitorTxt('labTests');
    },
    otherTestsTxt() {
      return this.getMonitorTxt('otherTests');
    },
    symptomsTxt() {
      return this.getMonitorTxt('symptoms');
    },

    materialsWithDeplations() {
      return  this.materials.filter(c => c.depleteds?.length);
    },
    materialsLabTestsTxt() {
      return this.getMaterialMonitorTxt('labTests');
    },
    materialsSymtoms() {
      return this.getMaterialMonitorTxt('symptoms', false);
    }
  },
  methods: {
    addMaterialToSearch(mat) {
      eventBus.$emit('add-to-search', mat);
    },
    flatten(interactions) {
      interactions.forEach(interaction => {
        if (interaction.vInteractions) {
          this.flatten(interaction.vInteractions);
        } else this.flatInteractions.push(interaction);
      });
    },
    getMonitorTxt(propName) {
      const wardMap = this.flatInteractions.reduce((_wardMap, interaction) => {
        const { monitor, side2Material, side2Label } = interaction;
        const regex = new RegExp(', (?![^(]*\\))');
        let words = (monitor?.[propName] || '')
          .split(' ')
          .filter(Boolean)
          .join(' ')
          .split(regex)
          .filter(str => str)
          .map(str => str.trim());

        words.forEach((word) => {
          if (!_wardMap[word]) {
            const secChar = word.charAt(1);
            word = secChar !== secChar.toUpperCase() ? word.charAt(0).toLowerCase() + word.slice(1) : word;
            const lastChar = word.charAt(word.length - 1);
            word = lastChar === '.' ? word.substring(0, word.length - 1) : word;
            word = word.trim();
            const material = this.materials.find(c => c._id === (side2Material || side2Label)?._id);
            const byName = material?.userQuery || side2Material?.name || side2Label?.name || '';
            if (!_wardMap[word]) _wardMap[word] = [byName];
            else _wardMap[word].push(byName)
          }
        });
        return _wardMap;
      }, {});

      const words = this.sortRes(Object.keys(wardMap));

      let res = words.map(c => {
        const names = Array.from(new Set(wardMap[c]?.filter(Boolean) || []));
        if (msgsToMentionSource.includes(c.toLowerCase()) && names.length) return `${c} (${names.filter(Boolean).join(', ')})`;
        return c;
      });

      // res = res.map(c => c.trim().split(',').map(_=>_.trim()).filter(Boolean).join(',')).filter(Boolean).join(', ');
      res = res.map(c => c.trim().split(',').filter(Boolean).join(',')).filter(Boolean).join(', ');
      // if (res) res += '.';

      return res;
    },
    getMaterialMonitorTxt(propName, asTxt = true) {
      const wardMap = this.materialsWithDeplations.reduce((_wardMap, mat) => {
        const { monitor } = mat;
        if (!monitor) return _wardMap;
        if (!monitor?.[propName]) return _wardMap;
        _wardMap.push(monitor?.[propName]);
        return _wardMap;
      }, []);
      const res = wardMap;
      const filtered = res.map(c => c.trim()).filter(Boolean)
      return asTxt? filtered.join(', ') : filtered;
    },
    getMonitorTxt_old_notused(propName) {
      const seenMap = {};
      const reduced = this.flatInteractions.reduce((acc, { monitor, side2Material, side2Label }) => {
        const regex = new RegExp(', (?![^(]*\\))');
        let words = monitor[propName]
          .split(regex)
          .filter(str => str)
          .map(str => str.trim());
        words = words.reduce((acc, word) => {
          if (!seenMap[word]) {
            const secChar = word.charAt(1);
            word = secChar !== secChar.toUpperCase() ? word.charAt(0).toLowerCase() + word.slice(1) : word;
            const lastChar = word.charAt(word.length - 1);
            word = lastChar === '.' ? word.substring(0, word.length - 1) : word;
            if (!seenMap[word]) {
              acc.push(word);
              seenMap[word] = true;
            } 
            // else seenMap[word].push(byName)
          }
          return acc;
        }, []);
        const joined = words.join(', ');
        acc += acc && joined ? ', ' + joined : joined;
        const byName = side2Material?.name || side2Label?.name || '';
        if (msgsToMentionSource.includes(joined)) acc += ` (${byName})`;
        return acc;
      }, '');
      const sortted = this.sortRes(reduced);
      return sortted;
    },
    sortRes(str) {
      const regex = new RegExp(', (?![^(]*\\))');
      const strs = Array.isArray(str)? str : str.split(regex).map(str => str.trim());
      const noCaps = strs
        .filter(str => {
          if (str !== 'aPTT' && str !== 'hbA1c' && str !== 'hct' && str !== 'hgB' && str !== str.toUpperCase()) return str;
        })
        .sort();
      let caps = strs.filter(str => {
        if (str === str.toUpperCase() || str === 'aPTT' || str === 'hbA1c' || str === 'hct' || str === 'hgB') return str;
      });
      caps = caps
        .map(c => {
          if (c === 'hbA1c') return 'HbA1c';
          if (c === 'hct') return 'Hct';
          if (c === 'hgB') return 'HgB';
          return c;
        })
        .sort();
      const all = caps.concat(noCaps);
      const bloodDrugLvlIdx = all.findIndex(str => str === 'Blood drug level' || str === 'blood drug level');
      if (bloodDrugLvlIdx >= 0) {
        const bloodDrugLvl = all[bloodDrugLvlIdx];
        all.splice(bloodDrugLvlIdx, 1);
        all.unshift(bloodDrugLvl);
      }
      if (Array.isArray(str)) return all;
      const newStr = all.join(', ');
      return newStr;
    }
  },
  created() {
    this.flatten(this.interactions);
  },
  components: {
    MaterialDepletionsSection
    // Collapse,
    // ChevronUpIcon,
    // ChevronDownIcon
    // CollapseToggleIcon
  },
  watch: {
    interactions: {
      deep: true,
      handler() {
        this.flatten(this.interactions);
      }
    }
  }
};
</script>

<style lang="scss">
.depleted-section {
  p {
    margin-bottom: 0 !important;
  }
}
</style>