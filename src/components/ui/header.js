import React, {useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { AppBar, Button, IconButton, List, ListItem, ListItemText, Menu, MenuItem, SwipeableDrawer, Tab, Tabs, Toolbar, useMediaQuery, useScrollTrigger } from "@material-ui/core";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import logo from '../../assets/logo.svg';

function ElevationScroll(props) {
    const { children } = props;

    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0
    });
  
    return React.cloneElement(children, {
      elevation: trigger ? 4 : 0,
    });
  }

const useStyles = makeStyles(theme => (
    {
        toolbarMargin: {
            ...theme.mixins.toolbar,
            marginBottom: "3em",
            [theme.breakpoints.down("md")]: {
                marginBottom: "2em"
            },
            [theme.breakpoints.down("xs")]: {
                marginBottom: "1.25em"
            }
        },
        logoContainer: {
            padding: 0,
            "&:hover": {
                backgroundColor: "transparent"
            }
        },
        logo: {
            height: "8em",
            [theme.breakpoints.down("md")]: {
                height: "7em"
            },
            [theme.breakpoints.down("xs")]: {
                height: "5.5em"
            }
        },
        tabContainer: {
            marginLeft: "auto"
        },
        tab: {
            ...theme.typography.tab,
            minWidth: 10,
            marginLeft: "25px",
            opacity: 0.7,
            "&:hover": {
                opacity: 0.85
            }
        },
        button: {
            ...theme.typography.estimate,
            borderRadius: "50px",
            marginLeft: "50px",
            marginRight: "25px",
            height: "45px",
            "&:hover": {
                backgroundColor: theme.palette.secondary.light
            }
        },
        menu: {
            backgroundColor: theme.palette.common.blue,
            color: "white",
            borderRadius: "0px"
        },
        menuItem: {
            ...theme.typography.tab,
            opacity: 0.7,
            "&:hover": {
                opacity: 1
            }
        },
        drawerIconContainer: {
            marginLeft: "auto",
            "&:hover": {
                backgroundColor: "transparent"
            }
        },
        drawerIcon:{
            height: "50px",
            width: "50px"
        },
        drawer: {
            backgroundColor: theme.palette.common.blue
        },
        drawerItem: {
            ...theme.typography.tab,
            color: "white",
            opacity: 0.7,
            "&:hover": {
                opacity: 1
            }
        },
        drawerItemEstimate: {
            backgroundColor: theme.palette.common.orange
        },
        drawerItemSelected: {
            "& .MuiListItemText-root": {
                opacity: 1
            }     
        },
        appbar: {
            [theme.breakpoints.down("md")]: {
                zIndex: theme.zIndex.modal + 1
            }
        }
    }
));  

