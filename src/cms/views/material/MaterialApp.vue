<template>
  <section class="material-app">
    <div class="container">
      <v-card class="mb-10" v-if="materials">
        <v-card-title>
          Materials collection
          <v-spacer></v-spacer>
          <v-btn class="mr-8" color="success" @click="onAddMultiRefs" v-if="isAdmin">
            <v-icon small left>mdi-content-copy</v-icon>Add refs to multi materials
          </v-btn>
          <v-btn color="primary" to="/material/edit/">new material</v-btn>
        </v-card-title>

        <material-filter
          :materials="materials"
          @emit-filter="setFilter"
        />
        <material-list
          :materials="materials"
          :loading="loading"
          :totalItems="totalItems"
          @options-updated="setFilter"
          @header-clicked="setFilter"
          @delete-many-materials="removeMany"
          @updateMaterial="updateMaterial"
        />
      </v-card>

      <icons-map />
    </div>
    <modal-wrap
        :isActive="isAddMultiRefsModal"
        @close-modal="isAddMultiRefsModal = false"
        >
        <v-card class="multiple-modal-container">
           <v-card-title class="primary headline" style="color:white; font-weight:bold;">Add refs to multiple materials</v-card-title>
           <autocomplete style="width: 60%; margin: 0 auto" @emitAutocomplete="addMaterial" allow-term-search/>
           <v-select style="width: 60%; margin: 0 auto" :items="groupNames" label="Groups" @change="handleSelectGroup"></v-select>
           <template v-if="!isLoadingAddMultiRefs">
              <section class="multiple-material-list" style="height: 200px">
                <p class="count">{{materialsToAddRefs.length}}</p>
                <div class="multiple-material" v-for="(material, idx) in materialsToAddRefs" :key="idx">
                  <p>{{material.text}}</p><button @click="removeMaterialToAddRefs(idx)">X</button>
                </div>
              </section>
              <v-file-input
                title="Upload excel file"
                class="reference-table-file-btn"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                clearable
                hide-details
                show-size
                dense
                single-line
                placeholder="Upload refs"
                @change="handleRefsUpload"
              />
              <section class="btns-container">
                <v-btn @click="addRefsToMaterials" class="success">Add refs to materials</v-btn>
                <v-btn @click="removeRefsToMaterials" class="error">Remove refs to materials</v-btn>
              </section>
           </template>
           <loader v-else/>
        </v-card>
    </modal-wrap>
    <v-alert 
        class="cms-alert" 
        v-if="response.msg"
        :type="response.type"
        dismissible
        style="z-index: 1001;"
    >
        {{response.msg}}
    </v-alert>
  </section>
</template>

<script>
import readXlsxFile from 'read-excel-file';
import { materialService } from '@/cms/services/material.service';

import materialFilter from '@/cms/cmps/material/MaterialFilter';
import materialList from '@/cms/cmps/material/MaterialList';
import ModalWrap from '@/client/cmps/common/ModalWrap';
import autocomplete from '@/cms/cmps/Autocomplete';
import loader from '@/cms/cmps/general/LoadingCmp';
import iconsMap from '@/cms/cmps/general/IconsMap';

