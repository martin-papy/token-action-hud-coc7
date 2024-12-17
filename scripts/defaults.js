import { GROUP } from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name)
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
    })
    const groupsArray = Object.values(groups)
    DEFAULTS = {
        layout: [
            {
                nestId: 'characteristics',
                id: 'characteristics',
                name: coreModule.api.Utils.i18n('CoC7.Characteristics'),
                groups: [
                    { ...groups.characteristics, nestId: 'characteristics_characteristics' }
                ]
            },
            {
                nestId: 'attributes',
                id: 'attributes',
                name: coreModule.api.Utils.i18n('CoC7.Attributes'),
                groups: [
                    { ...groups.attributes, nestId: 'attributes_attributes' }
                ]
            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('CoC7.Skills'),
                groups: [
                    { ...groups.skills, nestId: 'skills_skills' }
                ]
            },
            {
                nestId: 'combat',
                id: 'combat',
                name: coreModule.api.Utils.i18n('CoC7.Combat'),
                groups: [
                    { ...groups.melee, nestId: 'combat_melee' },
                    { ...groups.ranged, nestId: 'combat_ranged' }
                ]
            }
        ],
        groups: groupsArray
    }
})
