import { useState, useEffect } from "react";
import axios from "axios";
import './App.css'
import io from "socket.io-client";
import FindAllTable  from "./component/table"

const socket = io("http://localhost:3000");

const Design = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false);

  // fetch data from mongodb;
  useEffect(() => {
    async function fetchData() {
      // setLoading(true)
      const respond = await axios.get("http://localhost:3000/api/data");
      setData(respond.data || "nothing find");
    }
    setLoading(false);

    fetchData();

    socket.on("updateData", (newData) =>{
      setData(newData);
    })
    return ( ) =>{
      socket.off("updateData");
    }
  }, []);

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const  response = await axios.post("http://localhost:3000/api/data", formData);
      setData([...data, response.data])
      setFormData({});
      alert("Data added successfully");
    }catch(error){
      alert(error)
    }
  setLoading(false);
  };

  const handleDelete = (id) =>{
    try{
      setLoading(true)
      axios.delete("https://localhost :3000/api/data/ ${id}" );
      setData(data.filter(item => item._id !== id)) 
    }catch(error){
      console.log(error)
    }
   setLoading(false)
  }
  const handleOpen = () =>{
    setIsOpen(true)
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
                className="p-3 bg-red-400 place-content-center rounded-lg text-white font-bold hover:bg-red-600 transition"
              >
                FindAll
            </button>
          
          </div> 
          {/* {isOpen && <FindAllTable 
                 topicName = {topicName}
                 topicDescription = {topicDescription}
                 repositories  = {data}
                 enclose = {() =>  setIsOpen(false)}
                 />
          } */}
        </main>
      </div>
      
    </div>
  );
};

export default Design;

