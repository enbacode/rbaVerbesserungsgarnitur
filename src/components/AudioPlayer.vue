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
      backend: "WebAudio",
    };
  },

  methods: {
    toggle() {
      this.playing = !this.playing;
      this.wavesurfer.playPause();
    },
    load() {
      this.state = 'loading'
      this.wavesurfer.load(this.src);
    }
  },

  props: {
    src: {
      type: String,
      default: ''
    },
    volume: {
      type: Number,
      default: 70
    }
  },

  watch: {
    volume(oldVal, newVal) {
      this.wavesurfer.setVolume(Math.pow(oldVal, 2) / 10000)
      this.$emit('volumeChanged', oldVal)
    }
  },

  mounted() {
    this.wavesurfer = WaveSurfer.create({
      container: "#" + this.id,
      waveColor: "#fff",
      progressColor: "black",
      hideScrollbar: true,
      height: 60,
      barWidth: 3,
      barRadius: 3,
      backend: this.backend,
      playing: false,
      state: 'initialized',
    });
    this.wavesurfer.setVolume(Math.pow(this.volume, 2) / 10000)
    this.wavesurfer.on('finish', () => this.$emit('finish'))
    this.wavesurfer.on('ready', () => {
      this.state = 'ready'
      this.$emit('ready')
    })
    
  }
};
</script>

<style>
</style>