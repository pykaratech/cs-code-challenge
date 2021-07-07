
   let obj;
   const APIURL="https://5dc588200bbd050014fb8ae1.mockapi.io/assessment";

   fetchApiData = ()=> {
        fetch(APIURL)
        .then(response => response.json())
        .then(data => {
          if(data=="Not found"){
            alert("API not exist/API Server is down");
          }
          else {
            obj=data;
            loadDom();
          }
        });
   };

   loadDom=()=>{
     let source,template;
     source = document.getElementById("my-template").innerHTML;
     template = Handlebars.compile(source);
     document.getElementById("ul_element").innerHTML=template(obj);
   }

   //load crashed placeholder images
   imgError=(image)=>{
   image.onerror = "";
   image.src = "images/user.jpg";
   return true;
   };

   formatDateTime=(dateTime)=>
   {
    const format1 = "DD-MM-YYYY HH:mm:ss"
    var date1 = new Date(dateTime);
    const dateTime1 = moment(date1).format(format1);
    return dateTime1;
   }

   Handlebars.registerHelper('formatDateTime', (dateTime)=> {
    return formatDateTime(dateTime);
   })
