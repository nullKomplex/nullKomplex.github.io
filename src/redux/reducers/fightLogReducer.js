const defaultState = {
    data: null,
    error: null,
    loading: true,
    sort: {
        by: "dps",
        direction: "desc"
    }
};

function fightLogReducer(state = defaultState, action) {
    switch (action.type) {
        case "FIGHT_LOG_SET_ERROR":
            return { ...state, error: action.payload, loading: false };
        case "FIGHT_LOG_SET_LOADING":
            return { ...state, loading: action.payload };
        case "FIGHT_LOG_FILL":
            let data = action.payload;
            data.members = data.members.map(member => ({
                ...member,
                dps: Math.round(member.dmg_done / (data.fight_time / 1000)),
                hps: Math.round(
                    (member.heal_done + member.absorb_done) /
                        (data.fight_time / 1000)
                )
            }));

            return { ...state, data: data, loading: false };
        case "FIGHT_LOG_MEMBERS_SORT":
            return { ...state, sort: action.payload };
        default:
            return state;
    }
}

export default fightLogReducer;
