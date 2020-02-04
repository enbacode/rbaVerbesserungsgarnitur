<template>
  <div class="waveform" :id="id" v-if="backend == 'WebAudio'"></div>
  <div
    class="waveform"
    :id="id"
    v-else
  >Sorry, das anzeigen von Audio funktioniert in deinem Browser noch nicht. Hören kannst du aber trotzdem.</div>
</template>

<script>
import WaveSurfer from "wavesurfer.js";

export default {
  data() {
    return {
      id:
        "a" +
        Math.random()
          .toString(36)
          .substring(7),
      playing: false,
      wavesurfer: {},
      backend: "WebAudio"
    };
  },

  methods: {
    toggle() {
      this.playing = !this.playing;
      this.wavesurfer.playPause();
    }
  },

  props: ["src"],

  mounted() {
    //test for firefox
    if (typeof InstallTrigger !== "undefined") {
      this.backend = "MediaElement";
    }

    this.wavesurfer = WaveSurfer.create({
      container: "#" + this.id,
      waveColor: "#fff",
      progressColor: "black",
      hideScrollbar: true,
      height: 60,
      barWidth: 3,
      barRadius: 3,
      backend: this.backend
    });
    this.wavesurfer.load(this.src);
  }
};
</script>

<style>
</style>