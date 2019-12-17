import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Link } from "react-router-dom";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import SearchBar from "../SearchBar";
import ErrorMessage from "../ErrorMessage";
import Loading from "../Loading";

import {
    guildsFill,
    guildsSetError,
    guildsSetLoading
} from "../../redux/actions";

import { sortByProgression } from "./helpers";

import { serverUrl } from "../../constants/urls";

class DisplayGuilds extends React.PureComponent {
    componentDidMount() {
        if (!this.props.loading) {
            this.props.guildsSetLoading(true);
            fetch(`${serverUrl}/getguildlist`)
                .then(res => res.json())
                .then(res => {
                    if (!res.success) {
                        throw new Error(res.errorstring);
                    } else {
                        this.props.guildsFill(res.response);
                    }
                })
                .catch(err => this.props.guildsSetError(err.message));
        }
    }

    render() {
        const {
            guilds: { data, loading, error, tableColumns }
        } = this.props;

        return (
            <section className="displayGuilds">
                {loading && <Loading />}
                {error ? (
                    <ErrorMessage message={error} />
                ) : (
                    <React.Fragment>
                        <SearchBar />
                        <div className="overflowScroll">
                            <Table>
                                <TableHead className="tableHead">
                                    <TableRow>
                                        {tableColumns.map(column => (
                                            <TableCell key={column.key}>
                                                {column.label}
                                            </TableCell>
                                        ))}
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
                                                    <Link
                                                        to={`/guild/${
                                                            guild.guildName
                                                        }?realm=${guild.realm}`}
                                                    >
                                                        {guild.guildName}
                                                    </Link>
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
                                                    {guild.gFaction === 1
                                                        ? "Horde"
                                                        : "Alliance"}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {
                                                        guild.progression
                                                            .currentBossesDefeated
                                                    }
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
    return bindActionCreators(
        { guildsFill, guildsSetError, guildsSetLoading },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DisplayGuilds);
