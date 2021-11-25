import React from "react";
import {Route, Redirect} from 'react-router-dom';




function PrivateRoute({ children, authUser, ...rest }) {
    return (
        <Route
            {...rest}
            render={
                () => (
                    !!authUser
                        ? (
                            children
                        ) : (
                            <Redirect to="/signin" />
                        ))
            }
        />
    );
}

export default PrivateRoute;

