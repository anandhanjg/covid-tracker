
import { ApiRequestor } from "../services/api-request";

export const subscribe= (method,url,data={},types)=>{
    return (dispatch)=>{
        dispatch({type:types.REQ});
        ApiRequestor.generic(method,url,data,(error,resp)=>{
            if(error){
                dispatch({type:types.FAIL,response:error});
            }else{
                try{
                    dispatch({type:types.RES,response:typeof resp=='string'?JSON.parse(resp):resp})
                }catch(err){
                    dispatch({type:types.RES,response:resp})
                }
                
            }
        });
    }
}