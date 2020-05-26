<template>
    <b-card class="my-2" bg-variant="secondary" text-variant="white">
        <template v-slot:header v-if="!mini">{{round.name}}</template>
        <b-media no-body>
            <b-media-aside vertical-align="center">
                <b-button variant="primary" size="lg" @click="toggle()" :disabled="this.loading">
                    <span class="h2">
                        <b-icon-pause-fill v-if="playing"></b-icon-pause-fill>
                        <b-icon-play-fill v-else></b-icon-play-fill>
                    </span>
                </b-button>
            </b-media-aside>

            <b-media-body class="ml-3">
                <p class="mb-0">
                    <audio-player :src="round.url" ref="player" :volume="Number(volume)"></audio-player>
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
                <b-col :sm="mini ? 4 : 2">
                    <big class="volume-icon">
                        <b-icon-volume-up-fill></b-icon-volume-up-fill>
                    </big>
                    <b-input
                        type="range"
                        v-model="volume"
                        :min="0"
                        :max="100"
                        class="volume-slider"
                    ></b-input>
                </b-col>
                <b-col :sm="mini ? 3 : 1">
                    <big>
                        <b-icon-person-fill></b-icon-person-fill>
                    </big>
                    {{ round.mc }}
                </b-col>
                <b-col :sm="mini ? 3 : 1">
                    <big>
                        <b-icon-cloud-download></b-icon-cloud-download>
                    </big>
                    {{ round.downloads }}
                </b-col>
                <b-col v-if="!mini" sm="2">
                    <big>
                        <b-icon-calendar-fill></b-icon-calendar-fill>
                    </big>
                    {{ round.date.substring(0, 19) }}
                </b-col>
                <b-col v-if="!mini">
                    <b-button :href="round.url" variant="light" size="sm" class="float-right">
                        <b-icon-download></b-icon-download>Download
                    </b-button>
                </b-col>
            </b-form-row>
        </template>
    </b-card>
</template>

<script>
import AudioPlayer from "./AudioPlayer.vue";
import browser from "webextension-polyfill";
import vg from "../core/rbaVG";

export default {
    components: {
        AudioPlayer
    },

    methods: {
        toggle() {
            if (!this.playerReady) {
                this.load();
                return;
            }
            this.playing = !this.playing;
            this.$refs.player.toggle();
        },
        play() {
            if (!this.playerReady) {
                this.load();
                return;
            }
            this.playing = true;
            this.$refs.player.play();
        },
        pause() {
            this.playing = false;
            this.$refs.player.pause();
        },

        load() {
            this.loading = true;
            this.$refs.player.load();
        }
    },

    watch: {
        volume(newVal) {
            browser.storage.local.get("volumes").then(data => {
                const volumes = {
                    ...data.volumes,
                    [this.round.id]: newVal
                };
                browser.storage.local.set({ volumes: volumes });
            });
        }
    },

    data() {
        return {
            loading: false,
            playing: false,
            playerReady: false,
            volume: this.defaultVolume.value
        };
    },
    props: {
        id: {
            type: String,
            default: () =>
                "preview-" +
                Math.random()
                    .toString(36)
                    .substring(7)
        },
        round: {
            type: Object,
            default: {}
        },
        defaultVolume: {
            type: Object,
            default: {}
        },
        mini: {
            type: Boolean,
            default: false
        },
        playlistContainerId: {
            type: String,
            default: 
                Math.random()
                    .toString(36)
                    .substring(7)
        },
        index: {
            type: Number,
            default: 0
        }
    },
    mounted() {
        browser.storage.local.get("volumes").then(data => {
            if (data.volumes && data.volumes[this.round.id]) {
                this.volume = data.volumes[this.round.id];
            }
        });
        this.$refs.player.$on("ready", () => {
            this.loading = false;
            this.playerReady = true;
            this.play();
        });
        this.$refs.player.$on("finish", () => {
            this.playing = false;
            vg.eventBus.$emit("finish", {
                id: this.id,
                index: this.index,
                playlistContainerId: this.playlistContainerId,
                round: this.round
            });
        });
        this.$refs.player.$on("play", () => {
            vg.eventBus.$emit("play", {
                id: this.id,
                round: this.round
            });
        });
        vg.eventBus.$on("play", ({ id }) => {
            if (this.id != id) this.pause();
        });
        vg.eventBus.$on("finish", ({ index, playlistContainerId }) => {
            if (playlistContainerId == this.playlistContainerId && this.index == index + 1 && this.$root.$data.options.autoPlay.value) {
              this.play();
            }
        });
    }
};
</script>

<style scoped src="bootstrap/dist/css/bootstrap.css">
</style>

<style scoped src="bootstrap-vue/dist/bootstrap-vue.css">
</style>
<style scoped>
.volume-slider {
    width: 70%;
    position: relative;
    top: 0.25rem;
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
