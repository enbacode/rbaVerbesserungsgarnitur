<template>
  <tr>
    <td colspan="1">
      <b-button variant="dark" @click="toggle()" class="ml-3" :disabled="loading">
        <span class="h4">
          <b-icon-pause-fill v-if="playing"></b-icon-pause-fill>
          <b-spinner v-else-if="loading" />
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
      playing: false,
      loading: false,
      playerReady: false
    };
  },

  methods: {
    load() {
      this.loading = true;
      this.$refs.player.load()
    },
    toggle() {
      if(!this.playerReady) {
        this.load()
        return
      }
      this.playing = !this.playing;
      this.$refs.player.toggle();
    }
  },

  created() {
    console.debug('rbaBattlePlayer: App created for ', this.link)
  },

  mounted() {
    this.$refs.player.$on('ready', () => { this.loading = false; this.playerReady = true; this.toggle(); })
  }

};
</script>

<style scoped src="./../../bootstrapCustom.scss"></style>

<style scoped>
.padRight {
  padding-right: 50px;
}
</style>