<template>
  <div class="waveform" :id="id"></div>
</template>

<script>
import WaveSurfer from 'wavesurfer.js'

export default {

    data() {
        return {
            id: 'a'+Math.random().toString(36).substring(7),
			playing: false,
			wavesurfer: {},
        }
    },
    
    methods: {
		toggle() {
			this.playing = !this.playing
			this.wavesurfer.playPause()
		}
    },

    props: ['src'],
    
    mounted() {
		this.wavesurfer = WaveSurfer.create({
			container: '#'+this.id,
			waveColor: '#fff',
			progressColor: 'black',
			hideScrollbar: true,
			height: 60,
			barWidth: 3,
			barRadius: 3,
			
		})
		this.wavesurfer.load(this.src)
	}

}
</script>

<style>

</style>