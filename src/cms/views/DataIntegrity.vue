<template>
  <div class="container">
    <section class="data-integrity">
      <v-card>
        <header class="data-integrity-header">
          <v-card-title class="text-capitalize"
            >Data integrity check</v-card-title
          >
          <div class="data-integrity-header-controls">
            <v-select
              class="data-integrity-header-controls-select"
              :items="$options.checkTypes"
              v-model="checkType"
              clearable
              label="Check type"
            ></v-select>
            <autocomplete 
                @emitAutocomplete="saveMaterialId"
                :isDisabled="checkType !== 'material-ref-dups' && checkType !== 'v-interaction-dups'"
                placeholder="Select material"
            />
            <v-btn
              class="data-integrity-header-controls-btn"
              elevation="0"
              depressed
              outlined
              :disabled="
                !checkType || isLoading || (checkType === 'material-ref-dups' && !this.materialId)
                || (checkType === 'v-interaction-dups' && !this.materialId)
              "
              @click="getResults"
              color="primary"
            >
              <v-icon small class="mr-2">mdi-skull-scan-outline</v-icon>
              Run check
            </v-btn>
          </div>
        </header>
        <v-divider />
        <loading-cmp class="data-integrity-loader" v-if="isLoading" />
        <v-simple-table v-else-if="!isLoading && alerts.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th>{{ isShowType ? 'Type' : 'Entity' }}</th>
                <th>Alerts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(alert, idx) in alerts" :key="idx">
                <td>
                  {{ entityName(alert.entity) | display-snake-case }}
                </td>
                <td>
                  <v-expansion-panels class="data-integrity-expand-panel p-0">
                    <v-expansion-panel>
                      <v-expansion-panel-header class="pa-0 warning--text">
                        <span class="data-integrity-expand-panel-msg">
                          {{ alert.msgs.length }} errors detected
                        </span>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="pa-0">
                        <v-list dense>
                          <v-list-item
                            v-for="(msg, idx) in alert.msgs"
                            :key="idx"
                          >
                            <v-list-item-icon>
                              <v-icon small color="warning" class="mr-2">
                                mdi-alert
                              </v-icon>
                              <v-list-item-content>
                                <v-list-item-title
                                  v-html="msg"
                                ></v-list-item-title>
                              </v-list-item-content>
                            </v-list-item-icon>
                          </v-list-item>
                        </v-list>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </td>
                <td>
                  <v-btn
                    class="mr-2"
                    v-if="isShowType"
                    elevation="0"
                    small
                    outlined
                    color="success"
                    title="Set as fixed"
                    @click="setAsDone(alert.entity)"
                  >
                    <v-icon small>mdi-check</v-icon>
                  </v-btn>
                  <v-btn
                    :to="editEntityLink(alert.entity)"
                    elevation="0"
                    small
                    outlined
                    color="primary"
                    title="Go to edit"
                  >
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div
          v-else-if="!isLoading && !alerts.length && !isInitial"
          class="data-integrity-empty"
        >
          <p class="subtitle-2 mb-0">
            There is no dishonest data in this case :)
          </p>
        </div>
        <div
          v-else-if="!isLoading && !alerts.length && isInitial"
          class="data-integrity-initial"
        >
          <p class="subtitle-1 mb-0">Available check types:</p>
          <v-list>
            <v-list-item
              v-for="(type, idx) in $options.checkTypes"
              :key="idx"
            >
              <v-list-item-icon>
                <v-icon x-small class="mr-2">mdi-scan-helper</v-icon>
                <v-list-item-content>
                  <v-list-item-title :class="{ 'red--text': hasFailedTasks && !idx || hasFailedLogs && idx === 1 }" v-text="type.text" />
                </v-list-item-content>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </div>
      </v-card>
      <icons-map />
    </section>
  </div>
</template>

<script>
import LoadingCmp from '@/cms/cmps/general/LoadingCmp';
import autocomplete from '@/cms/cmps/Autocomplete';
import iconsMap from '@/cms/cmps/general/IconsMap';
import { dataIntegrityService } from '@/cms/services/data-integrity.service';
import { logService } from '@/cms/services/log.service';

