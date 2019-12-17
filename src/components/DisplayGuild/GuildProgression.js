import { difficultyLabels, currentContent } from "tauriprogress-constants";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import GuildRaidList from "./GuildRaidBossList";
import GuildBoss from "./GuildBoss";
import GuildBossSummary from "./GuildBossSummary";

import { getBossesDefeated, selectDefaultDifficulty } from "./helpers";
import { getNestedObjectValue } from "../../helpers";

import { guildSelectBoss } from "../../redux/actions";

class GuildProgression extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tab: selectDefaultDifficulty(
                this.props.progression,
                currentContent.raidName,
                this.props.raids[currentContent.raidName].encounters[0]
                    .encounter_name
            )
        };
        this.tabChange = this.tabChange.bind(this);
    }

    componentDidMount() {
        if (!this.props.selectedBossName) {
            this.props.guildSelectBoss({
                selectedRaidName: this.props.raids[currentContent.raidName]
                    .name,
                selectedBossName: this.props.raids[currentContent.raidName]
                    .encounters[0].encounter_name
            });
        }
    }

    tabChange(e, value) {
        this.setState({ ...this.state, tab: value });
    }

    render() {
        const {
            progression,
            raids,
            selectedRaidName,
            selectedBossName
        } = this.props;

        if (!selectedBossName) {
            return <div className="displayGuildProgression" />;
        } else {
            let extendedRaids = [];
            let boss = getNestedObjectValue(progression, [
                selectedRaidName,
                this.state.tab,
                selectedBossName
            ]);

            for (let raidName in raids) {
                let bossesDefeated = getBossesDefeated(
                    raidName,
                    raids[raidName].encounters,
                    progression
                );

                raids[raidName].encounters = raids[raidName].encounters.map(
                    boss => ({
                        ...boss,
                        defeated: bossesDefeated[boss.encounter_name]
                            ? true
                            : false
                    })
                );

                extendedRaids.push(raids[raidName]);
            }

            return (
                <div className="displayGuildProgression">
                    <aside>
                        {extendedRaids.map(raid => (
                            <GuildRaidList key={raid.name} raid={raid} />
                        ))}
                    </aside>
                    <div className="displayGuildProgressionDataContainer">
                        <Tabs
                            value={this.state.tab}
                            onChange={this.tabChange}
                            indicatorColor="secondary"
                            className="displayGuildDifficultyTab"
                        >
                            <Tab label="10 HC" className="tab" value={5} />
                            <Tab label="25 HC" className="tab" value={6} />
                        </Tabs>
                        <GuildBossSummary
                            bossName={`${selectedBossName} ${
                                boss ? difficultyLabels[this.state.tab] : ""
                            }`}
                            data={boss}
                        />
                        {boss && (
                            <React.Fragment>
                                <GuildBoss data={boss} />
                            </React.Fragment>
                        )}
                    </div>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        raids: state.raidInfo.raids,
        selectedBossName: state.guild.selectedBossName,
        selectedRaidName: state.guild.selectedRaidName
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            guildSelectBoss
        },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GuildProgression);
