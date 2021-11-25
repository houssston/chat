import React from 'react';
import Chat from "./pages/Chat/Chat";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import PrivateRoute from "./routs/PrivateRoute";
import PublicRoute from "./routs/PublicRoute";


function App() {
    return (
        <>
            <PublicRoute path="/signin">
                <Signin/>
            </PublicRoute>
            <PublicRoute path="/signup">
                <Signup/>
            </PublicRoute>
            <PrivateRoute path="/" exact="">
                <Chat/>
            </PrivateRoute>
        </>
    );
}

export default App;
