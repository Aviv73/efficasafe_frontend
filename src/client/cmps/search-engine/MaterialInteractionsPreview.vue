<template>
  <section class="interactions-preview">
    <div v-if="disabled" class="interactions-preview-warnning flex-coloumn">
      <alert-circle-outline-icon title="" />
      There is no additional results for {{ userQuery }} as it is part of {{ getCompoundName(materials[0].name, userQuery) }}
      <hr v-if="interactions.length || (materials.length === 1 && !isOneMaterial)" />
    </div>
    <div v-else class="interactions-preview-composites">
      <!-- <h6 v-if="previewHeader" class="sub-title">{{ previewHeader }}</h6> -->
      <ul v-if="previewHeader">
        <li
          class="interactions-preview-composites-composite"
          :class="{ 'under-construction': material.isUnderStudy }"
          v-for="material in materials"
          :key="material._id"
          :style="{
            'background-image': `url('${require(`@/client/assets/icons/types/${getTypeImgName(material.type)}.svg`)}')`
          }"
        ></li>
      </ul>
      <!-- <ul v-if="material.isUnderStudy" class="interactions-preview under-construction">
                <li>
                    This material is still under construction. The results you may see are only partial.
                    Because you searched this material, it will get higher priority.
                </li>
            </ul> -->
      <ul>
        <li
          class="interactions-preview-composites-composite"
          v-for="material in materials"
          :key="material._id"
          :style="{
            'background-image': `url('${require(`@/client/assets/icons/types/${getTypeImgName(material.type)}.svg`)}')`
          }"
        >
          <span class="clip-txt">{{ material.name }}</span>
          <router-link v-if="material.isShowPage" class="details-link" :to="{ path: `/material/${material._id}`, query: { q: userQuery } }" target="_blank"> {{ material.type | capitalize }} info </router-link>
          <!-- <tooltip :hidden="!material.isUnderStudy" bottom>
                    <template #content>
                        <div v-if="material.isUnderStudy" class="interactions-preview under-construction">
                            This material is still under construction. The results you may see are only partial.
                            Because you searched this material, it will get higher priority.
                        </div>
                    </template>
                        <information-outline-icon
                            class="under-construction-icon"
                            v-if="material.isUnderStudy"
                            title=""
                            :size="14"
                        />
                </tooltip> -->
        </li>
      </ul>
      <!-- <hr v-if="interactions.length || (materials.length === 1 && !isOneMaterial)" /> -->
    </div>
    <br v-if="materials[0].isUnderStudy && materials.some(c => c.isShowPage) && !interactions.length"/>
    <div v-if="interactions.length" class="interactions-preview-interactions">
      <ul>
        <p class="sub-title">Interacts with:</p>
        <li class="interactions-preview-interactions-interaction" v-for="interaction in interactions" :key="interaction._id">
          <span class="clip-txt">
            <div class="flex-align-center">
              <interaction-icon class="interaction-icon" :color="getInteractionColor(interaction.recommendation)" />
              <p>{{ getInteractionShortName(interaction.name) }}</p>
            </div>
          </span>
        </li>
      </ul>
      <hr v-if="(materials.length === 1 && !isOneMaterial) || materials[0].isUnderStudy" />
    </div>
    <div v-if="materials[0].isUnderStudy" class="text-center under-construction">
      This material is still under construction. The results you may see are only partial.<br />FYI:<br />
      We will give higher priority to this material since you searched for it.
      <hr v-if="materials.length === 1 && !isOneMaterial" />
    </div>
    <div v-if="materials.length === 1 && !isOneMaterial" class="interactions-preview-actions">
      <!-- <router-link :to="`/search?q=${userQuery}`" target="_blank"> All interactions of this {{ materials[0].type }} </router-link> -->
      <router-link class="inline big-txt" :to="`/search?q=${userQuery}`" target="_blank"> All interactions of {{ materials[0].name }} </router-link>
    </div>
  </section>
</template>

<script>
import { interactionUIService } from '@/cms/services/interaction-ui.service';

// import Tooltip from '@/client/cmps/common/Tooltip';

import AlertCircleOutlineIcon from 'vue-material-design-icons/AlertCircleOutline';
import InteractionIcon from '@/client/cmps/common/icons/InteractionIcon';
// import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline';

export default {
  props: {
    materials: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    userQuery: {
      type: String,
      required: true
    },
    interactions: {
      type: Array,
      default: () => []
    },
    isOneMaterial: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    previewHeader() {
      if (this.materials.length === 1) {
        return this.materials[0].type;
      }
      return '';
    }
  },
  methods: {
    getInteractionColor(recommendation) {
      return interactionUIService.getInteractionColor(recommendation);
    },
    getInteractionShortName(name) {
      const sideNames = name.split(' & ');
      const [materialName] = this.$store.getters.materialRealName(this.userQuery);
      let side2Name = sideNames.find(sideName => sideName !== this.userQuery && sideName !== materialName);
      if (this.$store.getters.materialNamesMap[side2Name] && !this.$store.getters.materialNamesMap[side2Name].includes(side2Name)) {
        side2Name = this.$store.getters.materialNamesMap[side2Name][0];
      }
      return side2Name;
    },
    getCompoundName(materialName, query) {
      const queries = this.$store.getters.materialNamesMap[materialName];
      return queries.filter(q => q !== query)[0];
    },
    getTypeImgName(type) {
      switch (type) {
        case 'drug':
          return 'drug';
        case 'herb':
        case 'essential oil':
          return 'herb';
        case 'vitamin':
        case 'mineral':
        case 'amino acid':
        case 'nutraceutical':
          return 'other';
        case 'food':
          return 'food';
        default:
          return 'other'
      }
    }
  },
  components: {
    AlertCircleOutlineIcon,
    InteractionIcon
    // InformationOutlineIcon,
    // Tooltip
  }
};
</script>
