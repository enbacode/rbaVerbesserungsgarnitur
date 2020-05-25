<template>
  <b-card class="my-2" :header="roundObj.name" bg-variant="secondary" text-variant="white">
    <b-media no-body>
      <b-media-aside vertical-align="center">
        <b-button variant="primary" size="lg" @click="toggle()" :disabled="this.loading">
          <span class="h1">
            <b-icon-pause-fill v-if="playing"></b-icon-pause-fill>
            <b-icon-play-fill v-else></b-icon-play-fill>
          </span>
        </b-button>
      </b-media-aside>

      <b-media-body class="ml-3">
        <p class="mb-0">
          <audio-player :src="roundObj.mp3" ref="player" :volume="Number(volume)"></audio-player>
          <div class="loadingSpinner" v-show="this.loading">
            <div class="text-center">
              <b-spinner></b-spinner>
            </div>
          </div>
        </p>
      </b-media-body>
    </b-media>
    <template v-slot:footer>
      <b-form-row>
        <b-col sm="2">
          <big>
            <b-icon-volume-up-fill></b-icon-volume-up-fill>
          </big>
          <b-input type="range" v-model="volume" :min="0" :max="100" class="volume-slider"></b-input>
        </b-col>
        <b-col sm="1">
          <big>
            <b-icon-person-fill></b-icon-person-fill>
          </big>
          {{ roundObj.mc }}
        </b-col>
        <b-col sm="1">
          <big>
            <b-icon-cloud-download></b-icon-cloud-download>
          </big>
          {{ roundObj.downloads }}
        </b-col>
        <b-col sm="2">
          <big>
            <b-icon-calendar-fill></b-icon-calendar-fill>
          </big>
          {{ roundObj.date.substring(0, 19) }}
        </b-col>
        <b-col>
          <b-button :href="roundObj.mp3" variant="light" size="sm" class="float-right">
            <b-icon-download></b-icon-download>Download
          </b-button>
        </b-col>
      </b-form-row>
    </template>
  </b-card>
</template>

<script>
import AudioPlayer from "./AudioPlayer.vue"
import browser from "webextension-polyfill"

export default {
  components: {
    AudioPlayer
  },

  methods: {
    toggle() {
      if(!this.playerReady) {
        this.load()
        return;
      }
      this.playing = !this.playing
      this.$refs.player.toggle()
    },
    load() {
      this.loading = true
      this.$refs.player.load()
    }
  },

  watch: {
    volume(newVal) {
      browser.storage.local.get('volumes')
      .then(data => {
        const volumes = {
          ...data.volumes,
          [this.roundObj.id]: newVal
        }
        browser.storage.local.set({volumes: volumes})
      })
    }
  },

  data() {
    return {
      loading: false,
      playing: false,
      playerReady: false,
      roundObj: this.round,
      volume: this.defaultVolume.value
    };
  },
  props: ["round", "defaultVolume"],

  mounted() {
    browser.storage.local.get('volumes')
    .then(data => {
      if(data.volumes[this.roundObj.id]) {
        this.volume = data.volumes[this.roundObj.id]
      }
    })
    this.$refs.player.$on('ready', () => { this.loading = false; this.playerReady = true; this.toggle(); })
    this.$refs.player.$on('finish', () => this.playing = false)
  }
};
</script>

<style scoped src="bootstrap/dist/css/bootstrap.css">
</style>

<style scoped src="bootstrap-vue/dist/bootstrap-vue.css">
</style>
<style scoped>
.volume-slider {
  width:89%;
  position: relative;
  top: 4px;
}
.btn-primary {
  background-color: orange !important;

  border-color: orange;
}
.btn-primary:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 165, 0, 0.5);
}
.media-body {
  position: relative;
}
.loadingSpinner {
  position: absolute;
  top: 19px;
  width: 100%;
}
</style>
