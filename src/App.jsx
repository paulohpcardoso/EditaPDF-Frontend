import { useState } from 'react'
import './App.css'
import axios from 'axios'

const API_URL = 'https://editapdf-backend.onrender.com'

function App() {
  const [pdfFile, setPdfFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [texto, setTexto] = useState('')

  const uploadPDF = async () => {
    const formData = new FormData()
    formData.append('pdf', pdfFile)
    const res = await axios.post(`${API_URL}/upload`, formData)
    setFileName(res.data.filename)
  }

  const desbloquearPDF = async () => {
    const res = await axios.post(`${API_URL}/desbloquear`, { filename: fileName }, { responseType: 'blob' })
    downloadBlob(res.data, `desbloqueado-${fileName}`)
  }

  const adicionarTexto = async () => {
    const res = await axios.post(`${API_URL}/adicionar-texto`, { filename: fileName, texto }, { responseType: 'blob' })
    downloadBlob(res.data, `editado-${fileName}`)
  }

  const downloadBlob = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container">
      <h1>EditaPDF</h1>

      <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
      <button onClick={uploadPDF}>Enviar PDF</button>

      {fileName && <p>Arquivo carregado: {fileName}</p>}

      <input type="text" placeholder="Texto a adicionar" value={texto} onChange={(e) => setTexto(e.target.value)} />
      <button onClick={adicionarTexto}>Adicionar Texto</button>
      <button onClick={desbloquearPDF}>Desbloquear PDF</button>
    </div>
  )
}

export default App
