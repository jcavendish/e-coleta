import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';

import api from '../../service/api';

import logo from '../../assets/logo.svg';

import './styles.css';
import { LeafletMouseEvent } from 'leaflet';

interface ItemData {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface PointData {
  name: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, [])

  useEffect(() => {
    async function loadItems() {
      const response = await api.get<ItemData[]>('items');

      setItems(response.data);
    }

    loadItems();
  }, [])

  useEffect(() => {
    async function loadUfs() {
      const response = await axios.get<IBGEUFResponse[]>(
            'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
        );

        setUfs(response.data.map(uf => uf.sigla));
    }

    loadUfs();
  }, [])

  const handleSelectUf = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(event.target.value);
  }, [])

  useEffect(() => {
    async function loadCities() {
      if (selectedUf === '0') return;

      const response = await axios.get<IBGECityResponse[]>(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
        );

      setCities(response.data.map(city => city.nome));
    }

    loadCities();
  }, [selectedUf])

  const handleSelectCity = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  }, [])

  const handleSelectPosition = useCallback((event: LeafletMouseEvent) => {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }, [])

  const handleChangeData = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }, [formData])

  const handleSelectItem = useCallback((id: number) => {
    setSelectedItems(items => {
      if (items.includes(id)) {
        return items.filter(item => item !== id);
      }
      return [...items, id];
    });
  }, [])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    }

    const response = await api.post<PointData>('points', data);

    console.log(response.data.name);

  }, [formData, selectedCity, selectedItems, selectedPosition, selectedUf])

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="logo"/>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleChangeData}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChangeData}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Wathsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleChangeData}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onclick={handleSelectPosition}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {(selectedPosition[0] !== 0 || selectedPosition[1] !== 0) &&
             <Marker position={selectedPosition} />}
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">UF</label>
              <select
                name="uf"
                id="uf"
                onChange={handleSelectUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
              <img src={item.image_url} alt={item.title}/>
              <span>{item.title}</span>
            </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint;