export default function Header(props) {
    const classes = useStyles();
    const theme = useTheme();
    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const matches = useMediaQuery(theme.breakpoints.down("md"))
    const [openDrawer, setOpenDrawer] = useState(false);

    // the anchor element where the menu will be rendered
    const [anchorEl, setAnchorEl] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);

    const handleChange = (e, newValue) => {
        props.setValue(newValue)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(true);
    };

    const handleMenuItemClick = (e, i) => {
        setAnchorEl(null);
        setOpenMenu(false);
        props.setSelectedIndex(i);
    }

    const handleClose = (event) => {
        setAnchorEl(null);
        setOpenMenu(false);
    }

    const menuOptions = useMemo(() => [
        { name: "Services", link: "/services", activeIndex: 1, selectedIndex: 0 },
        { name: "Custom Software Development", link: "/services/customsoftware", activeIndex: 1, selectedIndex: 1 },
        { name: "iOS/Android App Development", link: "/services/mobileapps", activeIndex: 1, selectedIndex: 2 },
        { name: "Website Development", link: "/services/websites", activeIndex: 1, selectedIndex: 3 },
    ], []);

    const routes = useMemo(() => [
        { 
            name: "Home", 
            link: "/", 
            activeIndex: 0
        },
        { name: "Services", 
            link: "/services", 
            activeIndex: 1, 
            ariaOwns: anchorEl ? "simple-menu" : undefined,
            ariaHasPopup: anchorEl ? "true" : undefined,
            mouseOver: (event) => handleClick(event) 
        },
        { name: "The Revolution", link: "/revolution", activeIndex: 2 },
        { name: "About Us", link: "/about", activeIndex: 3 },
        { name: "Contact Us", link: "/contact", activeIndex: 4 }
    ], [anchorEl]);

    useEffect(() => {
        [...menuOptions, ...routes].forEach(route => {
            switch (window.location.pathname) {
                case `${route.link}`:
                    if (props.value !== route.activeIndex) {
                        props.setValue(route.activeIndex)
                        if (route.selectedIndex && route.selectedIndex !== props.selectedIndex) {
                            props.setSelectedIndex(route.selectedIndex)
                        }
                    }
                    break;
                default:
                    break;
            }
        })
    },[props.value, menuOptions, props.selectedIndex, routes, props])

    const tabs = (
        <>
            <Tabs 
                value={props.value} 
                onChange={handleChange} 
                className={classes.tabContainer} 
                indicatorColor="primary">
                    {routes.map((route, index) => (
                        <Tab
                            key={`${route}${index}`}
                            className={classes.tab}
                            component={Link}
                            to={route.link}
                            label={route.name}
                            aria-owns={route.ariaOwns}
                            aria-haspopup={route.ariaHasPopup}
                            onMouseOver={route.mouseOver} />
                    ))}
            </Tabs>
            <Button 
                variant="contained" 
                color="secondary" 
                className={classes.button}>
                Free Estimate
            </Button>
            <Menu 
                id="simple-menu" 
                anchorEl={anchorEl} 
                open={openMenu}
                onClose={handleClose}
                classes={{paper:classes.menu}}
                MenuListProps={{onMouseLeave: handleClose}}
                elevation={0}
                keepMounted>
                {menuOptions.map((option, i) => (
                    <MenuItem 
                        key={`${option}${i}`}
                        component={Link} 
                        to={option.link}
                        classes={{root: classes.menuItem}}
                        onClick={(event) => {handleMenuItemClick(event, i); props.setValue(1); handleClose()}} 
                        selected={i === props.selectedIndex && props.value === 1}>
                        {option.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )

    const drawer = (
        <>
            <SwipeableDrawer 
                disableBackdropTransition={!iOS} 
                disableDiscovery={iOS}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)} 
                onOpen={() => setOpenDrawer(true)}
                classes={{paper: classes.drawer}}>
                    <div className={classes.toolbarMargin} />
                    <List disablePadding>
                        {routes.map((route) => (
                            <ListItem
                                key={`${route}${route.activeIndex}`}
                                divider
                                button
                                component={Link}
                                to={route.link}
                                selected={props.value === route.activeIndex}
                                classes={{selected: classes.drawerItemSelected}}
                                onClick={() => {setOpenDrawer(false); props.setValue(route.activeIndex)}}>
                                <ListItemText
                                    className={classes.drawerItem}
                                    disableTypography>
                                        {route.name}
                                </ListItemText>
                            </ListItem>
                        ))}
                        <ListItem 
                            classes={{root: classes.drawerItemEstimate, selected: classes.drawerItemSelected}}
                            onClick={() => {setOpenDrawer(false); props.setValue(5)}}  
                            divider 
                            button 
                            component={Link} 
                            to="/estimate"
                            selected={props.value === 5}>
                            <ListItemText 
                                className={classes.drawerItem}
                                disableTypography>
                                Free Estimate
                            </ListItemText>
                        </ListItem>
                    </List>
            </SwipeableDrawer>
            <IconButton className={classes.drawerIconContainer} onClick={() => setOpenDrawer(!openDrawer)} disableRipple>
                <MenuIcon className={classes.drawerIcon}/>
            </IconButton>
        </>
    )

    return (
        <>
            <ElevationScroll>
                <AppBar 
                    position="fixed"
                    className={classes.appbar}>
                    <Toolbar disableGutters>
                        <Button 
                            component={Link} 
                            to="/" 
                            className={classes.logoContainer} 
                            onClick={() => props.setValue(0)} 
                            disableRipple>
                            <img className={classes.logo} 
                                alt="company logo" 
                                src={logo} />
                        </Button>
                        { matches ? drawer : tabs}
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <div className={classes.toolbarMargin} />
        </>
    )
}