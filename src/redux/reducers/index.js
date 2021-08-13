import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import siteInfoReducer from "../siteInfo/reducer";
import characterLeaderboardReducer from "../characterLeaderboard/reducer";
import characterReducer from "../character/reducer";
import logReducer from "../log/reducer";
import guildLeaderboardReducer from "../guildLeaderboard/reducer";
import guildListReducer from "../guildList/reducer";

import raidReducer from "./raidReducer";
import raidSummaryReducer from "./raidSummaryReducer";
import raidBossReducer from "./raidBossReducer";
import navigationReducer from "./navigationReducer";
import guildReducer from "./guildReducer";
import themesReducer from "./themesReducer";
import environmentReducer from "./environmentReducer";

const createRootReducer = history =>
    combineReducers({
        router: connectRouter(history),
        siteInfo: siteInfoReducer,
        characterLeaderboard: characterLeaderboardReducer,
        character: characterReducer,
        log: logReducer,
        guildLeaderboard: guildLeaderboardReducer,
        guildList: guildListReducer,

        raid: raidReducer,
        raidSummary: raidSummaryReducer,
        raidBoss: raidBossReducer,
        navigation: navigationReducer,
        guild: guildReducer,
        themes: themesReducer,
        environment: environmentReducer
    });

export default createRootReducer;
