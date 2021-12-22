export class ApiRequestor{
    static get(url,done){
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.open('GET',url);
        xmlhttp.onreadystatechange=function(){
            if(this.readyState===4 && this.status===200){
                done(this.responseText);
            }
        };
        xmlhttp.send();
    }

    static post(url,data={},done){
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.open('POST',url);
        xmlhttp.onreadystatechange=function(){
            if(this.readyState===4 && this.status===200){
                done(this.responseText);
            }
        };
        xmlhttp.send(JSON.stringify(data));
    }

    static generic(method,url,data={},done){
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.open(method,url);
        xmlhttp.onreadystatechange=function(){
            if(this.readyState===4 && this.status===200){
                done(null,this.responseText);
            }else if(this.readyState===4){
                done('ERROR OCCURED');
            }
        };
        if(data && method!=='GET'){
            xmlhttp.send(JSON.stringify(data));
        }else{
            xmlhttp.send();
        }
    }
}