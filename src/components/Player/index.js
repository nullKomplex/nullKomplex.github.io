import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

import Loading from "../Loading";
import PlayerTitle from "./PlayerTitle";
import PlayerStats from "./PlayerStats";
import PlayerProgression from "./PlayerProgression";
import PlayerLatestKills from "./PlayerLatestKills";
import PlayerItems from "./PlayerItems";
import ErrorMessage from "../ErrorMessage";

import { playerDataFetch } from "../../redux/actions";
function styles() {
    return {
        gridContainer: { margin: "10px auto", maxWidth: "1300px" },
        progContainer: { flex: 1, maxWidth: "650px" }
    };
}
function Player({ classes, match, location }) {
    const playerName = match.params.playerName;
    const realm = new URLSearchParams(location.search).get("realm");
    const { loading, error } = useSelector(state => state.player.data);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(playerDataFetch({ playerName, realm }));
    }, [playerName, realm]);

    return (
        <section>
            {error ? (
                <ErrorMessage message={error} />
            ) : loading ? (
                <Loading />
            ) : (
                <React.Fragment>
                    <PlayerTitle />
                    <Grid
                        container
                        className={classes.gridContainer}
                        justify="space-around"
                    >
                        <Grid item>
                            <PlayerStats />
                        </Grid>
                        <Grid item className={classes.progContainer}>
                            <PlayerProgression />
                        </Grid>
                        <Grid item>
                            <PlayerItems />
                        </Grid>
                    </Grid>
                    <PlayerLatestKills />
                </React.Fragment>
            )}
        </section>
    );
}

export default withStyles(styles)(Player);
