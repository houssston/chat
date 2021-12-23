import React, {useState,useEffect} from 'react';
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useHistory} from 'react-router-dom';
import * as Yup from "yup";
import {chatApi} from "../../api/api"
import {fb} from "../../firebase";
import style from "./Signup.module.css";


const validationSchema = Yup.object().shape({
    userName: Yup.string()
        .required('User name is required')
        .min(2, "User name is too short - should be 2 chars minimum"),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password is too short - should be 6 chars minimum"),
    confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords do not match"),
});

const Signup = () => {
    const history = useHistory();


    const submitLogin =  ({userName,firstName,lastName,email,password}) => {
        fb.auth.createUserWithEmailAndPassword(email, password)
            .then(response => {

                chatApi.createUser({
                    username: userName,
                    first_name:firstName,
                    last_name:lastName,
                    email:email,
                    secret: response.user.uid,
                });
                fb.firestore
                    .collection('chat')
                    .doc(response.user.uid)
                    .set({ userName}, { merge: true })

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            })
    };
   /* const onMainPhotoSelected= (e) =>{
        if(e.target.files.length){
            setImage(e.target.files[0]);

        }
    };*/


    return (
        <div>
            <h1>Signup</h1>
            <Formik
                onSubmit={submitLogin}
                validateOnMount={true}
                initialValues={{
                    userName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}

            >
                {({isValid}) => (
                    <Form className={style.form}>
                        <label>
                            User Name
                            <Field name="userName" type="text"/>
                            <ErrorMessage className="error" component="div" name="userName"/>
                        </label>
                        <label>
                            First name
                            <Field name="firstName" type="text"/>
                        </label>
                        <label>
                            Last name
                            <Field name="lastName" type="text"/>
                        </label>
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
                        <label>
                            Confirm password
                            <Field name="confirmPassword" type="password"/>
                            <ErrorMessage className="error" component="div" name="confirmPassword"/>
                        </label>
                        {/*<label>
                            avatar
                            <Field name="file" type="file" onChange={onMainPhotoSelected}/>
                        </label>*/}
                        <div className="auth-link-container">
                            Already have an account?{' '}
                            <span
                                className="auth-link"
                                onClick={() => history.push('login')}>
                                Log In!
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

export default Signup;
