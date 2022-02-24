import React, {useState, useRef} from 'react';
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useHistory} from 'react-router-dom';
import * as Yup from "yup";
import {chatApi} from "../../api/api"
import {fb} from "../../firebase";

import SvgSelector from "../../assets/svg/SvgSelector";
import cn from "classnames";
import style from "../Signin/Auth.module.css";


const validationSchema = Yup.object().shape({
    userName: Yup.string()
        .required('User Name is required')
        .min(5, "User name is too short - should be 5 chars minimum"),
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
    const [serverError, setServerError] = useState(null);
    const containerRef = useRef(null);

    const createAccount = ({userName, firstName, lastName, email, password}, {setSubmitting, setFieldValue}) => {
        fb.firestore.collection('chat').get().then((querySnapshot) => {
            if (!querySnapshot.docs.some(elem => elem.data().userName === userName)) {
                fb.auth.createUserWithEmailAndPassword(email, password)
                    .then(async response => {
                        await chatApi.createUser({
                            username: userName,
                            first_name: firstName,
                            last_name: lastName,
                            email: email,
                            secret: response.user.uid,
                        });
                        fb.firestore
                            .collection('chat')
                            .doc(response.user.uid)
                            .set({userName}, {merge: true})

                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        if (errorCode === 'auth/email-already-in-use') {
                            setServerError({
                                message: 'The email address is already in use by another account.',
                                field: 'email'
                            });
                            setFieldValue('email', '');
                        } else {
                            setServerError({
                                message: "We're having trouble signing you up. Please try again.",
                                field: null
                            });
                        }
                    })
                    .finally(() => setSubmitting(false));
            } else {
                setServerError({
                    message: 'The User Name is already in use by another account.',
                    field: 'userName'
                });
                setFieldValue('userName', '');
                /* containerRef.current?.scrollIntoView({
                     behavior: 'smooth'
                 });*/
            }
        });
    };

    return (
        <div className={style.container} ref={containerRef}>
            <div className={style.leftSide}>
                <SvgSelector id={"loginBG"} mix={style.background}/>
            </div>
            <div className={style.rightSide}>
                <div className={style.rightSideInner}>
                    <h1 className={style.pageTitle}>Sign up to Your Account</h1>
                    <Formik
                        onSubmit={createAccount}
                        validateOnMount={true}
                        initialValues={{
                            userName: '',
                            firstName: '',
                            lastName: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={validationSchema}
                    >
                        {({errors, touched, isValid,}) => (

                            <Form className={style.form}>
                                <div className={style.form__Group}>
                                    <label className={style.fieldTitle}>User Name</label>
                                    <Field
                                        className={cn(style.field, {[style.field_error]: errors.userName && touched.userName || serverError?.field === 'userName'})}
                                        name="userName" type="text" autoComplete="username"/>
                                    <ErrorMessage className={style.errorText} component="div" name="userName"/>
                                </div>
                                <div className={style.form__Group}>
                                    <label className={style.fieldTitle}>E-mail</label>
                                    <Field
                                        className={cn(style.field, {[style.field_error]: errors.email && touched.email || !!serverError?.field === 'email'})}
                                        name="email" type="email"/>
                                    <ErrorMessage className={style.errorText} component="div" name="email"/>
                                </div>
                                <div className={style.form__Group}>
                                    <label className={style.fieldTitle}>First Name</label>
                                    <Field className={cn(style.field)} name="firstName" type="text"/>
                                    <ErrorMessage className={style.errorText} component="div" name="firstName"/>
                                </div>
                                <div className={style.form__Group}>
                                    <label className={style.fieldTitle}>Last name</label>
                                    <Field className={cn(style.field)} name="lastName" type="text"/>
                                    <ErrorMessage className={style.errorText} component="div" name="lastName"/>
                                </div>
                                <div className={style.form__Group}>
                                    <label className={style.fieldTitle}>Password</label>
                                    <Field
                                        className={cn(style.field, {[style.field_error]: errors.password && touched.password})}
                                        name="password" type="password"/>
                                    <ErrorMessage className={style.errorText} component="div" name="password"/>
                                </div>
                                <div className={style.form__Group}>
                                    <label className={style.fieldTitle}>Confirm password</label>
                                    <Field
                                        className={cn(style.field, {[style.field_error]: errors.confirmPassword && touched.confirmPassword})}
                                        name="confirmPassword" type="password"/>
                                    <ErrorMessage className={style.errorText} component="div" name="confirmPassword"/>
                                </div>
                                {
                                    serverError &&
                                    <div className={style.serverError}>
                                        {serverError.message}
                                    </div>
                                }
                                <div className={style.form__Group}>
                                    <button className={cn(style.btnSubmit, {[style.btnSubmit_disabled]: !isValid})}
                                            type="submit" disabled={!isValid}>SIGN IN
                                    </button>
                                </div>
                                <div className={style.toggleAuth}>
                                    Already registered?
                                    <span
                                        className={style.authLink}
                                        onClick={() => history.push('signin')}>
                                        Sign In
                                    </span>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Signup;
