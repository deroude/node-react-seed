import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link as RouterLink, Switch, Route } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { UserList } from "./features/user-list/UserList";
import { Home } from "./features/home/Home";
import { Callback, login } from "./features/auth/Auth";
import { useState } from "react";
import GuardedRoute from "./GuardedRoute";
import { useTranslation } from "react-i18next";

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

export default function App() {
  const classes = useStyles();
  const [user, setUser] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setUser(localStorage.getItem("email"));
  }, []);

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
          {user !== null && (
            <Button color="inherit" component={RouterLink} to="/user-list">
              {t("Users")}
            </Button>
          )}
          {user === null && (
            <Button color="inherit" onClick={() => login()}>
              {t("Login")}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Paper>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <GuardedRoute path="/user-list" predicate={() => user !== null}>
            <UserList />
          </GuardedRoute>
          <Route exact path="/callback" component={Callback} />
        </Switch>
      </Paper>
    </div>
  );
}
