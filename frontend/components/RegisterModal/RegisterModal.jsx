import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateableSelect from 'react-select/creatable';
import './RegisterModal.scss';

export default function RegisterModal() {
    

  const [formData, setFormData] = useState({
    tema: '',
    medidas: '',
    pessoas: '',
    acabamento: '',
    img: null,
  });


  const [temasExistentes, setTemasExistentes] = useState([]);
  const [selectedTema, setSelectedTema] = useState(null);

  useEffect(() => {
    async function fetchTemas() {
        try {
            const response = await axios.get('http://localhost:5000/temas');
            const options = response.data.map(tema => ({ value: tema.name, label: tema.name }));
            setTemasExistentes(options);
        }catch (err) {
            console.error('Erro ao buscar temas:', err);
        }
    }

    fetchTemas();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'img') {
      setFormData({ ...formData, img: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTemaChange = (selectedOption) => {
    setSelectedTema(selectedOption);
    setFormData({ ...formData, tema: selectedOption.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('tema', formData.tema);
    data.append('medidas', formData.medidas);
    data.append('pessoas', formData.pessoas);
    data.append('acabamento', formData.acabamento);
    data.append('img', formData.img);

    try{
        const res = await axios.post('http://localhost:5100/bolos/criar', data)
         alert('Bolo cadastrado com sucesso!');
    } catch (err) {
        alert('Erro ao cadastrar bolo');
        console.error(err);
    }
  };


  return (

    <>
    <main className='cadastrar-bolo container'>
        <h2>Cadastrar Novo Bolo</h2>
        <form onSubmit={handleSubmit}>
            <label>
                Tema:
                <CreateableSelect
                isClearable
                options={temasExistentes}
                onChange={handleTemaChange}
                value={selectedTema}
                placeholder='Escolha ou digite um tema'
                />
            </label>
            <label >
                Medidas:
                <input type="text" name="medidas" id="medidas" value={formData.medidas} onChange={handleChange} required/>
            </label>
            <label>
                Pessoas:
                <input type="number" name="pessoas" id="pessoas" value={formData.pessoas} onChange={handleChange} required/>
            </label>

            <label>
                Acabamento:
                <input type="text" name="acabamento" id="acabamento" value={formData.acabamento} onChange={handleChange} required/>
            </label>
            <label>
                Imagem:
                <input type="file" name="img" id="img" accept='image/*' onChange={handleChange} required/>
            </label>
            <button type="submit">Cadastrar</button>
        </form>
    </main>
    </>
  )

}
