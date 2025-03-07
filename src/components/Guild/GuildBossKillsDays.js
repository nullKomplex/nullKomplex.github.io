import React from "react";

import { useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import GuildBossKillsChart from "./GuildBossKillsChart";

import { guildRaidDaysSelector } from "../../redux/guild/selectors";

function styles(theme) {
    return {
        container: {
            padding: `${theme.spacing(2)}px 0 ${theme.spacing(4)}px`
        },
        contentContainer: {
            maxWidth: "1000px",
            margin: "auto"
        },
        title: {
            margin: theme.spacing(2)
        }
    };
}

function GuildBossKillsDays({ classes }) {
    const raidDays = useSelector(guildRaidDaysSelector);

    return (
        <section className={classes.container}>
            <div className={classes.contentContainer}>
                <Typography variant="h5" className={classes.title}>
                    Boss kills
                </Typography>
                <Grid container justifyContent="space-around">
                    <Grid item>
                        <GuildBossKillsChart
                            data={raidDays.recent}
                            title={"Recent"}
                        />
                    </Grid>
                    <Grid item>
                        <GuildBossKillsChart
                            data={raidDays.total}
                            title={"All"}
                        />
                    </Grid>
                </Grid>
            </div>
        </section>
    );
}

export default withStyles(styles)(GuildBossKillsDays);
