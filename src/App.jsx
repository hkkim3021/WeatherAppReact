import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('') // stores the city typed into search box
  const [weather, setWeather] = useState(null) // stores the weather data returned by the API
  const [error, setError] = useState('') // stores an error message if the search fails
  const [locations, setLocations] = useState([]) // locations will hold matching places from API; setLocations will update; list starts empty

  const apiKey = '46a5dcdf123616ec7cbf371f7577cc81'

  async function handleSearch() {
    if (city.trim() === '') {
      setError('Please enter a city.')
      return
    }

    try {
      setError('')
      setWeather(null)
      setLocations([])

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${apiKey}`
      )

      if (!response.ok) {
        throw new Error('Unable to find locations.')
      }

      const data = await response.json()

      if (data.length === 0) {
        throw new Error('No locations found.')
      }

      setLocations(data)

    } catch (err) {
      setWeather(null)
      setError(err.message)
    }
  }
  {/*<div> becomes <form> because forms support submission when user presses Enter
    - onSubmit calls existing handleSearch() function. 
    - e.preventDefault() prevents browser from refreshing when form is submitted
    - type="submit" tells button to submit form*/}
  return (
    <div className='main'>
      <h1 className='app_title'>Weather Dashboard</h1>
      <form className='search_box'
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input 
          type='text' 
          id='cityInput' 
          placeholder='Enter city...'
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button id='searchBtn' type='submit'>
          Search
        </button>
      </form>

      {locations.length > 0 && (
        <select
        defaultValue=''
          onChange={async (e) => {
            const selectedLocation = locations[e.target.value]
            
            if (!selectedLocation) return

            try {
              setError('')

              const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&appid=${apiKey}&units=imperial`
              )

              if (!response.ok) {
                throw new Error('Unable to fetch weather.')
              }

              const data = await response.json()
              setWeather(data)
              
            } catch (err) {
              setWeather(null)
              setError(err.message)
            }
          }}
        >
          <option value="">Choose a location</option>

          {locations.map((location, index) => (
            <option key={index} value={index}>
              {location.name}
              {location.state ? `, ${location.state}` : ''},
              {location.country}
            </option>
          ))}
        </select>
      )}

      {error && <p className='error'>{error}</p>}

      {weather && (
        <div id='weatherInfo' className='weather_card'>
          <h2>{weather.name}</h2>
          {/* ?: syntax is a TERNARY operator. A way to choose between two values based on a condition */}
          <p className='weather_icon'> 
            {weather.weather[0].main === 'Clear' ? '☀️':
             weather.weather[0].main === 'Clouds' ? '☁️':
             weather.weather[0].main === 'Rain' ? '🌧️':
             weather.weather[0].main === 'Snow' ? '❄️': '🌡️'}
          </p>
          <p className='temperature'>
            {Math.round(weather.main.temp)}°F
          </p>
          <p>
            {Math.round((weather.main.temp - 32) * 5 / 9)}°C
          </p>
          <p>Condition: {weather.weather[0].description
            .split('')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('')}
          </p>
        </div>
      )}
    </div>
  )
}

export default App
