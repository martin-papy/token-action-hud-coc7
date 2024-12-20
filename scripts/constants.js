/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'token-action-hud-coc7'
}

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '2.0'

/**
 * Action types
 */
export const ACTION_TYPE = {
    characteristics: 'CoC7.Characteristics',
    attributes: 'CoC7.Attributes',
    skills: 'CoC7.Skills',
    combat: 'CoC7.Combat'
}

/**
 * Groups
 */
export const GROUP = {
    characteristics: { id: 'characteristics', name: 'CoC7.Characteristics', type: 'system' },
    attributes: { id: 'attributes', name: 'CoC7.Attributes', type: 'system' },
    skills: { id: 'skills', name: 'CoC7.Skills', type: 'system' },
    combat: { id: 'combat', name: 'CoC7.Combat', type: 'system' },
    melee: { id: 'melee', name: 'CoC7.MeleeWeapons', type: 'system' },
    ranged: { id: 'ranged', name: 'CoC7.RangedWeapons', type: 'system' }
}
