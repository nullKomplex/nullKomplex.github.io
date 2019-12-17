import React from "react";

import { Link } from "react-router-dom";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { convertFightTime } from "../RaidBossSummary/helpers";

function FastestKills({ data }) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Rank</TableCell>

                    <TableCell>Guild</TableCell>
                    <TableCell>Kill time</TableCell>

                    <TableCell>Realm</TableCell>

                    <TableCell>Date</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((kill, index) => (
                    <TableRow key={kill.log_id}>
                        <TableCell component="th" scope="row">
                            {index + 1}
                        </TableCell>

                        <TableCell component="th" scope="row">
                            {kill.guilddata.name ? (
                                <Link
                                    to={`/guild/${kill.guilddata.name}?realm=${
                                        kill.realm
                                    }`}
                                >
                                    <span
                                        className={
                                            kill.guilddata.faction
                                                ? "red"
                                                : "blue"
                                        }
                                    >
                                        {kill.guilddata.name}
                                    </span>
                                </Link>
                            ) : (
                                "Random"
                            )}
                        </TableCell>

                        <TableCell component="th" scope="row">
                            {convertFightTime(kill.fight_time)}
                        </TableCell>

                        <TableCell component="th" scope="row">
                            {kill.realm}
                        </TableCell>

                        <TableCell component="th" scope="row">
                            {new Date(
                                kill.killtime * 1000
                            ).toLocaleDateString()}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default FastestKills;
