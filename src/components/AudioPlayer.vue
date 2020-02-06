<template>
  <div>
    <div class="waveform" :id="id"></div>
  </div>
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
      loading: true,
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
    this.wavesurfer.on('loading', progress => this.$emit('loadingProgressChanged', progress))
    this.wavesurfer.on('ready', () => this.$emit('ready'))
    this.wavesurfer.load(this.src);
  }
};
</script>

<style>
</style>