export default {
  checkTypes: [
    { text: 'Failed worker tasks', value: 'get-failed-tasks' },
    { text: 'Payment errors', value: 'payment-errors' },
    { text: 'Duplicate references (all materials)', value: 'ref-dups' },
    { text: 'Duplicate references (single material)', value: 'material-ref-dups' },
    { text: 'Bad reference (interaction)', value: 'ref-broken' },
    { text: 'Duplicate v-interaction (single side1 material)', value: 'v-interaction-dups' },
    { text: 'Bad text field (interactions)', value: 'bad-txt-field' },
    { text: 'Unformated refs - outside <sub>(...)</sub> (interactions)', value: 'unformated-refs' },
    { text: 'Broken \'monitor.general\' (interactions)', value: 'broken-monitor' },
    { text: 'Trailing/leading spaces in pathway names', value: 'bad-pathway-names' },
    { text: 'Interactions without LOE', value: 'z-loe-names' },
  ],
  data() {
    return {
      isLoading: false,
      alerts: [],
      checkType: '',
      isInitial: true,
      materialId: ''
    };
  },
  computed: {
    selectedMaterialId() {
      if (this.checkType !== 'material-ref-dups' && this.checkType !== 'v-interaction-dups') return '';
      return this.materialId;
    },
    isShowType() {
      return this.checkType === 'get-failed-tasks' || this.checkType === 'payment-errors';
    },
    hasFailedTasks() {
      return this.$store.getters.hasFailedTasks;
    },
    hasFailedLogs() {
      return this.$store.getters.hasFailedLogs;
    }
  },
  methods: {
    saveMaterialId(material) {
      this.materialId = (material) ? material._id : '';
    },
    entityName(entity) {
      if (entity.name) return entity.name;
      if (entity.type) return entity.type
      if (entity.action) return entity.action
      if (entity.errors) return `${entity.type} (${entity.data.name})`;
      if (entity.side2Label) return entity.side2Label.name;
      if (entity.side2Material) return `${entity.side1Material.name} & ${entity.side2Material.name}`;
      return `${entity.side1Material.name} & ${entity.side2DraftName}`;
    },
    async setAsDone(entity) {
      if(entity.action){
        entity.resolved = true
        await logService.update(entity)
        await this.getResults();
        if (!this.alerts.length) this.$store.commit({
          type: 'setHasFailedLogs',
          hasTasks: false
      });
      }else{
        entity.succeeded = true;
        await dataIntegrityService.updateTask(entity);
        await this.getResults();
        if (!this.alerts.length) this.$store.commit({
            type: 'setHasFailedTasks',
            hasTasks: false
        });
      }
    },
    editEntityLink(entity) {
      if(entity.action) return `/user/edit/${entity.userId}`

      let entityName = '';
      let entityId = entity._id;
      if (entity.type) return ''
      if (entity.name) entityName = 'material';
      else if (entity.errors) {
        entityName = 'user';
        entityId = entity.data._id;
      } else entityName = 'interaction';

      return `/${entityName}/edit/${entityId}`;
    },
    async getResults() {
      this.isLoading = true;
      if (!this.selectedMaterialId) {
        const criteria = {
          type: this.checkType,
        };
        const alerts = await dataIntegrityService.list(criteria);
        this.alerts = alerts;
      } else {
        if (this.checkType === 'v-interaction-dups') {
          const criteria = { type: this.checkType, side1Id: this.selectedMaterialId };
          const alerts = await dataIntegrityService.list(criteria);
          this.alerts = alerts;
        } else {
          const materialAlerts = await dataIntegrityService.getById(this.selectedMaterialId);
          this.alerts = materialAlerts;
        }
      }
      this.isLoading = false;
      if (this.isInitial) this.isInitial = false;
    },
    getFailedTasks() {
        this.hasFailedTasks = true;
    }
  },
  components: {
    LoadingCmp,
    autocomplete,
    iconsMap
  },
};
</script>