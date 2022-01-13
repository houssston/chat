import "../spinner/spinner.css";

export default function Spinner(props) {
    return (
        <div className="spinner-container">
            <svg className="spinner" viewBox="0 0 66 66" data-reactid=".0.3.0.0.0.0.0" style={{animationDuration:props.speed+"s"}}>
                <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"
    data-reactid=".0.3.0.0.0.0.0.0" stroke={!!props.customColor ? props.customColor : `#000`}/>
            </svg>
            <p>{props.customText}</p>
        </div>
    )
}
