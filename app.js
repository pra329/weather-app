const usertab = document.querySelector('[data_userWeather]');
const searchtab = document.querySelector('[data_searchWeather]');
const usercontainer = document.querySelector('.weather-container');
const grantaccesscontainer = document.querySelector('.grant_location_container');
const loadingScreen = document.querySelector('.loading_container');
const searchform = document.querySelector('[data_search_form]');
const userInfoContainer = document.querySelector('.user_info_container');

// Initially Variable Needed
const API_KEY = '404c5aff65b74970de064e56a5313253';
let oldtab = usertab;
oldtab.classList.add('current-tab');
getfromSessionStorage();

function switchTab(newtab){
    if(newtab!=oldtab){
        oldtab.classList.remove('current-tab');
        oldtab = newtab; 
        oldtab.classList.add('current-tab');
        if(!searchform.classList.contains('active')){
            // agr search form vala container invisible hai to visible karo
            userInfoContainer.classList.remove('active');
            grantaccesscontainer.classList.remove('active');
            searchform.classList.add('active');
        }
        else{
            // main phele search vale tab pr tha ab your weather tab visible karna hai
            searchform.classList.remove('active');
            userInfoContainer.classList.remove('active');
            // ab mai your weather vale tab mei aagya hu  toh weather bhi display karna padega so lets check local storage first
            // for coordinates if we have saved them there
            getfromSessionStorage();
        }
    }
}

usertab.addEventListener('click',()=>{
    switchTab(usertab);
});

searchtab.addEventListener('click',()=>{
    switchTab(searchtab);
})

// check if coordinates are alredy present in the session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // local coordinates nhi mile
        grantaccesscontainer.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserweatherInfo(coordinates);
    }
}

async function fetchUserweatherInfo(coordinates) { 
    const {lat,lon} = coordinates;
    // make grant access container invisible
    grantaccesscontainer.classList.remove('active');
    // make loader visible
    loadingScreen.classList.add('active');
    try{
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await result.json();
        console.log(data)
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err) {
        console.log("Errror Found" , err);
    }
}

function  renderWeatherInfo(data){
    // firstly fetch the elements
    const cityName = document.querySelector('[data_city_name]');
    const countryIcon = document.querySelector('[data_country_icon]');
    const desc = document.querySelector('[data_weather_desc]');
    const weatherIcon = document.querySelector('[data_weather_icon]');
    const temp = document.querySelector('[data_temp]');
    const windspeed = document.querySelector('[data_wind_speed]');
    const humidity = document.querySelector('[data_humidity]');
    const clouds = document.querySelector('[data_clouds]');
    cityName.innerHTML = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerHTML = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerHTML = `${data?.main?.temp} °C`;
    windspeed.innerHTML = `${data?.wind?.speed} m/s`;
    humidity.innerHTML =  `${data?.main?.humidity} %`;
    clouds.innerHTML = `${data?.clouds?.all} %`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('Geolocation Is Not Supported');
    }
}

function showPosition(Position){
    const userCoordinates = {
        lat:Position.coords.latitude,
        lon:Position.coords.longitude
    }
    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    fetchUserweatherInfo(userCoordinates);

}

const grantAccessBtn = document.querySelector('[data_grant_access]');
grantAccessBtn.addEventListener('click',getLocation);

const search_input = document.querySelector('[data-Search_Input]');

searchform.addEventListener('submit',function(e){
    e.preventDefault();
    let cityName = search_input.value;
    if(cityName==''){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantaccesscontainer.classList.remove('active');
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err){
        console.log('Error Found');
    }
}