import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import { Link as RouterLink, Switch, Route } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { Paper } from "@material-ui/core";
import { UserList } from "./features/user-list/UserList";
import { Home } from "./features/home/Home";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Button color="inherit" component={RouterLink} to="/user-list">
              Users
          </Button>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Paper>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/user-list">
            <UserList />
          </Route>
        </Switch>
      </Paper>
    </div>
  );
}
