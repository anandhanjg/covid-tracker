import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom';
import StateCard from "../../components/stateCard/state-card";
import action from "../../redux/action";
import { subscribe } from "../../redux/subscribe";
import { Constants } from "../../utils/const";
import './home.css';
function Home(props){
    let [stateCodes,setStateCodes]=useState(Object.keys(Constants.stateCodeAndNames));
    let [searchTxt,setSearchTxt]=useState(localStorage.getItem('searchStateTxt'));
    let [searchDate,setSearchDate]=useState(localStorage.getItem('searchDate'));
    
    let navigate=useNavigate();
    let [covidData,covidTimeData]=useSelector((state)=>[state.covidData,state.covidTimeData]);
    const dispatch=useDispatch();

    useEffect(()=>{
        search(searchTxt);
    },[searchTxt])
    
    useEffect(()=>{
        onDateChange(searchDate);
        console.log(searchDate && covidTimeData.data['TN'] && covidTimeData.data['TN']['dates'] && covidTimeData.data['TN']['dates'][searchDate])
    },[searchDate])


    const refreshData=()=>{
        dispatch(subscribe('GET',Constants.covidDataTimeSeries,null,action.getCovidTimeData));
    }

    const search=(txt)=>{
       localStorage.setItem('searchStateTxt',txt);
       let reg=new RegExp(txt,'i');
       if(!txt)
            return setStateCodes(Object.keys(Constants.stateCodeAndNames));
       let na=Object.keys(Constants.stateCodeAndNames).filter(key=>reg.test(key) || reg.test(Constants.stateCodeAndNames[key]));
       setStateCodes(na);
       
    }
    
    const onDateChange=(dt)=>{
       localStorage.setItem('searchDate',dt)
    }

    const moveToDetailPage=(e)=>{
        navigate('detail?a=b');
    }
    if(covidData.requesting || covidTimeData.requesting){
        return (<div>Data Loading...</div>)
    }else{
        return (
            <div>
            
                <div className="row" style={{border:'1px solid',padding:'10px'}}>
                    <h5 className="col-1">States</h5>
                    <input className="col-2 mr-3" type='text' value={searchTxt} onChange={(e)=>setSearchTxt(e.target.value)} placeholder="Search State"></input>
                    <input className="col-2 mr-3" type='date' value={searchDate} onChange={(e)=>setSearchDate(e.target.value)}></input>
                </div>
                <div className="w-80 m-1 row p-1 d-flex justify-content-around">
                    {
                        stateCodes.length!=0 && stateCodes.map((key,i)=>(
                            <StateCard stateCode={key} key={i} stateName={Constants.stateCodeAndNames[key]} searchDate={searchDate} dateData={ searchDate && covidTimeData.data['TN'] && covidTimeData.data['TN']['dates'] && covidTimeData.data['TN']['dates'][searchDate]} stateData={covidData.data[key]}></StateCard>
                        ))
                    }
                    {
                        stateCodes.length==0 && (
                            <div>No Results Found</div>
                        )
                    }
                </div>
            </div>
        )
    }
    
}

export default Home;