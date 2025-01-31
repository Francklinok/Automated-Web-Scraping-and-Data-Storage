import { useState } from "react";
import axios from "axios";
import './App.css'
// import io from "socket.io-client";
import FindAllTable  from "./component/table"

// const socket = io("http://localhost:3000");

const Design = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false);

  // fetch data from mongodb;
  
  const handleFetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/data");
      setData(response.data);  // Mettre à jour les données avec la réponse
      alert("Données récupérées avec succès");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleFetchRepositoryById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/data/${id}`);
      // Traitement de la réponse pour afficher ou manipuler les données récupérées
      alert("Données du repository récupérées avec succès");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateRepository = async (id, updatedData) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:3000/api/data/${id}`, updatedData);
      // Mettre à jour l'élément dans le tableau des données locales
      setData(data.map(item => item._id === id ? response.data : item));
      alert("Repository mis à jour avec succès");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/data", formData);
      setData([...data, response.data]);
      setFormData({});
      alert("Data added successfully");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/data/${id}`); // Corriger l'URL avec backticks
      setData(data.filter(item => item._id !== id));
    } catch (error) {
      console.log("Error during delete: ", error);
    } finally {
      setLoading(false); // Assure que setLoading est toujours exécuté
    }
  };
  
  const handleOpen = () => {
    handleFetchRepositories();
    setIsOpen(true);
  };
 const handleClose = () =>{
  setIsOpen(false)
 }
  return (
    <div className="flex flex-column bg-gray-900 text-white min-h-screen flex justify-center items-center p-6 pl-10">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-gray-800 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-cyan-400">Futuristic Dashboard</h1>
          {loading && <div className="text-center text-yellow-400">Loading...</div>}

          <nav>
            <ul className="flex gap-6">
              <li className="hover:text-cyan-400">Home</li>
              <li className="hover:text-purple-400">About</li>
              <li className="hover:text-green-400">Contact</li>
            </ul>
          </nav>
        </header>

        {/* Main Dashboard */}
        <main className="">
          {/* Data List */}
          <div className = "mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-2 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-purple-400 text-center pt-0 mt-0">Data</h2>
            <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
              {data.map((item) => (
                <div
                  key={item._id}
                  className="p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition"
                >
                  <h3 className="text-lg font-semibold text-cyan-300">{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Data Form */}
          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-green-400">Search Data</h2>
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex flex-col space-y-4"
            >
              <input
                type="text"
                placeholder="reposName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                type="submit"
                className="p-3 bg-green-500 rounded-lg text-white font-bold hover:bg-green-600 transition"
              >
                Search
              </button>
            </form>
          </div>
          </div>
         
          <div className = "p-4 mt-4 bg-gray-800 flex items-center  justify-center">
            <button
                type="FindAll"
                onClick = {handleOpen}
                className="p-3 bg-cyan-700 place-content-center rounded-lg text-white font-bold hover:bg-cyan-900 transition"
              >
                FindAll
            </button>
            <button
                type="FindAll"
                onClick = {handleOpen}
                className="p-3 ml-4 bg-red-400 place-content-center rounded-lg text-white font-bold hover:bg-red-600 transition"
              >
                Delete
            </button>
          
          </div> 
          {isOpen && <FindAllTable 
                 data  = {data}
                 enclose = {handleClose}
                 />
          }
        </main>
      </div>
      
    </div>
  );
};

export default Design;

