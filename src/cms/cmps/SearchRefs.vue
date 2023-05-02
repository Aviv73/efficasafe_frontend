<template>
  <div class="search-refs-container">
    <v-btn color="primary" @click="show = true">Search Refs</v-btn>
    <div v-if="show" @click="show = false" class="blur"></div>
    <section v-if="show" class="search-refs-section flex column gap15">
      <h3>Search Refs</h3>
      <form @submit.prevent="loadRefs" class="flex column gap15 align-start">
        <label class="flex gap5">
          <span class="flex flex-1">Search</span>
          <input v-model="criteria.search" placeholder="search"/>
        </label>
        <label class="flex gap5">
          <span class="flex flex-1">PUBID</span>
          <input v-model="criteria.pmId" placeholder="PUBID"/>
        </label>
        <v-btn color="primary" type="submit" class="">Search</v-btn>
      </form>
      <ul class="refs flex column gap10" v-if="refs.length">
        <li class="ref flex column gap5" v-for="ref in refs" :key="ref._id">
          <h4>{{ref.pubmedId || `draftIdx: ${ref.draftIdx}`}}</h4>
          <p>{{ref.txt}}</p>
          <div class="material" v-for="material in ref.materails" :key="material._id">
            <p>
              <router-link :to="`material/${material._id}`">
                {{material.name}} ({{material.refNum}})
              </router-link>
              <template v-if="material.interactsWith.length"> | </template>
              <small>
                <router-link 
                  v-for="(int, idx) in material.interactsWith" :key="int._id"
                  :to="`interaction/${int.intId}`"
                >
                  <!-- :to="int.type === 'material' ? `material/${int._id}` : `label/${int._id}`" -->
                  {{int.name}}<template v-if="idx !== material.interactsWith.length-1">,</template>
                </router-link>
              </small>
            </p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "SearchRefs",
  data() {
    return {
      refs: [],
      criteria: {
        search: '',
        pmId: ''
        // pmId: '24648302'
      },
      show: false
    }
  },
  methods: {
    async loadRefs() {
      const refs = await this.$store.dispatch({ type: 'loadRefs', criteria: this.criteria });
      console.log('GOT IT', refs);
      this.refs = JSON.parse(JSON.stringify(refs));
    }
  },
  // created() {
  //   this.loadRefs();
  // }
}
</script>

<style lang="scss">
.blur {
  background-color:rgba(0, 0, 0, 0.1);
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.search-refs-section {
  position: fixed;
  // top: 50%;
  top: 15%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 100;

  font-size: 1rem;
  font-weight: unset;

  background: white;

  padding: 20px;
  width: 500px;
  border-radius: 7px;
  // border: 1px solid rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.1);
  h3 {
    font-weight: bold;
  }
  label {
    span {
      width: 75px;
    }
    input {
      border: 1px solid rgba(0, 0, 0, 0.5);
      border-radius: 3px;
      width: 200px;
      padding-inline-start: 5px;
    }
  }

  ul {
    margin: 0;
    padding: 0;
  }

  .refs {
    max-height: 500px;
    overflow-y: auto;
    .ref {
      &:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      }
      
      .material {
        &:not(:last-child) {
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }
        margin-inline-start: 10px;
      }
    }
  }

}
</style>