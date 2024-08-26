import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import {
  AppBar,
  Box,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import RightDropdownMenu from '../RightDropdownMenu';

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));



const Layout = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [professionalOpen, setProfessionalOpen] = useState(false);
  const [table, setTable] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleProfessionalClick = () => {
    setProfessionalOpen(!professionalOpen);
  };
  const handleTableClick = () => {
    setTable(!table);
  };

  // phân quyền
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  const user = jwtDecode(token);


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Ice Cream Manager Dashboard
          </Typography>
          <RightDropdownMenu />
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        {user?.role === 'admin' && (
        <List>
          {/* <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem> */}
          <ListItem button component={Link} to="/user-management">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
          
        </List>
        )}
        <Divider />
        <List>
          <ListItem button component={Link} to="/recipe-search">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Make at home" />
          </ListItem>
          <ListItem button component={Link} to="/school">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="School of Cool" />
          </ListItem>
          <ListItem button onClick={handleProfessionalClick}>
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Professional" />
            {professionalOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={professionalOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <ListItem
                button
                component={Link}
                to="/recipe-search"
                sx={{ pl: 4 }}
              >
                <ListItemText primary="I would like to make..." />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/recipes"
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Recipe" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/ingredients"
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Ingredients" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/industry"
                sx={{ pl: 4 }}
              >
                <ListItemText primary="The Industry" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/school"
                sx={{ pl: 4 }}
              >
                <ListItemText primary="School of Cool" />
              </ListItem>
              <ListItem button onClick={handleTableClick} sx={{ pl: 4 }}>
                <ListItemText primary="Meta data" />
                {table ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={table} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <ListItem
                button
                component={Link}
                to="/recipe-type"
                sx={{ pl: 6 }}
              >
                <ListItemText primary="Recipe Type" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/flavour-notes"
                sx={{ pl: 6 }}
              >
                <ListItemText primary="Flavour Notes" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/measurements"
                sx={{ pl: 6 }}
              >
                <ListItemText primary="Measurement" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/currencies"
                sx={{ pl: 6 }}
              >
                <ListItemText primary="Currency" />
              </ListItem>
              {/* <ListItem
                button
                component={Link}
                to="/ingredientCategoryTable"
                sx={{ pl: 6 }}
              >
                <ListItemText primary="Ingredient Category" />
              </ListItem> */}
              
              <ListItem
                button
                component={Link}
                to="/recipe-nutrition"
                sx={{ pl: 6 }}
              >
                <ListItemText primary="Recipe Nutrition Range" />
              </ListItem>
            </List>
            </Collapse>
            </List>
          </Collapse>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
};

export default Layout;
