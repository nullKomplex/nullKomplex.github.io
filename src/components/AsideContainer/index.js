import React from "react";

import { withStyles } from "@material-ui/styles";

function styles(theme) {
    return {
        container: {
            maxWidth: "100vw",
            display: "flex",
            [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
                flexWrap: "wrap"
            }
        },
        itemOne: {
            flexGrow: 1,
            textAlign: "center"
        },
        itemTwo: {
            flexGrow: 5,
            margin: "0 10px",
            overflow: "hidden"
        }
    };
}

function AsideContainer({ classes, AsideComponent, children }) {
    return (
        <div className={classes.container}>
            <aside className={classes.itemOne}>
                <AsideComponent />
            </aside>
            <section className={classes.itemTwo}>{children}</section>
        </div>
    );
}

export default withStyles(styles)(AsideContainer);
