const initState={
    data:[],
    requesting:false
}

const reducer= ({REQ,RES,FAIL})=>{
    return (state=initState,action)=>{
        switch(action.type){
            case REQ:
                return {
                    ...state,
                    requesting:true
                }
            case RES:
                return {
                    ...state,
                    data:action.response,
                    requesting:false
                }
            case FAIL:
                return {
                    ...state,
                    error:action.response,
                    requesting:false
                }
            default:
                return state;
        }
    }
}

export default reducer;