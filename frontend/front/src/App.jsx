import { useState } from "react";
import axios from "axios";
import './App.css'
// import io from "socket.io-client";
import FindAllTable  from "./component/table"

// const socket = io("http://localhost:3000");
const Design = () => {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false);

  console.log('data',data)
  // fetch data from mongodb;
  
  const handleFetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/repositories");
      setData(response.data);  // Mettre à jour les données avec la réponse
      console.log("Données récupérées avec succès");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };
// fetch repository by name
  const handleFetchRepositoryByName = async (name) => {
    if (!name) {
      console.log('Veuillez entrer un nom de repository');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/repository?repoName=${name}`);
      setFilterData(response.data);
      console.log("Données du repository récupérées avec succès",response.data);
    } catch (error) {
      alert("Erreur : " + error.message); 
    } finally {
      setLoading(false);
    }
  };
  
  
// fetch repository by id
  const handleFetchRepositoryById = async (id) => {
    if(!id){
      console.log('veillez entrer un  nom de repositories');
      return ;
    }
    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:3000/api/data/${id}`);
      setData(response.data);  
      console.log("Données du repository récupérées avec succès");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  //update repository 
  const handleUpdateRepository = async (id, updatedData) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:3000/api/data/${id}`, updatedData);
      setData(data.map(item => item._id === id ? response.data : item));
      console.log("Repository mis à jour avec succès");
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
      console.log("Data added successfully");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRepository = async (id) => {
    try {
        setLoading(true);
        await axios.delete(`http://localhost:3000/api/repositories/${id}`);
        setFilterData(filterData);
        console.log('Successfully deleted filterData: ', filterData);
    } catch (error) {
        console.log("Error during delete: ", error);
    } finally {
        setLoading(false); 
    }
};

  
  const handleOpen = () => {
    handleFetchRepositories();
    setIsOpen(true);
  };
 const handleClose = () =>{
  setIsOpen(false)
 }
 const handleDelete = () =>{
  handleDeleteRepository(filterData._id)
}
  return (
    <div className="relative flex flex-column bg-gray-900 text-white min-h-screen flex justify-center items-center p-6 pl-10">
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
        <main>
          {/* Data List */}
          <div className = "mt-8 rounded-x1 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-2 bg-gray-800  shadow-md">
            <h2 className="text-xl font-semibold text-purple-400 text-center pt-0 mt-0"></h2>
            <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
            {filterData ? (
                <div
                key={filterData._id}
                className="p-4  rounded-lg shadow  transition"
                >
                  <h3 className="text-lg rounded-xl mb-2 bg-gray-700 p-2 font-semibold text-gray-300">Topic :{filterData.Topic}</h3>
                  <p className="text-lg rounded-xl mb-2 bg-gray-700 p-2 font-semibold text-gray-300">Topic-Des: {filterData.TopicDescription}</p>
                  <p className="text-lg rounded-xl mb-2 hover:bg-gray-600 bg-gray-700 p-2 font-semibold text-gray-300" >Repo: <a href={filterData.RepoUrl}>{filterData.RepoName}</a></p>
                  <p className="text-lg rounded-xl mb-2 bg-gray-700 p-2 font-semibold text-gray-300">Stars: {filterData.Stars}</p>
                  <p className="text-lg rounded-xl mb-2 bg-gray-700 p-2 font-semibold text-gray-300">Description: {filterData.Description}</p>
                </div>
              ):""}

             
            </div>
          </div>

          {/* Add Data Form */}
          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-green-400">Search Data</h2>
            <form
             onSubmit={(e) =>{
                e.preventDefault();
                handleFetchRepositoryByName(formData.name)
              }
              }
              className="mt-4 flex flex-col space-y-4"
            >
          
              <input
                type="text"
                placeholder="repos Name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
              <textarea
                placeholder="Description 'optional'"
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
                type="delete"
                onClick = {handleDelete}
                className="p-3 ml-4 bg-red-400 place-content-center rounded-lg text-white font-bold hover:bg-red-600 transition"
              >
                Delete
            </button>
          
          </div> 

          {isOpen && (
              <div className="absolute inset-0 bg-gray-800 bg-opacity-50 z-80 " >
            {/* // <div className="absolute inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center"> */}

              <FindAllTable 
                  className="absolute p-2 z-1000"
                  data  = {data}
                  onClose = {handleClose}
                  />
              </div>
               )}
          
        </main>
      </div>
      
    </div>
  );
};

export default Design;

