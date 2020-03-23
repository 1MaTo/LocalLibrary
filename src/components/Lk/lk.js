import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import HeaderMenu from '../menu/HeaderMenu'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box';
import { theme } from '../../Theme/Theme'
import Update from './account/update'


const Background = styled.div`
`

const TabArea = styled(Container)`
    display: flex;
    background: ${theme.palette.background.dark};
    margin: 20px auto 20px auto;
    padding: 0px;
    height: 80vh;
`

const StyledTabs = styled(Tabs)`
    border-right: 1px solid ${theme.palette.divider};
    background: ${theme.palette.background.dark};
`

const StyledTabPanel = styled(TabPanel)`
    overflow: auto;
`

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function Lk() {

    const permission = useSelector(state => state.user ? state.user.role : null)

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Background>
            <HeaderMenu />
            <TabArea>
                <StyledTabs
                    textColor="primary"
                    indicatorColor="primary"
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                >
                    <Tab label="Учетная запись" {...a11yProps(0)} />
                    {permission === 'admin' ? <Tab label="Пользователи" {...a11yProps(1)} /> : null}
                    {permission === 'admin' ? <Tab label="Книги" {...a11yProps(2)} /> : null}
                </StyledTabs>
                <StyledTabPanel value={value} index={0}>
                    <Update />
                </StyledTabPanel>
                <StyledTabPanel value={value} index={1}>

                </StyledTabPanel>
                <StyledTabPanel value={value} index={2}>

                </StyledTabPanel>
            </TabArea>
        </Background>
    )
}