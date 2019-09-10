import React from 'react';
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        footer: {
            height: '100px',
            width: '100%',
            'line-height': '25px',
            background: '#2b2b2b',
            'box-shadow': 'inset 0px 40px 20px -30px #101010',
        }
    })
);

export default function HeaderMenu() {
    const classes = useStyles()
    return (
        <div className={classes.footer}></div>
    )
}