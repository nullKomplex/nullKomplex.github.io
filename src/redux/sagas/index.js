import { all } from "redux-saga/effects";
import getGuildsSaga from "./getGuildsSaga";
import getLastUpdateSaga from "./getLastUpdateSaga";
import updateDbSaga from "./updateDbSaga";
import getRaidSaga from "./getRaidSaga";
import getRaidBossSaga from "./getRaidBossSaga";
import getLogSaga from "./getLogSaga";
import getGuildSaga from "./getGuildSaga";
import getPlayerSaga from "./getPlayerSaga";
import updateRaidBossSaga from "./updateRaidBossSaga";
import getPlayerLatestKillsSaga from "./getPlayerLatestKillsSaga";

function* sagas() {
    yield all([
        getLastUpdateSaga(),
        getGuildsSaga(),
        updateDbSaga(),
        getRaidSaga(),
        getRaidBossSaga(),
        getLogSaga(),
        getGuildSaga(),
        getPlayerSaga(),
        updateRaidBossSaga(),
        getPlayerLatestKillsSaga()
    ]);
}

export default sagas;
