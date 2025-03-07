import {
    GUILD_LOADING_SET,
    GUILD_FILL,
    GUILD_ERROR_SET,
    GUILD_PROGRESSION_BOSS_SELECT,
    GUILD_PROGRESSION_RAID_SELECT,
    GUILD_PROGRESSION_FILTER_SET
} from "./actions";
import {
    ENVIRONMENT_REALMGROUP_CHANGED,
    ENVIRONMENT_SEASONAL_CHANGED
} from "../actions";

import constants from "tauriprogress-constants";
import {
    getDefaultDifficulty,
    getRealmGroupFromLocalStorage
} from "../../helpers";
const defaultRealmGroup = getRealmGroupFromLocalStorage();
const defaultDifficulty = getDefaultDifficulty(defaultRealmGroup);

let raids = constants[defaultRealmGroup].currentContent.raids;

const defaultState = {
    data: null,
    error: null,
    loading: false,
    guildName: null,
    realm: null,
    progressionFilter: {
        raid: constants[defaultRealmGroup].currentContent.name,
        boss: constants[defaultRealmGroup].currentContent.raids[0].bosses[0]
            .name,
        difficulty: defaultDifficulty,
        class: "",
        spec: "",
        role: "",
        faction: "",
        realm: ""
    }
};

function guildReducer(state = defaultState, action) {
    switch (action.type) {
        case ENVIRONMENT_REALMGROUP_CHANGED:
        case ENVIRONMENT_SEASONAL_CHANGED:
            raids = constants[action.payload.realmGroup].currentContent.raids;
            return {
                ...state,
                data: null,
                error: null,
                loading: false,
                guildName: null,
                realm: null,
                progressionFilter: {
                    raid: constants[action.payload.realmGroup].currentContent
                        .name,
                    boss: constants[action.payload.realmGroup].currentContent
                        .raids[0].bosses[0].name,
                    difficulty: getDefaultDifficulty(action.payload.realmGroup),
                    class: "",
                    spec: "",
                    role: "",
                    faction: "",
                    realm: ""
                }
            };

        case GUILD_LOADING_SET:
            return {
                ...state,
                loading: true,
                error: null,
                guildName: action.payload.guildName,
                realm: action.payload.realm
            };

        case GUILD_FILL:
            let progression = action.payload.progression;

            for (let raid of action.payload.raids) {
                let raidName = raid.raidName;
                for (let diffKey in progression[raidName]) {
                    for (let bossKey in progression[raidName][diffKey]) {
                        let dps = [];
                        for (let charKey in progression[raidName][diffKey][
                            bossKey
                        ].dps) {
                            let currentDps =
                                progression[raidName][diffKey][bossKey].dps[
                                    charKey
                                ].dps;
                            if (typeof currentDps !== "number") continue;
                            progression[raidName][diffKey][bossKey].dps[
                                charKey
                            ].dps = Math.round(currentDps);

                            dps.push(
                                progression[raidName][diffKey][bossKey].dps[
                                    charKey
                                ]
                            );
                        }
                        progression[raidName][diffKey][bossKey].dps = dps.sort(
                            (a, b) => b.dps - a.dps
                        );
                    }
                }

                for (let diffKey in progression[raidName]) {
                    for (let bossKey in progression[raidName][diffKey]) {
                        let hps = [];
                        for (let charKey in progression[raidName][diffKey][
                            bossKey
                        ].hps) {
                            progression[raidName][diffKey][bossKey].hps[
                                charKey
                            ].hps = Math.round(
                                progression[raidName][diffKey][bossKey].hps[
                                    charKey
                                ].hps
                            );

                            hps.push(
                                progression[raidName][diffKey][bossKey].hps[
                                    charKey
                                ]
                            );
                        }
                        progression[raidName][diffKey][bossKey].hps = hps.sort(
                            (a, b) => b.hps - a.hps
                        );
                    }
                }
            }

            return {
                ...state,
                data: {
                    ...action.payload,
                    progression: progression
                },
                guildName: action.payload.guildName,
                realm: action.payload.realm,
                loading: false,
                error: null
            };
        case GUILD_ERROR_SET:
            if (!action.payload) {
                action.payload = "Unkown error.";
            }
            return { ...state, error: action.payload, loading: false };
        case GUILD_PROGRESSION_BOSS_SELECT: {
            return {
                ...state,
                progression: {
                    ...state.progression,
                    selectedBossName: action.payload
                }
            };
        }

        case GUILD_PROGRESSION_RAID_SELECT: {
            return {
                ...state,
                progression: {
                    ...state.progression,
                    selectedRaidName: action.payload
                }
            };
        }

        case GUILD_PROGRESSION_FILTER_SET: {
            if (action.payload.filterName === "raid") {
                return {
                    ...state,
                    progressionFilter: {
                        ...state.progressionFilter,
                        [action.payload.filterName]: action.payload.value,
                        boss: raids.reduce((acc, curr) => {
                            if (curr.name === action.payload.value) {
                                acc = curr.bosses[0].name;
                            }
                            return acc;
                        }, "")
                    }
                };
            }
            if (action.payload.filterName === "class") {
                return {
                    ...state,
                    progressionFilter: {
                        ...state.progressionFilter,
                        [action.payload.filterName]: action.payload.value,
                        spec: ""
                    }
                };
            }

            return {
                ...state,
                progressionFilter: {
                    ...state.progressionFilter,
                    [action.payload.filterName]: action.payload.value
                }
            };
        }

        default:
            return state;
    }
}

export default guildReducer;
