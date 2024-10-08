import axios from 'axios';
import { SearchType } from '../types';
import { z } from 'zod';
import { useMemo, useState } from 'react';
//import { object, string, number, Output, parse } from 'valibot';

/* function isWeatherResponse(weather: unknown): weather is Weather {
    return (
        Boolean(weather) &&
        typeof weather === 'object' &&
        typeof (weather as Weather).name === 'string' &&
        typeof (weather as Weather).main.temp === 'number' &&
        typeof (weather as Weather).main.temp_min === 'number' &&
        typeof (weather as Weather).main.temp_max === 'number' &&
        typeof (weather as Weather).main.humidity === 'number'
    )
} */

//Zod
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_min: z.number(),
        temp_max: z.number(),
        humidity: z.number()
    })
})

export type Weather = z.infer<typeof Weather>

//Valibot
/* const WeatherSchema = object({
    name: string(),
    main: object({
        temp: number(),
        temp_min: number(),
        temp_max: number(),
        humidity: number()
    })
})

type Weather = Output<typeof WeatherSchema> */


const initialState = {
    name: '',
    main: {
        temp: 0,
        temp_min: 0,
        temp_max: 0,
        humidity: 0
    }
}

export const useWeather = () => {

    const [weather, setWeather] = useState<Weather>(initialState)
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const fetchWeather = async (search: SearchType) => {
        const appId = import.meta.env.VITE_API_KEY
        setLoading(true)
        setWeather(initialState)
        setNotFound(false)
        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
            const { data } = await axios(geoUrl)

            if (data.length === 0) {
                console.log('No se encontraron resultados')
                setNotFound(true)
                return
            }

            const lat = data[0].lat
            const lon = data[0].lon
            console.log(lat, lon)

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            //1.- Opción: Castear el type
            //const { data: weatherResult } = await axios<Weather>(weatherUrl)
            //console.log(weatherResult.name)
            //console.log(weatherResult.main.temp)

            //2.- Opción: Type Guards
            /* const { data: weatherResult } = await axios(weatherUrl)
            const result = isWeatherResponse(weatherResult)
            if (result) {
                console.log(weatherResult.main.temp)
            } */

            //3.- Opción: Zod
            const { data: weatherResult } = await axios(weatherUrl)
            const result = Weather.safeParse(weatherResult)
            if (result.success) {
                setWeather(result.data)
            }

            //4.- Opción: Valibot
            /* const { data: weatherResult } = await axios(weatherUrl)
            const result = parse(WeatherSchema, weatherResult)
            if (result) {
                console.log(result.name)
            } */


        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const hasWeatherData = useMemo(() => weather.name, [weather])

    return {
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData
    }

}

