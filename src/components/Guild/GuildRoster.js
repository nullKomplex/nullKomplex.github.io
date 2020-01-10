import { characterClasses } from "tauriprogress-constants";
import React from "react";

import { useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

import GuildRosterChart from "./GuildRosterChart";
import GuildRosterList from "./GuildRosterList";
import GuildLatestKills from "./GuildLatestKills";

function styles(theme) {
    return {
        gridItemFlex: {
            flex: 1
        },
        container: {
            margin: `${theme.spacing(2)}px 0`
        }
    };
}

function GuildRoster({ classes }) {
    const members = useSelector(state => state.guild.data.guildList);

    const totalChars = members.length;
    let countClasses = {};
    let classInfo = [];
    let maxClassCount = 0;
    let nameRanks = {};
    let ranks = [];

    for (let classId in characterClasses) {
        countClasses[classId] = 0;
    }
    for (let member of members) {
        countClasses[member.class] += 1;
        nameRanks[member.rank_name] = true;
    }

    for (let classId in countClasses) {
        if (countClasses[classId] > maxClassCount)
            maxClassCount = countClasses[classId];
        classInfo.push({ classId, count: countClasses[classId] });
    }

    for (let rankName in nameRanks) {
        ranks.push(rankName);
    }

    return (
        <Grid container justify="space-around" className={classes.container}>
            <Grid item>
                <GuildRosterChart
                    classInfo={classInfo}
                    maxClassCount={maxClassCount}
                    totalChars={totalChars}
                />
            </Grid>
            <Grid item className={classes.gridItemFlex}>
                <GuildRosterList
                    members={members}
                    classInfo={classInfo}
                    ranks={ranks}
                />
            </Grid>
            <Grid item>
                <GuildLatestKills />
            </Grid>
        </Grid>
    );
}

export default withStyles(styles)(GuildRoster);
