import React from "react";
import { Link } from "react-router-dom";

export default function MainPanel(props){
    return (
        <div className="w-100">
            <nav className="p-1 m-3">
                <Link className="p-3 m-2" style={{color:'#f50673',fontSize:'20px',fontWeight:'600'}} to="/">Covid Tracker India</Link>
            </nav>
            <div className="w-100">
                {props.routerSection}
            </div>
        </div>
    )
}