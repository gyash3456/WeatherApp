// const async = require("hbs/lib/async");

const submitBtn = document.getElementById("submitBtn");
const cityName = document.getElementById('cityName');
const city_name = document.getElementById("city_name");
const temp_real_val=document.getElementById("temp_real_val");   
const temp_status =document.getElementById('temp_status');
const datahide = document.querySelector(".middle_layer")
// console.log(datahide);

const  getInfo =async(event)=>{
    event.preventDefault();
   cityVal = cityName.value;   
    
if(cityVal===""){
    city_name.innerText ='Please write the name before you search';
     datahide.classList.add("data_hide")
 
}else
try{
    let url =`http://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=35456f795c3925ec9feb0335d0d64077`;
    const response = await fetch(url);
   const data= await response.json();
   const arrData=[data];

    city_name.innerText=`${arrData[0].name}, ${arrData[0].sys.country}`;
   temp_real_val.innerText= arrData[0].main.temp;

//    temp_status.innerText =arrData[0].weather[0].main;
//    let tempMood =arrData[0].weather[0].main;
    let tempMood ="Clouds"
     console.log(response);
    //condition to check sunny or cloudy
    if(tempMood=='Clear'){
        temp_status.innerHTML="<i class= 'fas fa-sun' style='color:#eccc68;'></i>";
    }else if(tempMood=='Clouds'){
        temp_status.innerHTML=  "<i class= 'fas fa-cloud' style='color:#f1f2f6;'></i>";
    }else if(tempMood=='Rain'){
        temp_status.innerHTML= "<i class= 'fas fa-cloud-rain' style='color:#a4b0be;'></i>";
    }else{
        temp_status.innerHTML= "<i class= 'fas fa-cloud' style='color:#eccc68;'></i>";
    }
    datahide.classList.remove('data_hide');
    console.log(datahide);
}catch{  
    city_name.innerText=`Plz enter the city name properly`
    datahide.classList.add('data_hide');
}
}
submitBtn.addEventListener('click',getInfo);