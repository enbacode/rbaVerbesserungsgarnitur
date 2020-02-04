<template>
	<b-container class="mt-3">
		<b-row>
			<b-col>
				<b-card title="Mods">
					<b-card-text>
						<b-form>
							<div v-for="(modCategory, k) in mods.groupBy('target')" v-bind:key="k">
								<h5>{{ targets[k] }}</h5>
							<div v-for="mod in modCategory" v-bind:key="mod.name">
								<b-form-group>
									<b-form-checkbox
										v-model="mod.active"
										@change="changesSaved = false"
									>{{ mod.description }}</b-form-checkbox>
									<div class="ml-4">
										<small v-html="mod.longDescription"></small>
									</div>
									<div>
										
									</div>
								</b-form-group>
							</div>
							</div>
							<b-form-group>
								<b-button v-if="!changesSaved" @click="save()" variant="primary">Speichern</b-button>
								<b-button v-if="changesSaved" disabled variant="primary">Gespeichert</b-button>
							</b-form-group>
						</b-form>
					</b-card-text>
				</b-card>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import browser from 'webextension-polyfill'
import vg from './../core/rbaVG'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
	data() {
		return {
			mods: [],
			changesSaved: false,
			targets : {
				'board': 'Forum',
				'rba': 'RBA'
			}
		}
	},

	methods: {
		async save() {
			await browser.storage.local.set({ mods: this.mods })
			this.changesSaved = true
			this.$bvToast.toast(
				'Lade die RBA- bzw. Forenseite neu, um deine Änderungen wirksam zu machen.',
				{
					title: 'Änderungen gespeichert',
					variant: 'success',
					toaster: 'b-toaster-top-center'
				}
			)
		}
	},

	async created() {
		this.mods = (await vg.storedMods()).filter(p => p.enabled).filter(p => p.showInOptions)
	}
}
</script>

