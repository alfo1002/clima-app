import { FormEvent, useState } from "react"
import { countries } from "../../data/countries"
import styles from './Form.module.css'
import { SearchType } from "../../types"
import { Alert } from "../Alert/Alert"

export const Form = () => {

    const [search, setSearch] = useState<SearchType>({
        city: '',
        country: ''
    })

    const [alert, setAlert] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (Object.values(search).includes('')) {
            setAlert('Todos los campos son obligatorios')
            return
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {alert && <Alert>{alert}</Alert>}
            <div className={styles.field}>
                <label htmlFor="city">Ciudad: </label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Ciudad"
                    value={search.city}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="country">País: </label>
                <select
                    id="country"
                    value={search.country}
                    name="country"
                    onChange={handleChange}
                >
                    <option value="">-- Seleccione un país --</option>
                    {countries.map((country) => (
                        <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                </select>
            </div>
            <input type="submit" value="Buscar Clima" className={styles.submit} />
        </form>
    )
}
