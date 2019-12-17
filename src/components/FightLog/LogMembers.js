import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import characterClassColors from "../../constants/characterClassColors";
import specToClass from "../../constants/specToClass";
import specs from "../../constants/specs";

import { getSpecImg } from "../DisplayRaid/helpers";
import { sortMembers } from "./helpers";

import { fightLogMembersSort } from "../../redux/actions";

const tableColumns = [
    {
        label: "Player",
        id: "name"
    },
    {
        label: "Dps",
        id: "dps"
    },
    {
        label: "Hps",
        id: "hps"
    },

    {
        label: "Damage",
        id: "dmg_done"
    },
    {
        label: "Healing",
        id: "total_healing"
    },
    {
        label: "Heal",
        id: "heal_done"
    },
    {
        label: "Absorb",
        id: "absorb_done"
    },
    {
        label: "Damage taken",
        id: "dmg_taken"
    },
    {
        label: "Interrupts",
        id: "interrupts"
    },
    {
        label: "Dispells",
        id: "dispells"
    }
];

function LogTableHead({ sort, fightLogMembersSort }) {
    return (
        <TableHead className="tableHead">
            <TableRow>
                {tableColumns.map(column => (
                    <TableCell
                        sortDirection={
                            sort.by === column.id ? sort.direction : false
                        }
                        key={column.id}
                    >
                        <Tooltip title="Sort" enterDelay={300}>
                            <TableSortLabel
                                active={sort.by === column.id}
                                direction={sort.direction}
                                onClick={() =>
                                    fightLogMembersSort({
                                        by: column.id,
                                        direction:
                                            sort.by === column.id
                                                ? sort.direction === "asc"
                                                    ? "desc"
                                                    : "asc"
                                                : "desc"
                                    })
                                }
                            >
                                {column.label}
                            </TableSortLabel>
                        </Tooltip>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function LogMembers({ data, sort, fightLogMembersSort }) {
    return (
        <div className="fightLogMembers overflowScroll">
            <Table>
                <LogTableHead
                    sort={sort}
                    fightLogMembersSort={fightLogMembersSort}
                />
                <TableBody>
                    {sortMembers(data.members, sort).map(member => (
                        <TableRow key={member.name}>
                            <TableCell component="th" scope="row">
                                <span className="textBold">{member.ilvl} </span>{" "}
                                <Tooltip title={specs[member.spec].label}>
                                    <Avatar
                                        component="span"
                                        src={getSpecImg(
                                            specs[member.spec].image
                                        )}
                                        className="classSpecAvatar"
                                    />
                                </Tooltip>{" "}
                                <span
                                    style={{
                                        color:
                                            characterClassColors[
                                                specToClass[member.spec]
                                            ]
                                    }}
                                >
                                    <Link
                                        to={`/player/${member.name}?realm=${
                                            data.realm
                                        }`}
                                    >
                                        {member.name}
                                    </Link>
                                </span>
                            </TableCell>

                            <TableCell component="th" scope="row" align="right">
                                <Tooltip title="Dps">
                                    <span className="textBold">
                                        {new Intl.NumberFormat().format(
                                            member.dps
                                        )}
                                    </span>
                                </Tooltip>
                            </TableCell>

                            <TableCell component="th" scope="row" align="right">
                                <Tooltip title="Hps">
                                    <span className="textBold">
                                        {new Intl.NumberFormat().format(
                                            member.hps
                                        )}
                                    </span>
                                </Tooltip>
                            </TableCell>

                            <TableCell component="th" scope="row" align="right">
                                <Tooltip title="Damage">
                                    <span className="textBold">
                                        {new Intl.NumberFormat().format(
                                            member.dmg_done
                                        )}
                                    </span>
                                </Tooltip>
                            </TableCell>

                            <TableCell component="th" scope="row" align="right">
                                <Tooltip title="Healing">
                                    <span className="textBold">
                                        {new Intl.NumberFormat().format(
                                            member.total_healing
                                        )}
                                    </span>
                                </Tooltip>
                            </TableCell>

                            <TableCell component="th" scope="row" align="right">
                                <Tooltip title="Heal">
                                    <span className="textBold">
                                        {new Intl.NumberFormat().format(
                                            member.heal_done
                                        )}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                                <Tooltip title="Absorb">
                                    <span className="textBold">
                                        {new Intl.NumberFormat().format(
                                            member.absorb_done
                                        )}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                                <Tooltip title="Damage taken">
                                    <span className="textBold">
                                        {new Intl.NumberFormat().format(
                                            member.dmg_taken
                                        )}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                                <Tooltip title="Interrupts">
                                    <span>{member.interrupts}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                                <Tooltip title="Dispells">
                                    <span>{member.dispells}</span>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        sort: state.fightLog.sort
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fightLogMembersSort }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogMembers);
