import { useState } from "react"
import axios from 'axios';
import './app.scss'

export default function App() {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#814827');
  const [img, setImg] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!nome || !cor || !img){
      setMensagem('Preencha todos os campos!');
      return;
    }
    const formData = new FormData();
    formData.append('name', nome);
    formData.append('color', cor);
    formData.append('img', img);

    try{
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/temas/criar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMensagem('Tema cadastrado com sucesso!');
      setNome('');
      setCor('#814827');
      setImg(null);
    }catch (err) {
      console.error(err);
      setMensagem('Erro ao cadastrar tema');
    }
  };

  return (
    <>
    <main className="cadastro-tema container">
    <h2>Cadastrar Novo Tema</h2>
    {mensagem && <p className="mensagem">{mensagem}</p>}
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome do tema:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>
      <div>
        <label>Cor do tema:</label>
        <input type="color" value={cor} onChange={(e) => setCor(e.target.value)}/>
      </div>
      <div>
        <label>Imagem de capa:</label>
        <input type="file" accept="image/*" onChange={(e) => setImg(e.target.files[0])} />
      </div>
      <button type="submit">Cadastrar Tema</button>
    </form>
    </main>
    </>
  )
}
