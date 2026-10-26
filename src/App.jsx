import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('') // stores the city typed into search box
  const [weather, setWeather] = useState(null) // stores the weather data returned by the API
  const [error, setError] = useState('') // stores an error message if the search fails

  const apiKey = '46a5dcdf123616ec7cbf371f7577cc81'

  async function handleSearch() {
    if (city.trim() === '') {
      setError('Please enter a city.')
      return
    }

    try {
      setError('')

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`
      )

      if (!response.ok) {
        throw new Error('City not found. Please try again.')
      }

      const data = await response.json()

      setWeather(data)
    } catch (err) {
      setWeather(null)
      setError(err.message)
    }
  }
  
  return (
    <div className='main'>
      <h1 className='app_title'>Weather Dashboard</h1>
      <div className='search_box'>
        <input 
        type='text' 
        id='cityInput' 
        placeholder='Enter city...'
        value={city}
        onChange={(e) => setCity(e.target.value)}
        />
        <button id='searchBtn' onClick={handleSearch}>Search</button>
      </div>


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
