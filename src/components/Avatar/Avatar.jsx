import React from 'react';
import style from './Avatar.module.css'
import cn from "classnames";
import {getColorForString} from "generate-colors";

const Avatar = ({str, size = `medium`, mix, children}) => {
    const rgb = getColorForString(str, {
        brightness: (defaultValue) => {
            if (defaultValue <= 60) return 60;
            if (defaultValue >= 90) return 90;
            return defaultValue
        },
        saturation: (defaultValue) => {
            if (defaultValue <= 60) return 60;
            return defaultValue
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
                 background: `rgb(${rgb})`,
             }}
        >
            {children}
        </div>
    );
};

export default Avatar;
