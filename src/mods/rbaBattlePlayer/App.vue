<template>
<tr>
  <td colspan="4">
  <RoundPreviewBox mini :round="round" :default-volume="options.defaultVolume" :playlist-container-id="playlistContainerId" :index="index" class="rba-player" />
  </td>
</tr>
</template>

<script>
import AudioPlayer from "./../../components/AudioPlayer.vue";
import RoundPreviewBox from "./../../components/roundPreviewBox.vue";
import Battle from '../../core/rba/battle';
import Round from '../../core/rba/round';


export default {
  components: {
    AudioPlayer,
    RoundPreviewBox
  },

  data() {
    return {
      link: this.$root.$data.link,
      round: new Round(this.$root.$data.link),
      options: this.$root.$data.options,
      index: this.$root.$data.index,
      playlistContainerId: this.$root.$data.playlistContainerId
    };
  },

  created() {
    console.debug('rbaBattlePlayer: App created for ', this.link)
    if(this.$root.$data.src)
      this.round.parse(this.$root.$data.src)
    else
      this.round.fetch()
  },

};
</script>

<style scoped src="./../../bootstrapCustom.scss"></style>

<style>
.rba-player.card {
  margin-bottom: 3rem!important;
}

.rba-player .volume-slider {
  width: 70%;
  position: relative;
  top: -0.25rem;
}

.rba-player .volume-icon {
  position: relative;
  top: -0.65rem;
}

.rba-player .card-body {
  padding: 0 10px;
}

.rba-player .card-footer {
    padding: 5px 10px 3px !important;
}
.rba-player .media-body {
  top: 7px;
}
</style>