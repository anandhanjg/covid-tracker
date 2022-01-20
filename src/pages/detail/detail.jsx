import dist from "@testing-library/user-event";
import React,{useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Constants } from "../../utils/const";
import './detail.css';

function  RenderRow({stateData}){
    return (
        <tr>
            {stateData && (stateData.date) && <td>{stateData.date}</td>}
            <td>{stateData.total.confirmed || 0}</td>
            <td>{stateData.total.deceased || 0}</td>
            <td>{stateData.total.recovered || 0}</td>
            <td>
                {
                    <div className="d-flex flex-column justify-content-center">
                        <div>Confirmed : {(stateData && stateData.delta && stateData.delta.confirmed) || 0}</div>
                        <div>Deceased : {(stateData && stateData.delta && stateData.delta.deceased) || 0}</div>
                        <div>Recovered : {(stateData && stateData.delta && stateData.delta.recovered )|| 0}</div>
                    </div>
                }
            </td>
            <td>
                {
                    <div className="d-flex flex-column justify-content-center">
                        <div>Confirmed : {(stateData && stateData.delta7 && stateData.delta7.confirmed) || 0}</div>
                        <div>Deceased : {(stateData && stateData.delta7 && stateData.delta7.deceased) || 0}</div>
                        <div>Recovered : {(stateData && stateData.delta7 && stateData.delta7.recovered )|| 0}</div>
                    </div>
                }
            </td>
        </tr>)
}

