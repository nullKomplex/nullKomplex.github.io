import React from "react";

import { withStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";

function styles(theme) {
    return {
        container: {
            padding: 0,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            "& .MuiFormControl-root": {
                margin: `0 ${theme.spacing(1)}px`
            }
        }
    };
}

function FilterContainer({ classes, children }) {
    return <Container className={classes.container}>{children}</Container>;
}

export default withStyles(styles)(FilterContainer);
