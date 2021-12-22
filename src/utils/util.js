

export const isEmptyObject=(obj)=>(obj==='undefined' || Object.keys(obj).length===0)

export const toCapitalize=(str)=>{
    str[0]=str[0].toUpperCase()
    return str;
}