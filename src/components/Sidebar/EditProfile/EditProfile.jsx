import React,{useState,useRef} from 'react';
import Avatar from "../../Common/Avatar/Avatar";
import {Camera, SignOut} from "phosphor-react";
import {fb} from "../../../firebase";
import {useChat} from "../../../context/context";
import {chatApi} from "../../../api/api";
import FieldWithEffect from "../../Common/FieldWithEffect/FieldWithEffect";
import style from "./EditProfile.module.css";
import {Form, Formik} from "formik";


const EditProfile = () => {
    const {
        myDetails,
        logout,
        chatConfig,
        setMyDetails,
    }= useChat();
    const [avatarIsFetching, setAvatarIsFetching] = useState(false);
    const avatarFieldRef = useRef(null);
    const [firstName, setFirstName] = useState(myDetails.first_name);
    const [lastName, setLastName] = useState(myDetails.last_name);
    const uploadAvatar = (e) => {
        if (e.target.files.length) {
            setAvatarIsFetching(true);
            chatApi.updateMyDetails(e.target.files[0], chatConfig).then(
                response => {
                    setMyDetails(response);
                    setAvatarIsFetching(false);
                }
            )
        }
    };

    const submitUserDetails = () => {

    };
    console.log(myDetails);
    return (
        <>
            <div className={style.header}>
                <Avatar str={myDetails.username}  mix={style.avatarContainer}>
                    <div className={style.avatarEdit}>
                        <input className={style.avatarEdit__field} type='file' accept=".png, .jpg, .jpeg"
                               ref={avatarFieldRef} onChange={uploadAvatar} disabled={avatarIsFetching}/>
                        <Camera size={20} weight="fill" className={style.avatarEdit__icon}
                                onClick={() => avatarFieldRef.current.click()}/>
                    </div>
                    {!!myDetails.avatar
                        ? <img className={style.avatarPreview} src={myDetails.avatar} alt="Profile photo"/>
                        : !!myDetails.first_name || !!myDetails.last_name
                            ? myDetails.first_name.substring(0, 1).toUpperCase() + myDetails.last_name.substring(0, 1).toUpperCase()
                            : myDetails.username.substring(0, 1).toUpperCase()
                    }
                </Avatar>
                <div className={style.signOutBnt} onClick={() => {
                    fb.auth.signOut()
                        .then(() => {logout()})
                }}>
                    <SignOut size={20} color="#fff" weight="bold"/>
                </div>
            </div>
            <div className={style.body}>
                {/*<div className={style.editProfileList}>
                    <FieldWithEffect
                        placeholder={'First name (optional)'}
                        value={firstName}
                        touched={firstName}
                        event={setFirstName}
                    mix={style.editProfileItem}/>
                    <FieldWithEffect
                        placeholder={'Last name (optional)'}
                        value={lastName}
                        touched={lastName}
                        event={setLastName}
                        mix={style.editProfileItem}/>
                </div>*/}
                <div className={style.settingsList}>
                    <div className={style.settingsItem}>
                        <div className={style.settingsItem__title}>Username</div>
                        <FieldWithEffect
                            placeholder={'Username (required)'}
                            value={lastName}
                            touched={lastName}
                            event={setLastName}
                            mix={style.settingsItem__field}
                           />
                        <div className={style.settingsItem__description}>You
                            can use <b>a–z</b>, <b>0–9</b> and underscores. Minimum length is <b>5</b> characters.</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
