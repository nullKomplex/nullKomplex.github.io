import { put, call, select } from "redux-saga/effects";
import { raidBossCharactersFill } from "../../actions";
import { takeLatestIfTrue, getServerUrl } from "../../sagas/helpers";
import { getDataSpecificationString } from "../../../helpers";
import { cleanFilters } from "./helpers";
import {
    RAIDBOSS_CHARACTERS_FETCH,
    raidBossCharactersSetLoading,
    raidBossCharactersSetError
} from "../actions/characters";
import { raidBossCharactersDataSpecificationStringSelector } from "../selectors";

async function getData(
    serverUrl,
    raidId,
    bossName,
    combatMetric,
    filters,
    page,
    pageSize
) {
    return await fetch(`${serverUrl}/getboss/characters`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            raidId: raidId,
            bossName: bossName,
            combatMetric: combatMetric,
            filters: cleanFilters(filters),
            page: page,
            pageSize: pageSize
        })
    }).then(res => res.json());
}

function* fetchRaidBossCharacters({ payload }) {
    try {
        yield put(raidBossCharactersSetLoading());

        const { raidId, bossName, filters, combatMetric, page, pageSize } =
            payload;

        const dataSpecificationString = getDataSpecificationString({
            ...filters,
            raidId,
            bossName,
            combatMetric,
            page,
            pageSize
        });

        const serverUrl = yield getServerUrl();
        const response = yield call(
            getData,
            serverUrl,
            raidId,
            bossName,
            combatMetric,
            filters,
            page,
            pageSize
        );

        if (!response.success) {
            throw new Error(response.errorstring);
        } else {
            yield put(
                raidBossCharactersFill({
                    characters: response.response.characters,
                    itemCount: response.response.itemCount,
                    dataSpecificationString: dataSpecificationString
                })
            );
        }
    } catch (err) {
        yield put(raidBossCharactersSetError(err.message));
    }
}

function* conditionToFetch({ payload }) {
    const { raidId, bossName, filters, combatMetric, page, pageSize } = payload;

    const dataSpecificationString = getDataSpecificationString({
        ...filters,
        raidId,
        bossName,
        combatMetric,
        page,
        pageSize
    });
    const oldDataSpecificationString = yield select(
        raidBossCharactersDataSpecificationStringSelector
    );

    return dataSpecificationString !== oldDataSpecificationString;
}

export default function* getRaidBossCharacters() {
    yield takeLatestIfTrue(
        RAIDBOSS_CHARACTERS_FETCH,
        conditionToFetch,
        fetchRaidBossCharacters
    );
}
