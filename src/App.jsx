import { useState } from 'react'

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
          <p>
            Temperature: {Math.round(weather.main.temp)}°F /{'  '}
            {Math.round((weather.main.temp - 32) * 5 / 9)}°C
          </p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  )
}

export default App
