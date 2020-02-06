<template>
  <tr>
    <td colspan="1">
      <b-button variant="dark" @click="toggle()" class="ml-3">
        <span class="h4">
          <b-icon-pause-fill v-if="playing"></b-icon-pause-fill>
          <b-icon-play-fill v-else></b-icon-play-fill>
        </span>
      </b-button>
    </td>
    <td colspan="3" class="padRight">
      <audio-player ref="player" :src="link" @finish="playing = false"></audio-player>
    </td>
  </tr>
</template>

<script>
import AudioPlayer from "./../../components/AudioPlayer.vue";

export default {
  components: {
    AudioPlayer
  },

  data() {
    return {
      link: this.$root.$data.link,
      playing: false
    };
  },

  methods: {
    toggle() {
      this.playing = !this.playing;
      this.$refs.player.toggle();
    }
  },
  created() {
    console.debug('rbaBattlePlayer: App created for ', this.link)
  }
};
</script>

<style scoped src="./../../bootstrapCustom.scss"></style>

<style scoped>
.padRight {
  padding-right: 50px;
}
</style>