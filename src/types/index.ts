export type SearchType = {
    city: string
    country: string
}

export type CountryType = {
    code: string
    name: string
}

export type Weather = {
    name: string
    main: {
        temp: number
        temp_min: number
        temp_max: number
        humidity: number
    }
}
