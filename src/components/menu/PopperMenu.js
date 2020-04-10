import React, { useRef, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import styled from 'styled-components'
import { theme } from '../../Theme/Theme'

const Menu = styled(Paper)`
    background: ${theme.palette.background.dark};
`
const PopperWindow = styled(Popper)`
    z-index:2;
`
const StyledMenuList = styled(MenuList)`
    display: flex;
    flex-direction: column;
`

export default function PopperMenu({ text, MenuButtons }) {

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleClose = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const prevOpen = useRef(open);

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div>
            <Button
                color="secondary"
                size="small"
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                {text}
            </Button>
            <PopperWindow open={open} anchorEl={anchorRef.current} role={undefined} transition>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                    >
                        <Menu>
                        <ClickAwayListener onClickAway={handleClose}>
                            <StyledMenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                <MenuButtons />
                            </StyledMenuList>
                        </ClickAwayListener>
                        </Menu>
                    </Grow>
                )}
            </PopperWindow>
        </div >
    )
}