function DetailPage(props){
    const [searchParams,setSearchParams]=useSearchParams();
    const [stateCode,setStateCode]=useState(searchParams.get('sc') || null);
    let [covidData,covidTimeData]=useSelector((state)=>[state.covidData,state.covidTimeData]);
    const [stateData,setStateData]=useState(covidData.data[stateCode]);
    const [stateDateData,setStateDateData]=useState(covidTimeData?.data[stateCode]?.dates);
    const [district,setDistrict] = useState('');
    const [listData,setListData]=useState([]);
    const [paginatedData,setPaginatedData]=useState([]);
    // const [searchTxt,setSearchTxt]=useState();
    const [searchDate,setSearchDate]=useState();
    const [page,setPage]=useState(1);
    const [size,setSize]=useState(5);

    

    const [order,setOrder]=useState('');
    const [sortBy,setSortBy]=useState('');

    useEffect(()=>{
        makeListData(searchDate,district);
    },[]);

    // useEffect(()=>{
    //     sortListData();
    // },[order]);

    const changeOrder=(e)=>{
        let [so,or]=e.target.id.split(":::");
        setSortBy(so);
        setOrder(or);
        sortListData(so,or);

        const elems=document.getElementsByClassName('fas');
        for(var i=0;i<elems.length;i++){
            let ele=elems[i];
            ele.style.color='black';
        }
        e.target.style.color='red';
        
    }

    const sortListData=(sortBy,order)=>{
        let lData=[...listData];
        setListData([]);
        if(sortBy=='date'){
            setListData(lData.sort((x,y)=>(new Date(order==1?x.date:y.date)-new Date(order==1?y.date:x.date))));
        }else if(sortBy){
            if(order==1){
                lData=lData.sort((x,y)=>((x.total[sortBy] || 0)-(y.total[sortBy] || 0)));
            }else{
                lData=lData.sort((x,y)=>((y.total[sortBy] || 0)-(x.total[sortBy] || 0)));
            }
            setListData([...lData]);
        }

    }


    const setPagination=()=>{
        let start=(page-1)*size;
        let end=start+size;
        let data=[];

        if(start<=(listData.length-1)){
            if(end>listData.length){
                end=listData.length;
            }
            for(;start<end;start++){
                data.push(listData[start]);
            }
        }
        
        setPaginatedData(data);
    }
    useEffect(()=>{
        setPagination();
    },[listData,page,size]);


    
    const makeListData=(ddate,ddistrict)=>{
        ddistrict = typeof ddistrict!='undefined'?ddistrict : district;
        ddate= typeof ddate!='undefined'?ddate:searchDate;
        if(ddistrict){
            if(stateData.districts[ddistrict]){
                setListData([stateData.districts[ddistrict]]);
            }else{
                setListData([]);
            }
        }else if(ddate){
            if(stateDateData[ddate]){
                setListData([{...stateDateData[ddate],date:ddate}])
            }else{
                setListData([]);
            }        
        }else{
            let dt=Object.keys(stateDateData || []).map((dt,i)=>({...stateDateData[dt],date:dt}))
            setListData(dt)
        }
    }

    if(!stateCode){
        return (
            <h1>Invalid Page.</h1>
        )
    }else if(!covidData || !covidTimeData){
        return (<div>Loading Data...</div>)
    }else{
        return (
            <div>
            <div className="row w-100" style={{border:'1px solid',padding:'10px'}}>
                <h5 className="col-2">{Constants.stateCodeAndNames[stateCode]}</h5>
                <select className="col-1 ml-2 mr-2" value={size} onChange={(e)=>{setSize(e.currentTarget.value)}}>
                    {
                        [5,10,25,50].map((k,i)=>(<option key={'size_'+i} value={k}>{k}</option>))
                    }
                </select>
                <input className="col-2" type='date' value={searchDate} onChange={(e)=>{
                        setSearchDate(e.target.value);
                        setDistrict('');
                        makeListData(e.target.value,'');
                    }}></input>
                {
                    (stateData && <select className="col-3  ml-2" style={{zIndex:'200'}} onChange={(e)=>{
                        setDistrict(e.currentTarget.value);
                        setSearchDate('');
                        makeListData('',e.currentTarget.value);
                    }}>
                    <option key="s__1" value="" >Select District</option>
                    {
                        Object.keys(stateData.districts).map((d,i)=>(
                            <option key={'s_'+i}>{d}</option>
                        ))
                    }
                    </select>)
                }
            </div>
            <div className="w-80 m-1 row p-1 d-flex justify-content-around">
                <table className="table">
                    <thead>
                        <tr>
                            { (!district) && 
                                <td> 
                                    <span>Date</span>
                                    <span style={{padding:"2px"}}>
                                        <i className="fas fa-angle-up m-1 date" id="date:::1" onClick={changeOrder}></i> 
                                        <i className="fas fa-angle-down m-1 date" id="date:::0" onClick={changeOrder}></i> 
                                    </span>    
                                </td>}
                            <td>
                                <span>Confirmed</span> 
                                <span style={{padding:"2px"}}>
                                <i className="fas fa-angle-up m-1 confirmed" id="confirmed:::1" onClick={changeOrder}></i> 
                                <i className="fas fa-angle-down m-1 confirmed" id="confirmed:::0" onClick={changeOrder}></i> 
                                </span>
                            </td>
                            <td>
                                <span>Deceased</span> 
                                <span style={{padding:"2px"}}>
                                <i className="fas fa-angle-up m-1 deceased" id="deceased:::1" onClick={changeOrder}></i> 
                                <i className="fas fa-angle-down m-1 deceased" id="deceased:::0" onClick={changeOrder}></i> 
                                </span>
                            </td>
                            <td>
                                <span>Recovered</span> 
                                <span style={{padding:"2px"}}>
                                    <i className="fas fa-angle-up recovered m-1" id="recovered:::1" onClick={changeOrder}></i> 
                                    <i className="fas fa-angle-down recovered m-1" id="recovered:::0" onClick={changeOrder}></i> 
                                </span>
                                
                            </td>
                            <td>Delta</td>
                            <td>Delta7</td>
                        </tr>
                    </thead>
                    <tbody>
                       {
                         (paginatedData.length!=0) && paginatedData.map((data,i)=>(<RenderRow key={i} stateData={data}></RenderRow>))
                       }
                       {
                           (paginatedData.length==0) && <tr><td colSpan={10} style={{textAlign:'center'}}>No Data Found.</td></tr>
                       }
                    </tbody>
                </table>
            </div>
            { 
              (paginatedData.length!=0) &&  <nav className="d-flex justify-content-center" aria-label="Page navigation">
                    <ul className="pagination">
                        <li className={((page==1)?["page-item","disabled"]:["page-item"]).join(" ")} ><a class="page-link" href="javascript:void(0);" onClick={()=>{
                            setPage(page-1);
                        }}>Previous</a></li>
                        <li className="page-item"><a class="page-link" href="javascript:void(0);">{page}</a></li>
                        <li className={((((page*size)+size)>listData.length)?["page-item","disabled"]:["page-item"]).join(" ")}><a class="page-link" href="javascript:void(0);" onClick={()=>{
                            setPage(page+1);
                        }}>Next</a></li>
                    </ul>
                </nav>
            }
            </div>
        )
    }
    
}

export default DetailPage;