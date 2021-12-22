import { Constants } from './utils/const';
import { useEffect } from 'react';
import {Route,BrowserRouter as Router,Routes} from 'react-router-dom';
import Home from './pages/home/home';
import DetailPage from './pages/detail/detail';
import MainPanel from './pages/panel/panel';
import { connect } from 'react-redux';
import { subscribe } from './redux/subscribe';
import action from './redux/action';
function RouterSection(){
  return (
    <section>
      <Routes>
            <Route path="/" exact element={<Home />}></Route>
            <Route path="detail" exact element={<DetailPage/>} />
            <Route path="*" element={<div>404 Not Found</div>}> </Route>
      </Routes>
    </section>
  );
}
function App(props) {
  useEffect(()=>{
     props.getCovidData('GET',Constants.covidDataUrl,null,action.getCovidData);
     props.getCovidTimeData('GET',Constants.covidDataTimeSeries,null,action.getCovidTimeData);
  },[]);
  return (
    <Router>
      <MainPanel routerSection={<RouterSection/>}></MainPanel>
    </Router>
  );
}

export default connect((state)=>{
    return {
      covidData:state.covidData,
      covidTimeData:state.covidTimeData
    }
},
{
    getCovidData:subscribe,
    getCovidTimeData:subscribe
})(App);
