import React,{useState, useEffect} from 'react';
import Chat from "./pages/Chat/Chat";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import PrivateRoute from "./routs/PrivateRoute";
import PublicRoute from "./routs/PublicRoute";
import {ChatProvider} from "./context/context";
import {useResolved} from "./hooks/useResolved";
import {fb} from "./firebase";



function App() {
    const [authUser, setAuthUser] = useState();
    const authResolved = useResolved(authUser);

    useEffect(() => {
        const unsubscribe = fb.auth.onAuthStateChanged(user => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });
        return unsubscribe;
    }, []);

    return (authResolved &&
        (<ChatProvider authUser={authUser}>
            <PrivateRoute path="/" authUser={authUser}>
                <Chat/>
            </PrivateRoute>
            <PublicRoute path="/signin" authUser={authUser}>
                <Signin/>
            </PublicRoute>
            <PublicRoute path="/signup" authUser={authUser}>
                <Signup/>
            </PublicRoute>

        </ChatProvider>)
    )
}

export default App;
