import { abbreviation } from "tauriprogress-constants/currentContent";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Link as RouterLink } from "react-router-dom";

import { withTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import { Typography } from "@material-ui/core";

import ErrorMessage from "../ErrorMessage";
import Loading from "../Loading";

import { guildsFetch } from "../../redux/actions";

import { sortByProgression } from "./helpers";

class DisplayGuilds extends React.PureComponent {
    componentDidMount() {
        this.props.guildsFetch();
    }

    render() {
        const {
            guilds: { data, loading, error },
            theme: {
                palette: { factionColors, progStateColors }
            }
        } = this.props;

        return (
            <section className="displayGuilds">
                {loading && <Loading />}
                {error && <ErrorMessage message={error} />}
                {!loading && !error && data && (
                    <React.Fragment>
                        <div className="overflowScroll">
                            <Table>
                                <TableHead className="tableHead">
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Realm</TableCell>
                                        <TableCell>Faction</TableCell>
                                        <TableCell>
                                            {abbreviation} Completion
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortByProgression(data).map(guild => {
                                        return (
                                            <TableRow key={guild.guildName}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    className="displayGuildsGuildName"
                                                >
                                                    <Typography color="inherit">
                                                        <RouterLink
                                                            to={`/guild/${
                                                                guild.guildName
                                                            }?realm=${
                                                                guild.realm
                                                            }`}
                                                        >
                                                            <Link
                                                                component="span"
                                                                style={{
                                                                    color: guild.gFaction
                                                                        ? factionColors.horde
                                                                        : factionColors.alliance
                                                                }}
                                                            >
                                                                {
                                                                    guild.guildName
                                                                }
                                                            </Link>
                                                        </RouterLink>
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {guild.realm}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {guild.gFaction
                                                        ? "Horde"
                                                        : "Alliance"}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {guild.progression
                                                        .completed ? (
                                                        <span
                                                            style={{
                                                                color:
                                                                    progStateColors.defeated
                                                            }}
                                                        >
                                                            {new Date(
                                                                guild
                                                                    .progression
                                                                    .completed *
                                                                    1000
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    ) : (
                                                        guild.progression
                                                            .currentBossesDefeated
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </React.Fragment>
                )}
            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        guilds: state.guilds
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ guildsFetch }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withTheme()(DisplayGuilds));
