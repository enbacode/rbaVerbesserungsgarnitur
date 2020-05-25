<template>
  <b-container class="mt-3">
    <b-row>
      <b-col>
        <b-card title="Mods" class="mb-3">
          <b-card-text>
            <b-form>
              <div v-for="(modCategory, k) in mods.groupBy('target')" v-bind:key="k">
                <h5>{{ targets[k] }}</h5>
                <div v-for="mod in modCategory" v-bind:key="mod.name">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="mod.active"
                      @change="modsSaved = false"
                    >{{ mod.description }} <a v-if="mod.options" href="#" @click="$event.preventDefault()" class="text-muted" v-b-toggle="`modal-mod-options-${mod.name}`"><b-icon-gear-fill /></a></b-form-checkbox>
                    <div class="ml-4">
                      <small v-html="mod.longDescription"></small>
                    </div>
                    <div class="ml-4">
                    </div>
                    <b-collapse :id="`modal-mod-options-${mod.name}`">
                      <b-container fluid>
                        <b-row>
                          <b-col md="8">
                            <b-card class="mt-2">
                              <b-row v-for="(option, name) in mod.options" :key="name">
                                <b-col v-if="typeof option.value ==='boolean'" class="mb-2">
                                  <b-form-checkbox size="sm" v-model="option.value" @change="modsSaved = false">{{ option.title }}</b-form-checkbox>
                                  <div class="ml-4"><small><small v-html="option.description"></small></small></div>
                                </b-col>
                                <b-col v-else class="mb-2">
                                  <b-row>
                                    <b-col cols="8">
                                      <div><small>{{ option.title }}</small></div>
                                      <div><small><small v-html="option.description"></small></small></div>
                                    </b-col>
                                    <b-col cols="4">
                                      <b-form-select v-if="option.choices" v-model="option.value" :options="option.choices" @change="modsSaved = false" size="sm" />
                                      <b-form-input v-else-if="isNaN(option.value)" type="text" v-model="option.value" @change="modsSaved = false" size="sm" />
                                      <b-form-input v-else-if="!isNaN(option.value) && option.range != null" type="range" :min="option.range[0]" :max="option.range[1]" v-model="option.value" @change="this.modsSaved = false; option.value = Number(option.value)" size="sm" />
                                      <b-form-input v-else-if="!isNaN(option.value)" type="number" v-model="option.value" @change="this.modsSaved = false" size="sm" />
                                    </b-col>
                                  </b-row>
                                </b-col>
                              </b-row>
                            </b-card>
                          </b-col>
                        </b-row>
                      </b-container>
                    </b-collapse>
                  </b-form-group>
                </div>
              </div>
              <b-form-group>
                <b-button v-if="!modsSaved" @click="saveMods()" variant="primary">Speichern</b-button>
                <b-button v-if="modsSaved" disabled variant="primary">Gespeichert</b-button>
              </b-form-group>
            </b-form>
          </b-card-text>
        </b-card>
        <b-card title="Entwickleroptionen">
          <b-card-text>
            <b-form-group 
              description="Löscht den kompletten Inhalt des lokalen Storage und initialisiert ihn anschließend neu"
            >
              <b-button variant="danger" v-b-modal="'modal-storage-reinit'">Storage neu initialisieren</b-button>
              <b-modal id="modal-storage-reinit" @ok="reinitializeStorage()">
                <template v-slot:modal-title>
                  Warnung
                </template>
                <p class="my-2">Das reinitialisieren des Storages löscht alle getätigten Einstellungen</p>
              </b-modal>
            </b-form-group>
            <b-form-group v-if="false">
                <b-button v-if="!settingsSaved" @click="saveSettings()" variant="primary">Speichern</b-button>
                <b-button v-if="settingsSaved" disabled variant="primary">Gespeichert</b-button>
            </b-form-group>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  <p class="my-3 text-center text-muted">
    <a class="text-reset" href="https://github.com/enbacode/rbaVerbesserungsgarnitur">v{{manifest.version}}</a>
  </p>
	<b-row class="my-3 d-flex justify-content-center">
		<b-btn v-b-modal="'modal-thanks'" variant="outline-primary"><img :src="this.thankThumb"></img> Bedankt!</b-btn>
    <b-modal id="modal-thanks" cancel-disabled>
      <div>
        <img src="https://media.giphy.com/media/3o6ozm2sJ102JdumVq/giphy.gif"></img>
      </div>
      Danke an:
      <ul>
        <li>Benger, für die alten Icons</li>
        <li><a href="http://www.freepik.com">Freepik</a>, für das Logo</li>
      </ul>
    </b-modal>
	</b-row>
  </b-container>
</template>

<script>
import browser from "webextension-polyfill";
import vg from "./../core/rbaVG";
import thankThumb from '../assets/thankS.png'

export default {
  data() {
    return {
      mods: [],
      modsSaved: false,
      targets: {
        board: "Forum",
        rba: "RBA"
      },
      settings: {},
      thankThumb: thankThumb,
      manifest: vg.manifest 
    };
  },

  methods: {
    async saveMods() {
      await vg.storeMods(this.mods)
      this.mods = this.mods.filter(p => p.enabled && p.showInOptions)
      this.modsSaved = true;
      this.$bvToast.toast(
        "Lade die RBA- bzw. Forenseite neu, um deine Änderungen wirksam zu machen.",
        {
          title: "Änderungen gespeichert",
          variant: "success",
          toaster: "b-toaster-top-center"
        }
      );
    },
    async saveSettings() {
      await vg.setSettings(this.settings)
      this.settingsSaved = true
    },
    async reinitializeStorage() {
      console.log('works')
      await browser.storage.local.remove("mods")
      await browser.storage.local.remove("active")
      await vg.initSelf()
      await vg.initMods()
      window.location.reload()
    }
  },

  async created() {
    this.mods = (await vg.storedMods())
      .filter(p => p.enabled)
      .filter(p => p.showInOptions);
    this.settings = await vg.getSettings()
  }
};
</script>

