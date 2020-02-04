<template>
<div class="p-3">
<h1>RBAVG</h1>
<b-button id="activate" class="mt-2" @click="toggleActive()" :disabled="loading" variant="outline-primary" block size="lg" :pressed="active">
    <big v-if="active">Aktiv</big>
    <big v-else>Inaktiv</big>
</b-button>
  <b-button class="mt-1" block variant="link" @click="openSettings()">Einstellungen</b-button>
</div>
</template>

<script>
import browser from 'webextension-polyfill'
//import './../bootstrapCustom.scss'
// import 'bootstrap/scss/bootstrap.scss'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
    
    data() {
        return {
            active: false,
            loading: true
        }
    },

    methods: {
        async toggleActive() {
            this.loading = true
            await browser.storage.local.set({ 'active': !this.active })
            this.loading = false
            this.active = !this.active
        },
        openSettings() {
            browser.runtime.openOptionsPage()
        }
    },

    async mounted() {
        const storedActive = await browser.storage.local.get('active')
        this.active = storedActive.active
        this.loading = false
    }

}
</script>

<style scoped>
#activate {
    min-height: 80px;
}
</style>