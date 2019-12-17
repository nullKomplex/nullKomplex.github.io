import { abbreviation } from "tauriprogress-constants/currentContent";

import React from "react";
import { useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

import MetaDataList from "../MetaDataList";

import { getBossesDefeated } from "./helpers";

function styles(theme) {
    return {
        container: {
            backgroundColor: theme.palette.backgroundAccent
        }
    };
}

function PlayerStats({ classes }) {
    const { data, progression } = useSelector(state => {
        return {
            data: state.player.data.data,
            progression: state.player.progression.data
        };
    });

    const general = [
        {
            label: `${abbreviation} HC`,
            value: progression && getBossesDefeated(progression)
        },
        { label: "Achievements", value: data && data.pts },
        { label: "Level", value: data && data.level },
        { label: "Ilvl", value: data && data.avgitemlevel }
    ];

    const primaryStats = [
        { label: "Armor", value: data && data.characterStat.effective_armor },
        {
            label: "Stamina",
            value: data && data.characterStat.effective_stamina
        },
        {
            label: "Strength",
            value: data && data.characterStat.effective_strength
        },
        {
            label: "Agility",
            value: data && data.characterStat.effective_agility
        },
        {
            label: "Intellect",
            value: data && data.characterStat.effective_intellect
        },
        { label: "Spirit", value: data && data.characterStat.effective_spirit }
    ];
    const secondaryStats = [
        {
            label: "Attack power",
            value:
                data &&
                data.characterStat.bonus_strength_attackpower +
                    data.characterStat.bonus_agility_attackpower
        },
        { label: "Spell power", value: data && data.characterStat.heal_bonus },
        { label: "Hit", value: data && data.characterStat.melee_hit_rating },
        { label: "Crit", value: data && data.characterStat.melee_crit_rating },
        {
            label: "Haste",
            value: data && data.characterStat.hasterating_melee_dmg
        },
        { label: "Mastery", value: data && data.characterStat.mastery_rating },
        {
            label: "Dodge",
            value: data && data.characterStat.dodge_chance + "%"
        },
        { label: "Parry", value: data && data.characterStat.parry_chance + "%" }
    ];

    return (
        <div>
            <Card className={`${classes.container} displayPlayerStats`}>
                <MetaDataList title="General" values={general} />
                <MetaDataList title="Primary Stats" values={primaryStats} />
                <MetaDataList title="Secondary Stats" values={secondaryStats} />
            </Card>
        </div>
    );
}

export default withStyles(styles)(PlayerStats);
