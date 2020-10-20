const vm = new Vue({
    el:'#weather-content',
    data: {
        active: true,
        current: {},
        date: new Date().toString().split(' '),
        displayWeather: false,
        index: '',
        key: '5a9dcad84d4820c0a683719df65280c8',
        forecast: [],
        location: '',
        places: []
    },
    methods: {
        addCity: function(name, lon, lat) {
            if(this.places.length < 5) {
                this.places.push({ name: name, lon: lon, lat: lat })
                this.isAdded(name)
            } else {
                alert('You can only save a maximum of 5 locations. Must delete one.')
            } 
        },
        removeCity: function(index) {
            if (typeof index === 'object'){
                let pos = this.places.indexOf(index)
                this.places.splice(pos, 1)
            } else {
                this.places.splice(index,1)
                this.active = true
            } 
        },
        getDate: function (date) {
            let d = new Date(date * 1000).toString().split(' ')
            let day = d[1].toUpperCase() + ' ' + d[2]
            return day
        },
        getWeather: function(){
            let url

            if (Number(this.location)) {
               url =  'https://api.openweathermap.org/data/2.5/weather?' + new URLSearchParams({
                    "appid": this.key,
                    "zip": this.location + ',us',
                    "units": 'imperial',
                })
            } else {
                url = 'https://api.openweathermap.org/data/2.5/weather?' + new URLSearchParams({
                    "appid": this.key,
                    "q": this.location,
                    "units": 'imperial',
                })
            }

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    return this.current = {
                        name: data.name,
                        temp: data.main.temp,
                        lat: data.coord.lat,
                        lon: data.coord.lon,
                        feelsLike: data.main.feels_like,
                        humidity: data.main.humidity,
                        windSpeed: data.wind.speed,
                        main: data.weather[0].main,
                        desc: data.weather[0].description
                    }
                })
                .then(current => {
                    this.isAdded(current.name)
                    fetch('https://api.openweathermap.org/data/2.5/onecall?' + new URLSearchParams({
                        "appid": this.key,
                        "lat": current.lat,
                        "lon": current.lon,
                        "units": 'imperial',
                    }))
                        .then(response => response.json())
                        .then(forecast => this.forecast = forecast.daily)
                })  
            this.location = ''
            this.displayWeather = true  
        },
        savedWeather: function(lon, lat, name) {
            fetch('https://api.openweathermap.org/data/2.5/onecall?' + new URLSearchParams({
                "appid": this.key,
                "lat": lat,
                "lon": lon,
                "units": 'imperial',
            }))
                .then(response => response.json())
                .then(data => {
                    this.current.temp = data.current.temp,
                    this.current.lat = data.lat,
                    this.current.lon = data.lon,
                    this.current.feelsLike = data.current.feels_like,
                    this.current.humidity = data.current.humidity,
                    this.current.windSpeed = data.current.wind_speed,
                    this.current.main = data.current.weather[0].main,
                    this.current.desc = data.current.weather[0].description 
                })
            this.current.name = name
            this.isAdded(name)
        },
        isAdded: function (name) {
            let num = 0
            for (const place of this.places) {
                if (place.name === name) {
                    place.isActive = true
                    this.index = this.places.indexOf(place)
                    num += 1
                } else {
                    place.isActive = false
                }
            } 
            if (num === 1) {
                this.active = false;
            } else {
                this.active = true;
            }
        }
    },
})