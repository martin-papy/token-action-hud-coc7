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

            if (this.actorType === 'character' || this.actorType === 'npc' || this.actorType === 'creature') {
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

        #showValue () {
            return game.settings.get('token-action-hud-core', 'tooltips') === 'none'
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
                    info1: this.#showValue() ? { text: tooltip.content } : null,
                    tooltip,
                    encodedValue
                })
            }
            await this.addActions(actions, { id: 'characteristics', type: 'system' })
        }

        async buildAttributes () {
            if (typeof this.actor.system.attribs.san.value !== 'undefined' &&
                this.actor.system.attribs.san.value !== null) {
                const actions = []
                const groupData = {
                    id: 'attr_sanity',
                    name: coreModule.api.Utils.i18n('CoC7.Sanity'),
                    type: 'system'
                }
                this.addGroup(groupData, { id: 'attributes', type: 'system' }, true)
                const tooltip = {
                    content: '' + this.actor.system.attribs.san.value + '/' +
                        this.actor.system.attribs.san.max + '',
                    class: 'tah-system-tooltip',
                    direction: 'LEFT'
                }
                actions.push({
                    name: coreModule.api.Utils.i18n('CoC7.SAN'),
                    id: 'san',
                    info1: this.#showValue() ? { text: tooltip.content } : null,
                    tooltip,
                    encodedValue: ['attributes', 'san'].join(this.delimiter)
                },
                {
                    name: '+',
                    id: 'sanity_add',
                    tooltip,
                    encodedValue: ['attributes', 'san_add'].join(this.delimiter)
                },
                {
                    name: '-',
                    id: 'sanity_subtract',
                    tooltip,
                    encodedValue: ['attributes', 'san_subtract'].join(this.delimiter)
                })

                await this.addActions(actions, { id: 'attr_sanity', type: 'system' })
            }

            if (typeof this.actor.system.attribs.hp.value !== 'undefined' &&
                this.actor.system.attribs.hp.value !== null) {
                const actions = []
                const groupData = {
                    id: 'attr_hp',
                    name: coreModule.api.Utils.i18n('CoC7.HitPoints'),
                    type: 'system'
                }
                this.addGroup(groupData, { id: 'attributes', type: 'system' }, true)
                const tooltip = {
                    content: '' + this.actor.system.attribs.hp.value + '/' +
                        this.actor.system.attribs.hp.max + '',
                    class: 'tah-system-tooltip',
                    direction: 'LEFT'
                }
                actions.push({
                    name: coreModule.api.Utils.i18n('CoC7.HP'),
                    id: 'hp',
                    info1: this.#showValue() ? { text: tooltip.content } : null,
                    tooltip,
                    encodedValue: ['attributes', 'hp'].join(this.delimiter)
                },
                {
                    name: '+',
                    id: 'hp_add',
                    tooltip,
                    encodedValue: ['attributes', 'hp_add'].join(this.delimiter)
                },
                {
                    name: '-',
                    id: 'hp_subtract',
                    tooltip,
                    encodedValue: ['attributes', 'hp_subtract'].join(this.delimiter)
                })

                await this.addActions(actions, { id: 'attr_hp', type: 'system' })
            }

            if (typeof this.actor.system.attribs.mp.value !== 'undefined' &&
                this.actor.system.attribs.mp.value !== null) {
                const actions = []
                const groupData = {
                    id: 'attr_mp',
                    name: coreModule.api.Utils.i18n('CoC7.MagicPoints'),
                    type: 'system'
                }
                this.addGroup(groupData, { id: 'attributes', type: 'system' }, true)
                const tooltip = {
                    content: '' + this.actor.system.attribs.mp.value + '/' +
                        this.actor.system.attribs.mp.max + '',
                    class: 'tah-system-tooltip',
                    direction: 'LEFT'
                }
                actions.push({
                    name: coreModule.api.Utils.i18n('CoC7.MP'),
                    id: 'mp',
                    info1: this.#showValue() ? { text: tooltip.content } : null,
                    tooltip,
                    encodedValue: ['attributes', 'mp'].join(this.delimiter)
                },
                {
                    name: '+',
                    id: 'mp_add',
                    tooltip,
                    encodedValue: ['attributes', 'mp_add'].join(this.delimiter)
                },
                {
                    name: '-',
                    id: 'mp_subtract',
                    tooltip,
                    encodedValue: ['attributes', 'mp_subtract'].join(this.delimiter)
                })
                await this.addActions(actions, { id: 'attr_mp', type: 'system' })
            }

            if (typeof this.actor.system.attribs.lck.value !== 'undefined' &&
                this.actor.system.attribs.lck.value !== null) {
                const actions = []
                const groupData = {
                    id: 'attr_lck',
                    name: coreModule.api.Utils.i18n('CoC7.Luck'),
                    type: 'system'
                }
                this.addGroup(groupData, { id: 'attributes', type: 'system' }, true)
                const tooltip = {
                    content: '' + this.actor.system.attribs.lck.value + '/' +
                        this.actor.system.attribs.lck.max + '',
                    class: 'tah-system-tooltip',
                    direction: 'LEFT'
                }
                actions.push({
                    name: coreModule.api.Utils.i18n('CoC7.Luck'),
                    id: 'lck',
                    info1: this.#showValue() ? { text: tooltip.content } : null,
                    tooltip,
                    encodedValue: ['attributes', 'lck'].join(this.delimiter)
                },
                {
                    name: '+',
                    id: 'lck_add',
                    tooltip,
                    encodedValue: ['attributes', 'lck_add'].join(this.delimiter)
                },
                {
                    name: '-',
                    id: 'lck_subtract',
                    tooltip,
                    encodedValue: ['attributes', 'lck_subtract'].join(this.delimiter)
                })
                await this.addActions(actions, { id: 'attr_lck', type: 'system' })
            }
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
                        info1: this.#showValue() ? { text: tooltip.content } : null,
                        tooltip,
                        encodedValue: ['skills', item.name].join(this.delimiter)
                    })
                }
            }
            await this.addActions(actions.sort((a, b) => a.name.localeCompare(b.name)), { id: 'skills', type: 'system' })
        }

        async buildCombat () {
            const rangedActions = []
            const meleeActions = []
            const meleeSkills = []
            const rangedSkills = []

            for (const item of this.actor.items) {
                let value = 0
                if (item.type === 'weapon') {
                    const skillId = item.system.skill.main.id
                    let skillName = item.system.skill.main.name
                    if (typeof skillName === 'undefined' || skillName === '') {
                        skillName = this.actor.items.find(i => i.id === skillId)?.name
                        if (typeof skillName === 'undefined' || skillName === '') {
                            continue
                        }
                    }
                    value = this.actor.system.skills[skillName]?.value
                    if (typeof value === 'undefined' || value === '') {
                        value = this.actor.items.find(i => i.id === skillId)?.value
                    }
                    if (typeof value === 'undefined' || value === '') {
                        // Flee!
                        continue
                    }
                    const tooltip = {
                        content: `${value}`,
                        direction: 'LEFT'
                    }
                    if (item.system.properties?.rngd) {
                        rangedActions.push({
                            name: item.name,
                            id: item._id,
                            info1: this.#showValue() ? { text: tooltip.content } : null,
                            tooltip,
                            encodedValue: ['combat', item.id].join(this.delimiter)
                        })
                    } else {
                        meleeActions.push({
                            name: item.name,
                            id: item._id,
                            info1: this.#showValue() ? { text: tooltip.content } : null,
                            tooltip,
                            encodedValue: ['combat', item.id].join(this.delimiter)
                        })
                    }
                } else if (item.type === 'skill') {
                    if (item.system.properties.combat === true && item.system.properties.fighting === true) {
                        const tooltip = {
                            content: `${item.value}`,
                            direction: 'LEFT'
                        }
                        meleeSkills.push({
                            name: item.name,
                            id: item._id,
                            tooltip,
                            info1: this.#showValue() ? { text: tooltip.content } : null,
                            encodedValue: ['combatSkills', item.name].join(this.delimiter)
                        })
                    } else if (item.system.properties.combat === true &&
                        (item.system.properties.firearm === true || item.system.properties.ranged === true)) {
                        const tooltip = {
                            content: `${item.value}`,
                            direction: 'LEFT'
                        }
                        rangedSkills.push({
                            name: item.name,
                            id: item._id,
                            info1: this.#showValue() ? { text: tooltip.content } : null,
                            tooltip,
                            encodedValue: ['combatSkills', item.name].join(this.delimiter)
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
            await this.addActions(rangedSkills, {
                id: 'rangedSkills',
                type: 'system'
            })
            await this.addActions(meleeSkills, {
                id: 'meleeSkills',
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
