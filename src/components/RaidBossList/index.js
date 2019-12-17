import React from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

class RaidBossList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            open: this.state.open ? false : true
        });
    }

    render() {
        const { raid } = this.props;
        return (
            <div className="raidBossList">
                <ListItem
                    button
                    onClick={this.handleClick}
                    style={{
                        background: "url(" + raid.picture + ")"
                    }}
                    className="raidBossListTitle"
                >
                    <ListItemText inset primary={raid.name} />
                    {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <ListItem component="li" button>
                            <Link to={`/raid/${raid.name}`}>
                                <ListItemText primary="Summary" />
                            </Link>
                        </ListItem>
                        {raid.encounters.map(encounter => {
                            let name = encounter.encounter_name;
                            let linkTo = `/raid/${raid.name}/${
                                encounter.encounter_name
                            }`;
                            let diff = encounter.encounter_difficulty;

                            if (encounter.encounter_difficulty) {
                                diff = diff === 5 ? "10" : "25";
                                name = `${name} ${diff}`;
                                linkTo = `${linkTo}/${diff}`;
                            }

                            return (
                                <ListItem component="li" button key={name}>
                                    <Link to={linkTo}>
                                        <ListItemText primary={name} />
                                    </Link>
                                </ListItem>
                            );
                        })}
                    </List>
                </Collapse>
            </div>
        );
    }
}

export default RaidBossList;