export default {
  data() {
    return {
      loading: false,
      response: {
        msg: null,
        type: null
      },
      isAddMultiRefsModal: false,
      materialsToAddRefs: [],
      refsToAdd: [],
      materialsWithRefs:[],
      isLoadingAddMultiRefs: false,

      groupNames: materialService.getMaterialGroupNames()
    };
  },
  watch: {
    '$route.query': {
      handler() {
        this.loadMaterials();
      },
      immediate: true
    },
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    isAdmin() {
      return this.loggedInUser && (this.loggedInUser.role === 'admin');
    },
    materials() {
      return this.$store.getters.materials;
    },
    totalItems() {
      return this.$store.getters.materialCount;
    },
    routeQuery() {
      return '?' + new URLSearchParams(this.$route.query).toString();
    }
  },
  methods: {
    async handleSelectGroup(groupName){
      const miniMaterials = await materialService.getMatsFromGroupSelection(groupName);
      miniMaterials.forEach( m => this.addMaterial(m))
    },
    setFilter(filterBy) {
      const criteria = {
        ...this.$route.query,
        ...filterBy
      }
      const queryStr = '?' + new URLSearchParams(criteria).toString();
     
      this.$router.push(queryStr);
    },
    async loadMaterials() {
      const criteria = this.$route.query;
      this.loading = true;

      criteria.sortBy = criteria.sortBy || [ 'type', 'name' ];
      criteria.isDesc = criteria.isDesc || [ true, false ];
      criteria.limit = criteria.limit || 15;

      if (criteria.q) criteria.page = 0;

      await this.$store.dispatch({ type: 'loadMaterials', criteria });
      this.loading = false;
    },
    async removeMany(ids) {
      await this.$store.dispatch({ type: 'removeMaterials', ids });
    },
    async updateMaterial(material){
      try{
        await this.$store.dispatch({ type: 'saveMaterial', material })
        this.response.type = 'success'
        this.response.msg = `${material.name} was updated`
      }catch(err){
        this.response.type = 'error'
        this.response.msg = `SOMETHING WENT WRONG`
      }
      setTimeout(() => {
        this.response.type = null
        this.response.msg = null
      },1500)
    },
    onAddMultiRefs(){
      this.isAddMultiRefsModal = true
    },
    addMaterial(miniMat){
      if(miniMat){
        const idx = this.materialsToAddRefs.findIndex(m => m._id === miniMat._id)
        if(idx < 0) this.materialsToAddRefs.unshift(miniMat)
      }
    },
    removeMaterialToAddRefs(idx){
      this.materialsToAddRefs.splice(idx, 1)
    },
    async removeRefsToMaterials(){
      if(!this.materialsToAddRefs.length){
        this.response.type = 'error'
        this.response.msg = `No materials were added`
        setTimeout(() => {
          this.response.type = null
          this.response.msg = null
        },3000)
        return
      }
      this.isLoadingAddMultiRefs = true
      for (let i = 0; i < this.materialsToAddRefs.length; i++) {
        const miniMat = this.materialsToAddRefs[i];
        const material = await materialService.getById(miniMat._id)
        material.refs = []
        await materialService.save(material)
      }
      this.isLoadingAddMultiRefs = false
      this.response.type = 'success'
      this.response.msg = `All refs were deleted!`
      setTimeout(() => {
        this.response.type = null
        this.response.msg = null
      },3000)
    },
    async addRefsToMaterials(){
      if(!this.materialsToAddRefs.length){
        this.response.type = 'error'
        this.response.msg = `No materials were added`
        setTimeout(() => {
          this.response.type = null
          this.response.msg = null
        },3000)
        return
      }
      if(!this.refsToAdd.length){
        this.response.type = 'error'
        this.response.msg = `No ref file was uploaded`
        setTimeout(() => {
          this.response.type = null
          this.response.msg = null
        },3000)
        return
      }
      this.isLoadingAddMultiRefs = true
      for (let i = 0; i < this.materialsToAddRefs.length; i++) {
        const miniMat = this.materialsToAddRefs[i];
        const material = await materialService.getById(miniMat._id)
        // if(material.refs.length){
        //   this.materialsWithRefs.push(miniMat.text)
        //   continue
        // }  
        // material.refs.push(...JSON.parse(JSON.stringify(this.refsToAdd))); // to add and keep old ones;
        material.refs = JSON.parse(JSON.stringify(this.refsToAdd)) // to rewright all refs by new ones;
        await materialService.save(material)
      }
      this.isLoadingAddMultiRefs = false
      if(this.materialsWithRefs.length){
        const materialsStrs = this.materialsWithRefs.join(', ')
        this.response.type = 'warning'
        this.response.msg = `The materials: ${materialsStrs} already have refs, check it manually`
      }else{
        this.response.type = 'success'
        this.response.msg = `All the materials were updated!`
        setTimeout(() => {
          this.response.type = null
          this.response.msg = null
        },3000)
      }

      this.isAddMultiRefsModal = false
      this.materialsToAddRefs = []
      this.refsToAdd = []
      this.materialsWithRefs =[]
    },
    async handleRefsUpload(file) {
      const rows = await readXlsxFile(file);
      const refs = rows.reduce((acc, row, idx) => {
          if (idx === 0) return acc;
          let txt = row[3];
          let link = '';
          let pubmedId = '';
          let linkIdx = txt.indexOf('http://');
          if (linkIdx === -1) linkIdx = txt.indexOf('https://');
          if (linkIdx !== -1) {
              link = txt.substring(linkIdx, txt.length);
              txt = txt.substring(0, linkIdx);
          }
          if (link) {
              const pubmedIdx = link.indexOf('pubmed');
              if (pubmedIdx !== -1) {
                  const regex = /([\d])/g;
                  pubmedId = link.match(regex) ? link.match(regex).join('') : 0;
              }
          }

          const ref = {
              draftIdx: idx,
              type: row[1] || '',
              txt,
              link,
              pubmedId: +pubmedId
          };

          acc.push(ref);
          return acc;
      }, []);
      this.refsToAdd = refs
    },
  },
  components: {
    materialFilter,
    materialList,
    ModalWrap,
    autocomplete,
    loader,
    iconsMap
  },
};
</script>