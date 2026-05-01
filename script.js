 let searchCityName = document.querySelector(".search-input");
let city = document.querySelectorAll(".city")
let country = document.querySelectorAll(".country")
let feel_like = document.querySelector(".feel")
let temprature = document.querySelector(".big-temp")
let humidity = document.querySelector(".humidity")
let discription = document.querySelector(".big-condition")
let weather_icon = document.querySelector(".weather_icon")
let pressure = document. querySelector(".pressure")
let time = document.querySelector(".date-time")
let visibility = document.querySelector(".visibility")
let windSpeed = document.querySelector(".w_speed")
let sunrise_sh = document.querySelector(".sunrise")
let sunset_sh = document.querySelector(".sunset")
let temp = document.querySelectorAll(".temp")
let hours = document.querySelectorAll(".hours")
let daily = document.querySelectorAll(".day-name")
let max_temp = document.querySelectorAll(".max-temp")
let min_temp = document.querySelectorAll(".min-temp")
let day_icon = document.querySelectorAll(".img")
let display = document.querySelectorAll(".main-container")
let daily_wtr_discription = document.querySelectorAll(".dly-discription")
let loading = document.querySelector(".loading")
let hid_data = document.querySelector(".main-container")
let app_name = document.querySelector("h1")
let daily_w_icon = document.querySelectorAll(".dailyIcon")
let hourlyIcon = document.querySelectorAll(".hourly-w-icon")

searchCityName.addEventListener("keydown",weatherFun)

