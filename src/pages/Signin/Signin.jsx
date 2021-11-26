import React from 'react';
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {fb} from "../../firebase";
import { useHistory } from 'react-router-dom';


const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password is too short - should be 6 chars minimum"),
});

const Signin = () => {
    const history = useHistory();
    const submitLogin = (values) => {
        fb.auth.signInWithEmailAndPassword(values.email, values.password)
            .then(response => {
                //console.log(response);
            })
    };


    return (
        <div className="auth-form">
            <h1>Login</h1>
            <Formik
                onSubmit={submitLogin}
                validateOnMount={true}
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={validationSchema}
            >
                {({isValid}) => (
                    <Form>
                        <label>
                            Email
                            <Field name="email" type="email"/>
                            <ErrorMessage className="error" component="div" name="email"/>
                        </label>
                        <label>
                            Password
                            <Field name="password" type="password"/>
                            <ErrorMessage className="error" component="div" name="password"/>
                        </label>
                        <div className="auth-link-container">
                            Don't have an account?{' '}
                            <span
                                className="auth-link"
                                onClick={() => history.push('signup')}>
                                Sign Up!
                            </span>
                        </div>
                        <button type="submit" disabled={!isValid}>
                            Login
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Signin;
