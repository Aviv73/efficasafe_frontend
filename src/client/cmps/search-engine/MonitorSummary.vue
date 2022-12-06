<template>
  <section class="monitor-summary">
    <template>
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
    <p class="monitor-summary-footer">This monitoring guidance is for Drug vs. Herb/Supplement interactions. Click each one for specifics. Drug-Drug monitoring specifics can be found on each Drug-Drug interaction page.</p>
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
// import Collapse from '@/client/cmps/common/Collapse';

// import CollapseToggleIcon from '@/client/cmps/common/icons/CollapseToggleIcon';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown';

export default {
  props: {
    interactions: {
      type: Array,
      required: true
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
    }
  },
  methods: {
    flatten(interactions) {
      interactions.forEach(interaction => {
        if (interaction.vInteractions) {
          this.flatten(interaction.vInteractions);
        } else this.flatInteractions.push(interaction);
      });
    },
    getMonitorTxt(propName) {
      const seenMap = {};
      const reduced = this.flatInteractions.reduce((acc, { monitor }) => {
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
          }
          return acc;
        }, []);
        acc += acc && words.join(', ') ? ', ' + words.join(', ') : words.join(', ');
        return acc;
      }, '');
      const sortted = this.sortRes(reduced);
      return sortted;
    },
    sortRes(str) {
      const regex = new RegExp(', (?![^(]*\\))');
      const strs = str.split(regex).map(str => str.trim());
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
      const newStr = all.join(', ');
      return newStr;
    }
  },
  created() {
    this.flatten(this.interactions);
  },
  components: {
    // Collapse,
    ChevronUpIcon,
    ChevronDownIcon
    // CollapseToggleIcon
  }
};
</script>
