import { iconUrl } from "tauriprogress-constants/urls.json";

import { raidName } from "tauriprogress-constants/currentContent";
import { inventoryType } from "tauriprogress-constants";

import { getSocketInfo, gemColorsToSockets } from "../../helpers";

const defaultState = {
    playerName: null,
    realm: null,
    data: {
        loading: false,
        error: null,
        data: null
    },
    progression: {
        loading: false,
        error: null,
        data: null,
        selectedRaid: raidName
    },
    latestKills: {
        loading: false,
        data: null,
        error: null
    },
    items: {
        loading: false,
        data: {},
        error: null
    }
};

function playerReducer(state = defaultState, action) {
    switch (action.type) {
        case "PLAYER_DATA_SET_ERROR":
            if (!action.payload) {
                action.payload = "Unkown error.";
            }
            return {
                ...state,
                data: {
                    ...state.data,
                    error: action.payload,
                    loading: false
                }
            };

        case "PLAYER_DATA_LOADING":
            return {
                ...state,
                data: { ...state.data, loading: true, error: null },
                playerName: action.payload.playerName,
                realm: action.payload.realm
            };

        case "PLAYER_DATA_FILL":
            return {
                ...state,
                data: {
                    ...state.data,
                    data: action.payload,
                    loading: false,
                    error: null
                },
                playerName: action.payload.name,
                realm: action.payload.realm,
                progression: { ...defaultState.progression },
                items: { ...defaultState.items }
            };

        case "PLAYER_PROGRESSION_SELECT_RAID": {
            return {
                ...state,
                progression: {
                    ...state.progression,
                    selectedRaid: action.payload
                }
            };
        }

        case "PLAYER_PROGRESSION_SET_ERROR":
            return {
                ...state,
                progression: {
                    ...state.progression,
                    error: action.payload,
                    loading: false
                }
            };

        case "PLAYER_PROGRESSION_LOADING":
            return {
                ...state,
                progression: {
                    ...state.progression,
                    loading: true,
                    error: null
                }
            };

        case "PLAYER_PROGRESSION_FILL":
            return {
                ...state,
                progression: {
                    ...state.progression,
                    data: { ...state.progression.data, ...action.payload },
                    loading: false,
                    error: null
                }
            };

        case "PLAYER_LATESTKILLS_LOADING":
            return {
                ...state,
                latestKills: {
                    ...state.latestKills,
                    loading: action.payload
                }
            };

        case "PLAYER_LATESTKILLS_SET_ERROR":
            return {
                ...state,
                latestKills: {
                    ...state.latestKills,
                    loading: false,
                    error: action.payload
                }
            };

        case "PLAYER_LATESTKILLS_FILL":
            return {
                ...state,
                latestKills: {
                    ...state.latestKills,
                    loading: false,
                    error: null,
                    data: action.payload
                }
            };

        case "PLAYER_ITEMS_LOADING":
            return {
                ...state,
                items: {
                    ...state.items,
                    loading: action.payload,
                    error: null
                }
            };

        case "PLAYER_ITEMS_SET_ERROR":
            return {
                ...state,
                items: {
                    ...state.items,
                    loading: false,
                    error: action.payload
                }
            };

        case "PLAYER_ITEMS_FILL":
            let data = { ...state.items.data, ...action.payload };
            let itemNames = {
                Head: 0,
                Shoulder: 1,
                Chest: 2,
                Hands: 3,
                Legs: 4
            };

            const items = [
                {
                    equipped: false,
                    guid: null
                },
                {
                    equipped: false,
                    guid: null
                },
                {
                    equipped: false,
                    guid: null
                },
                {
                    equipped: false,
                    guid: null
                },
                {
                    equipped: false,
                    guid: null
                }
            ];

            let sets = {};

            for (let guid in data) {
                let item = data[guid];
                /* Socket info of item */
                if (!item.socketInfo) {
                    item.socketInfo = {
                        desc:
                            item.SocketBonusDesc !== ""
                                ? decodeURIComponent(item.SocketBonusDesc)
                                : false,
                        bonusCompleted: true,
                        sockets: []
                    };

                    for (let [index, socket] of item.Socket.entries()) {
                        let gem = item.SocketContainedGem[index];

                        if (gem) {
                            gem.icon = `${iconUrl}/small/${gem.icon}.png`;
                            gem.desc = decodeURIComponent(gem.desc);
                        }

                        if (gem || socket.Color !== 0) {
                            item.socketInfo.sockets.push({
                                ...getSocketInfo(socket.Color),
                                color: socket.Color,
                                gem: gem
                            });
                        }

                        if (!gem && socket.Color !== 0) {
                            item.socketInfo.bonusCompleted = false;
                        } else if (
                            gem &&
                            !gemColorsToSockets[gem.color].matches[socket.Color]
                        ) {
                            item.socketInfo.bonusCompleted = false;
                        }
                    }
                }
                /* Count set items */
                let itemSetInfo = item.ItemSetInfo;
                if (itemSetInfo.base) {
                    let setName = itemSetInfo.base.name;

                    if (!sets[setName])
                        sets[setName] = {
                            equipCount: 0,
                            items: item.ItemSetInfo.base.Items.reduce(
                                (acc, curr) => {
                                    acc[
                                        itemNames[inventoryType[curr.invType]]
                                    ] = {
                                        ...acc[
                                            itemNames[
                                                inventoryType[curr.invType]
                                            ]
                                        ],
                                        name: curr.name
                                    };
                                    return acc;
                                },
                                JSON.parse(JSON.stringify(items))
                            ),
                            effects: item.ItemSetInfo.base.Spells.filter(
                                effect => effect.spell !== ""
                            )
                        };

                    sets[setName].items[
                        itemNames[inventoryType[item.InventoryType]]
                    ] = {
                        equipped: true,
                        guid: guid,
                        name: data[guid].item_name
                    };
                    sets[setName].equipCount += 1;
                }
            }
            /* For each sets extend related item data with set info */
            for (let setName in sets) {
                let set = sets[setName];

                for (let item of set.items) {
                    data[item.guid] = {
                        ...data[item.guid],
                        set
                    };
                }
            }

            return {
                ...state,
                items: {
                    ...state.items,
                    loading: false,
                    data: data
                }
            };

        default:
            return state;
    }
}

export default playerReducer;
