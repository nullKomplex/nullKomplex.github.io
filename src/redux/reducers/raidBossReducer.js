const defaultState = {
    data: null,
    error: null,
    loading: false,
    raidName: null,
    bossName: null,
    raidData: null,
    selected: null
};

function raidBossReducer(state = defaultState, action, raids) {
    switch (action.type) {
        case "RAID_BOSS_LOADING":
            let raidData = raids.reduce((acc, curr) => {
                if (curr.name === action.payload.raidName) acc = curr;
                return acc;
            }, null);

            let selected = raidData
                ? raidData.encounters.reduce((acc, curr, index) => {
                      if (curr.encounter_name === action.payload.bossName)
                          acc = index + 1;
                      return acc;
                  }, null)
                : null;

            return {
                ...state,
                loading: true,
                raidName: action.payload.raidName,
                bossName: action.payload.bossName,
                error: null,
                raidData,
                selected
            };
        case "RAID_BOSS_FILL":
            let data = action.payload;
            let dps = {};
            for (let diff in data) {
                dps[diff] = [];
                for (let charKey in data[diff].dps) {
                    if (typeof data[diff].dps[charKey].dps !== "number")
                        continue;
                    data[diff].dps[charKey].dps = Math.round(
                        data[diff].dps[charKey].dps
                    );
                    dps[diff].push(data[diff].dps[charKey]);
                }
                data[diff].dps = dps[diff];
                data[diff].dps.sort((a, b) => b.dps - a.dps);
            }

            let hps = {};
            for (let diff in data) {
                hps[diff] = [];
                for (let charKey in data[diff].hps) {
                    data[diff].hps[charKey].hps = Math.round(
                        data[diff].hps[charKey].hps
                    );
                    hps[diff].push(data[diff].hps[charKey]);
                }
                data[diff].hps = hps[diff];
                data[diff].hps.sort((a, b) => b.hps - a.hps);
            }

            return {
                ...state,
                data: action.payload,
                loading: false,
                error: null
            };
        case "RAID_BOSS_SET_ERROR":
            if (!action.payload) {
                action.payload = "Unkown error.";
            }
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
}

export default raidBossReducer;
