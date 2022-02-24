import React, {useState} from 'react';
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {fb} from "../../firebase";
import {useHistory} from 'react-router-dom';
import SvgSelector from "../../assets/svg/SvgSelector";
import style from "./Auth.module.css";
import cn from "classnames";


const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        /*.min(6, "Must be 6 characters at least")*/
        .required("Password is required"),
});

const Signin = () => {
    const history = useHistory();
    const [serverError, setServerError] = useState(null);

    const submitLogin = (values,{setFieldValue, setSubmitting}) => {
        fb.auth.signInWithEmailAndPassword(values.email, values.password)
            .then(response => {
                //console.log(response);
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/wrong-password') {
                    setServerError('The account E-mail or password that you have entered is incorrect');
                    setFieldValue('password', '');
                } else if (errorCode === 'auth/user-not-found') {
                    setServerError('No account for this email');
                } else {
                    setServerError('Something went wrong :(');
                }
            })
            .finally(() => setSubmitting(false));
    };


    return (
        <div className={style.container}>

            <div className={style.leftSide}>
                <SvgSelector id={"loginBG"} mix={style.background}/>
            </div>
            <div className={style.rightSide}>
                <div className={style.rightSideInner}>
                    <h1 className={style.pageTitle}>Sign in to Your Account</h1>
                    <Formik
                        onSubmit={submitLogin}
                        validateOnMount={true}
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        validationSchema={validationSchema}
                    >
                        {({errors, touched, isValid}) => (

                            <Form className={style.form}>
                                <div className={style.form__Group}>
                                    <label className={style.fieldTitle}>E-mail</label>
                                    <Field className={cn(style.field,  {[style.field_error]: errors.email && touched.email})} name="email" type="email" autoComplete="email"/>
                                    <ErrorMessage className={style.errorText} component="div" name="email"/>
                                </div>
                                <div className={style.form__Group}>
                                    <label className={style.fieldTitle}>Password</label>
                                    <Field className={cn(style.field,  {[style.field_error]: errors.password && touched.password})} name="password" type="password"/>
                                    <ErrorMessage className={style.errorText} component="div" name="password"/>
                                </div>
                                {
                                    !!serverError &&
                                    <div className={style.serverError}>
                                        {serverError}
                                    </div>
                                }
                                <div className={style.form__Group}>
                                    <button className={style.btnSubmit} type="submit" disabled={!isValid}>SIGN IN
                                    </button>
                                </div>

                                <div className={style.toggleAuth}>
                                    Not registered yet?
                                    <span
                                        className={style.authLink}
                                        onClick={() => history.push('signup')}>
                                        Create an Account
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

export default Signin;
