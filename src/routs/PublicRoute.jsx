import React from "react";
import {Route, Redirect} from 'react-router-dom';


function PublicRoute({ children, authUser, ...rest }) {
    return (
        <Route
            {...rest}
            render={
                () => (
                    !!authUser
                        ? (
                            <Redirect to="/" />
                        ) : (
                            children
                        ))
            }
        />
    );
}

export default PublicRoute;

