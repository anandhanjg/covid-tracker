import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import getReducer from './reducer';
import action from "./action";

const composeEnhancers=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer=combineReducers({
    covidData:getReducer(action.getCovidData),
    covidTimeData:getReducer(action.getCovidTimeData)
});

export default createStore(rootReducer,composeEnhancers(applyMiddleware(thunk)));