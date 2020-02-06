<template>
  <b-card bg-variant="dark">
    <div v-if="loading" class="text-center"><b-spinner></b-spinner></div>
    <div v-else>
      <div class="h2 mt-2">
        <a :href="battleLink" class="text-light">{{ battle.title }}</a>
      </div>
      <div class="h5 mt-2">
        <b-icon-clock-fill></b-icon-clock-fill>
        {{ battle.term }} Stunden
      </div>
      <div class="rounds">
        <div v-for="round in battle.rounds" v-bind:key="round.index">
          <round-preview-box :round="round"></round-preview-box>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import RoundPreviewBox from "./roundPreviewBox.vue";
import vg from "./../core/rbaVG";

export default {
  components: {
    RoundPreviewBox
  },

  data() {
    return {
      loading: true,
      battleLink: this.$root.$data.battleLink,
      battle: {}
    };
  },

  async created() {
    let _battle = vg.battle.create(this.$root.$data.battleLink);
    await _battle.fetch();
    this.battle = _battle;
    this.loading = false;
  }
};
</script>

<style scoped src="./../bootstrapCustom.scss">
</style>

<style scoped>
.displayNone {
  display: none;
}
</style>