function weatherFun(event){
  if(event.key === "Enter"){
    loading.classList.add("spinner")
    hid_data.style.display = "none"
    app_name.style.display = "none"
    let searchCity = document.querySelector("#citySearch")
    let cityName = searchCity.value
  // geographycical api 
  let geo = fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
  geo.then((res)=>{
        return res.json()
    }).then((res)=>{
        let latitude = res.results[0].latitude
        let longitude = res.results[0].longitude

        city.forEach((cityElement) => {
          cityElement.innerText = res.results[0].name+","
        });
        country.forEach((countryElement) => {
          countryElement.innerText = res.results[0].country
        })
    // weather api 
    let url = fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,pressure_msl,visibility&hourly=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&forecast_days=7&timezone=auto`);
    
    url.then((res)=>{
      console.log(res)
      return res.json()
    }).then((data)=>{
      loading.classList.remove("spinner")
      for(let i = 0; i < display.length; i++){
        display[i].style.display = "block"
      }
          temprature.innerText = data.current.temperature_2m.toFixed(0) + "°C"
          windSpeed.innerText = data.current.wind_speed_10m + "km/h"
          pressure.innerText = data.current.pressure_msl.toFixed(0) + " hPa"
          humidity.innerText = data.current.relative_humidity_2m + "%"
        
        let vis_cal = data.current.visibility / 1000
          vis_cal = Math.min(vis_cal,10)
          visibility.innerText = vis_cal.toFixed(1) + data.current_units.visibility
        let todayDate = data.daily.sunrise[0]

        function timeFun(curTime){
           let time = new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
            }).format(new Date(curTime))
            return time
        }
// sunrise time 
let sunrise = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(data.daily.sunrise[0]))
sunrise_sh.innerText = sunrise
// sunset time 
let sunset = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(data.daily.sunset[0]))
sunset_sh.innerText = sunset
// currunt time acess  
let current_time = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12 : false
    }).format(new Date(data.current.time))

        
current_time = Number(current_time)
// next 7 hours time 
let collectedTime = []
let count = 0
for(let i = current_time; i < data.hourly.time.length; i++){
  count++
  collectedTime.push(timeFun(data.hourly.time[i]))

  if(count === 7){
    break;
  }
}

count = 0

for(let i = 0; i < hours.length; i++){
  hours[i].innerText = collectedTime[i]
}
// next 7 hours temprature
let collectedTemps = []
for(let i = current_time; i < data.hourly.temperature_2m.length; i++){
  count++
  collectedTemps.push(data.hourly.temperature_2m[i])

  if(count === 7){
    break;
  }

}

for(let i = 0; i < temp.length; i++){
  temp[i].innerText = collectedTemps[i].toFixed() + "°"
}

// date and day 
let collectedDays = []
data.daily.time.forEach((date, i) => {
let day = new Date(date).toLocaleDateString("en-US", {
             weekday: "short",
             day: "2-digit"
            })
            collectedDays.push(day)
           console.log(day)
        })

        for(let i = 0; i < daily.length; i++){
          daily[i].innerText = collectedDays[i]
        }
        // get temprature from api 
function tempGet(temp){
        for(let i = 0; i < temp.length; i++){
            return temp
          }
        }
        // get element from html
function getelement(element){
        for(let i = 0; i < element.length; i++){
          return element
        }
        }
        // innertext function 
function innerTemp(domElement,apiMaxTemp){
        for(let i = 0; i < domElement.length;i++){
               domElement[i].innerText = apiMaxTemp[i].toFixed(0) + "°"
          }
        }
        // maximum temprature 
let getDomElemTempMax = getelement(max_temp)
let getMaxTempMax = tempGet(data.daily.temperature_2m_max)
        innerTemp(getDomElemTempMax,getMaxTempMax)
        // minimum temprature
let getDomElemTempMin = getelement(min_temp)
let getMaxTempMin = tempGet(data.daily.temperature_2m_min)
        innerTemp(getDomElemTempMin,getMaxTempMin)
// about weather discription 
function getWeatherText(code){
    let get_discription = discription.innerText
  if(code === 0){get_discription = "Clear Sky"} 
  else if(code === 1){get_discription = "Mostly Sunny"} 
  else if(code === 2){get_discription = "Partly Cloudy"} 
  else if(code === 3){get_discription = "Mostly Cloudy"} 
  else if(code === 45 || code === 48){discription.innerText = "Fog"} 
  else if(code >= 51 && code <= 57){get_discription ="Drizzle" } 
  else if(code >= 61 && code <= 67){get_discription ="Rain" } 
  else if(code >= 71 && code <= 77){get_discription = "Snow"} 
  else if(code >= 80 && code <= 82){discription.innerText = "Rain Showers"} 
  else if(code >= 85 && code <= 86){get_discription ="Snow Showers" } 
  else if(code >= 95){get_discription = "Thunderstorm"} 
  else {get_discription = "Unknown"}

  return get_discription
}
discription.innerText = getWeatherText(data.daily.weather_code[0])
for(let i = 0; i < data.daily.weather_code.length; i++){
  daily_wtr_discription[i].innerText = getWeatherText(data.daily.weather_code[i])
}
// weather icon codes 
function getIcon(code) {
  if (code === 0) return "01d";
  if (code === 1 || code === 2) return "02d";
  if (code === 3) return "03d";
  if (code >= 45 && code <= 48) return "50d";
  if (code >= 51 && code <= 67) return "10d";
  if (code >= 71 && code <= 77) return "13d";
  if (code >= 80 && code <= 82) return "09d";
  if (code >= 95) return "11d";

  return "01d";
}

// use it
let code = data.daily.weather_code[0]
let icon = getIcon(code)


let iconurl = `https://openweathermap.org/img/wn/${icon}@2x.png`
weather_icon.setAttribute("src", iconurl)

for(let i = 0; i < data.daily.weather_code.length;i++){
  let icon = getIcon(data.daily.weather_code[i])
  let iconurl = `https://openweathermap.org/img/wn/${icon}@2x.png`
  daily_w_icon[i].setAttribute("src", iconurl)
}

// next 7 hours weather icons
count = 0
for(let i = current_time; i < data.hourly.weather_code.length; i++){
  let icon = getIcon(data.hourly.weather_code[i])
  let iconurl = `https://openweathermap.org/img/wn/${icon}@2x.png`
  hourlyIcon[count].setAttribute("src", iconurl)
  
  count++
  if(count === 7){
    break;
  }
}

    })
    }).catch(()=>{
      app_name.style.display = "block"
      loading.classList.remove("spinner")
      app_name.innerText = "404 not found"
      city.forEach((element)=>{
        element.innerText = ""
      })
      country.forEach((element)=>{
        element.innerText = ""
      })
    })
    searchCity.value = ""
}
}
