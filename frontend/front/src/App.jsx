

import { useState, useEffect } from "react";
import axios from "axios";
import './App.css'
const Design = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState("");

  // fetch data from mongodb;
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:5000/api/data");
      setData(response.data);
    }
    fetchData();
  }, []);

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/data", formData);
    setFormData({});
    alert("Data added successfully");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center p-6 pl-10">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-gray-800 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-cyan-400">Futuristic Dashboard</h1>
          <nav>
            <ul className="flex gap-6">
              <li className="hover:text-cyan-400">Home</li>
              <li className="hover:text-purple-400">About</li>
              <li className="hover:text-green-400">Contact</li>
            </ul>
          </nav>
        </header>

        {/* Main Dashboard */}
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data List */}
          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-purple-400">Stored Data</h2>
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
            <h2 className="text-xl font-semibold text-green-400">Add New Data</h2>
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex flex-col space-y-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                Add Data
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Design;
// import {useState, useEffect} from "react"
// import axios from "axios"

// const Design = () =>{
//   const [data, setData] = useState([]);
//   const [formData, setFormData] = useState("");

// // fetch data from mongodb;
//   useEffect(()=>{
//    async function fetchData(){
//     const response = await axios.get("http://localhost:5000/api/data");
//     setData(response.data);
//    }
//    fetchData();
//   },[]);

//   // handle form submission
//   const handleSubmit = async(e) =>{
//     e.prevenDefault();
//     await axios.post('"http://localhost:5000/api/data", formData')
//     setFormData({});
//     alert("data added succefully");
//   }


//   return (
//     <div className="bg-gray-900 text-white min-h-screen p-6">
//       {/* Header */}
//       <header className="flex justify-between items-center p-4 bg-gray-800 rounded-xl shadow-md">
//         <h1 className="text-3xl font-bold text-cyan-400">Futuristic Dashboard</h1>
//         <nav>
//           <ul className="flex gap-6">
//             <li className="hover:text-cyan-400">Home</li>
//             <li className="hover:text-purple-400">About</li>
//             <li className="hover:text-green-400">Contact</li>
//           </ul>
//         </nav>
//       </header>

//       {/* Main Dashboard */}
//       <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Data List */}
//         <div className="p-6 bg-gray-800 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold text-purple-400">Stored Data</h2>
//           <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
//             {data.map((item) => (
//               <div
//                 key={item._id}
//                 className="p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition"
//               >
//                 <h3 className="text-lg font-semibold text-cyan-300">{item.name}</h3>
//                 <p>{item.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Add Data Form */}
//         <div className="p-6 bg-gray-800 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold text-green-400">Add New Data</h2>
//           <form
//             onSubmit={handleSubmit}
//             className="mt-4 flex flex-col space-y-4"
//           >
//             <input
//               type="text"
//               placeholder="Name"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             />
//             <textarea
//               placeholder="Description"
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             />
//             <button
//               type="submit"
//               className="p-3 bg-green-500 rounded-lg text-white font-bold hover:bg-green-600 transition"
//             >
//               Add Data
//             </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Design;











