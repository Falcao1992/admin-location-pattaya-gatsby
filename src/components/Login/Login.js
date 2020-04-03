import React, {useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../../firebase";
import { AuthContext } from "../Auth";
import { Input, Button, Container } from '@material-ui/core';

const Login = ({ history }) => {
    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            try {
                await app
                    .auth()
                    .signInWithEmailAndPassword(email.value, password.value);
                history.push("/");
            } catch (error) {
                alert(error);
            }
        },
        [history]
    );

    const currentUser = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <Container fixed>
            <h1>Veuillez Vous Connecter ...</h1>
            <form onSubmit={handleLogin}>
                <Input id="outlined-basic" name="email" type="email" placeholder="Email" />
                <Input id="outlined-basic" name="password" type="password" placeholder="Password" />
                <Button variant="contained" color="primary" type="submit">Log in</Button>
            </form>
        </Container>
    );
};

export default withRouter(Login);
