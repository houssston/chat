import React from 'react';
import Chat from "./pages/Chat/Chat";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import PrivateRoute from "./routs/PrivateRoute";
import PublicRoute from "./routs/PublicRoute";


function App() {
    return (
        <>
            <PrivateRoute path="/">
                <Chat/>
            </PrivateRoute>
            <PublicRoute path="/signin">
                <Signin/>
            </PublicRoute>
            <PublicRoute path="/signup">
                <Signup/>
            </PublicRoute>
        </>
    );
}

export default App;
