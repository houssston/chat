import React from 'react';
import style from './Avatar.module.css'
import cn from "classnames";
import {getColorForString} from "generate-colors";

const Avatar = ({str, size, mix, children}) => {
    const rgb = getColorForString(str, {
        brightness: () => {
            return 45;
        },
        saturation: () => {
            return 60;
        },
    }).join(',');

    return (
        <div className={cn(style.container,
            {[style.sizeLarge]: size === `large`},
            {[style.sizeMedium]: size === `medium`},
            {[style.sizeSmall]: size === `small`}, mix
        )
        }
             style={{
                 background: `linear-gradient(rgb(255, 255, 255) -125%, rgb(${rgb}))`,
             }}
        >
            {children}
        </div>
    );
};

export default Avatar;
