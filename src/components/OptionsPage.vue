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
                    >{{ mod.description }}</b-form-checkbox>
                    <div class="ml-4">
                      <small v-html="mod.longDescription"></small>
                    </div>
                    <div></div>
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
            <b-form-group>
              <b-form-checkbox v-model="settings.logging.active">
                Logging aktivieren
              </b-form-checkbox>
              <b-form-select v-model="settings.logging.level" :options="['debug', 'info', 'warn', 'error']"></b-form-select>
            </b-form-group>
            <b-form-group>
                <b-button v-if="!settingsSaved" @click="saveSettings()" variant="primary">Speichern</b-button>
                <b-button v-if="settingsSaved" disabled variant="primary">Gespeichert</b-button>
            </b-form-group>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
	<b-row class="my-3 d-flex justify-content-center font-weight-light">
		<small>s/o an benger für das Bereitstellen der Icons</small>
	</b-row>
  </b-container>
</template>

<script>
import browser from "webextension-polyfill";
import vg from "./../core/rbaVG";

export default {
  data() {
    return {
      mods: [],
      modsSaved: false,
      settingsSaved: false,
      targets: {
        board: "Forum",
        rba: "RBA"
      },
      settings: {}
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

