// System Module Imports
import { Utils } from './utils.js'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
     */
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
        /**
         * Build system actions
         * Called by Token Action HUD Core
         * @override
         * @param {array} groupIds
         */a
        async buildSystemActions (groupIds) {
            // Set actor and token variables
            this.actors = (!this.actor) ? this._getActors() : [this.actor]
            this.actorType = this.actor?.type

            // Settings
            this.displayUnequipped = Utils.getSetting('displayUnequipped')

            // Set items variable
            if (this.actor) {
                let items = this.actor.items
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
            }

            if (this.actorType === 'character') {
                this.#buildCharacterActions()
            } else if (!this.actor) {
                this.#buildMultipleTokenActions()
            }
        }

        /**
         * Build character actions
         * @private
         */
        #buildCharacterActions () {
            this.buildCharacteristics()
            this.buildAttributes()
            this.buildSkills()
            this.buildCombat()
        }

        async buildCharacteristics () {
            const actions = []
            for (const key in this.actor.system.characteristics) {
                const encodedValue = [coreModule.api.Utils.i18n('characteristics'), key].join(this.delimiter)
                const tooltip = {
                    content: '' + this.actor.system.characteristics[key].value + '',
                    class: 'tah-system-tooltip',
                    direction: 'LEFT'
                }
                actions.push({
                    name: coreModule.api.Utils.i18n(this.actor.system.characteristics[key].short),
                    id: key,
                    tooltip,
                    encodedValue
                })
            }
            await this.addActions(actions, { id: 'characteristics', type: 'system' })
        }

        async buildAttributes () {
            const actions = []
            if (this.actor.system.attribs.lck.value) {
                const tooltip = {
                    content: '' + this.actor.system.attribs.lck.value + '',
                    class: 'tah-system-tooltip',
                    direction: 'LEFT'
                }
                actions.push({
                    name: coreModule.api.Utils.i18n('CoC7.Luck'),
                    id: 'lck',
                    tooltip,
                    encodedValue: ['attributes', 'lck'].join(this.delimiter)
                })
            }
            if (this.actor.system.attribs.san.value) {
                const tooltip = {
                    content: '' + this.actor.system.attribs.san.value + '',
                    class: 'tah-system-tooltip',
                    direction: 'LEFT'
                }
                actions.push({
                    name: coreModule.api.Utils.i18n('CoC7.Sanity'),
                    id: 'san',
                    tooltip,
                    encodedValue: ['attributes', 'san'].join(this.delimiter)
                })
            }
            await this.addActions(actions, { id: 'attributes', type: 'system' })
        }

        async buildSkills () {
            const actions = []
            for (const item of this.actor.items) {
                if (item.type === 'skill') {
                    const tooltip = {
                        content: '' + item.value + '',
                        direction: 'LEFT'
                    }
                    actions.push({
                        name: item.name,
                        id: item._id,
                        tooltip,
                        encodedValue: ['skills', item.name].join(this.delimiter)
                    })
                }
            }
            await this.addActions(actions.sort((a,b) => a.name.localeCompare(b.name)), { id: 'skills', type: 'system' })
        }

        async buildCombat () {
            const rangedActions = []
            const meleeActions = []
            const tooltip = {
                content: '',
                class: 'tah-system-tooltip'
            }
            for (const item of this.actor.items) {
                if (item.type === 'weapon') {
                    if (item.system.properties?.rngd) {
                        rangedActions.push({
                            name: item.name,
                            id: item._id,
                            tooltip,
                            encodedValue: ['combat', item.id].join(this.delimiter)
                        })
                    } else {
                        meleeActions.push({
                            name: item.name,
                            id: item._id,
                            tooltip,
                            encodedValue: ['combat', item.id].join(this.delimiter)
                        })
                    }
                }
            }
            await this.addActions(rangedActions, {
                id: 'ranged',
                type: 'system'
            })
            await this.addActions(meleeActions, {
                id: 'melee',
                type: 'system'
            })
        }

        /**
         * Build multiple token actions
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
        }
    }
})
