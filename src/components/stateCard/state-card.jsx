import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toCapitalize } from "../../utils/util";
import './state-card.css';

// String.prototype.toCapitalize=(str)=>str[0].toUpperCase()+str.slice(1)

Object.assign(String.prototype,{
    toCapitalize(){
        return this[0].toUpperCase()+this.slice(1)
    }
});

function StateCard({stateData,stateName,stateCode,searchDate,dateData}){
    const navigate=useNavigate();
    let [district,setDistrict]=useState('');
    let [showData,setShowData]=useState(dateData || stateData || (district && stateData && stateData.districts[district]));
    let [dataType,setDataType]=useState('delta');

    const changeDataType=(e)=>{
        if(dataType==='delta'){
            setDataType('delta7');
        }else if(dataType==='delta7'){
            setDataType('total');
        }else{
            setDataType('delta');
        }
    }

    const setData=()=>{
        if(searchDate){
            setShowData(dateData);
        }else if(district){
            setShowData(stateData.districts[district])
        }else{
            setShowData(stateData);
        }
    }

    useEffect(setData,[searchDate]);

    useEffect(()=>{
        if(district){
            setShowData(stateData.districts[district])
        }else{
            setData()
        }
    },[district]);

    
    return (
        
        <div className="card m-1 col-5"  >
            <div className="card-title row p-2 mt-1">
                <h5 className="state-name col-6" style={{cursor:'pointer'}} onClick={()=>{navigate('detail?sc='+stateCode)}}>{stateName+'('+stateCode+')'}</h5>
                { !searchDate && stateData && stateData.districts && 
                  (<select className="col-5  mr-1" style={{zIndex:'200'}} onChange={(e)=>setDistrict(e.currentTarget.value)}>
                    <option key="s__1" value="" >Select District</option>
                    {
                        Object.keys(stateData.districts).map((d,i)=>(
                            <option key={'s_'+i}>{d}</option>
                        ))
                    }
                    </select>
                   )
                }
            </div>
            <div className="card-body pt-0 d-flex flex-column justify-content-center align-items-center" style={{position:'relative'}}>
                    <h5 className="c-b-text">{dataType.toCapitalize()}</h5>
                    {
                        (!showData || !showData[dataType] || Object.keys(showData[dataType]).length==0) && (<div className="c-b-text">No Data Found.</div>)
                    }
                    
                    {
                        showData && showData[dataType] && ["confirmed","deceased","recovered","tested","vaccinated1","vaccinated2"].map((key,i)=>(
                            <div key={i} className="c-b-text">{key.toCapitalize()} : {showData[dataType][key] || 0}</div>
                        ))
                    }
                    
                    <div className="arrow-btn-right" onClick={changeDataType}>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="arrow-btn-left" onClick={changeDataType}>
                        <i className="fas fa-arrow-left"></i>
                    </div>        
            </div>
        </div>
    );
}

export default StateCard;