import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaTrash } from "react-icons/fa";
import "./tailwind-output.css";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:5000/api/data");
      setData(response.data);
    }
    fetchData();

    // Écoute des mises à jour en temps réel
    socket.on("updateData", (newData) => {
      setData(newData);
    });

    return () => {
      socket.off("updateData");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/data", formData);
    setFormData({ name: "", description: "" });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/data/${id}`);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <header className="flex justify-between items-center p-4 bg-gray-800 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-cyan-400">Futuristic Dashboard</h1>
      </header>

      <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-purple-400">Stored Data</h2>
          <div className="mt-4 max-h-96 overflow-y-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-cyan-400 border-b border-gray-600">
                  <th className="p-2">Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-700">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.description}</td>
                    <td className="p-2">
                      <button className="text-red-400 hover:text-red-600" onClick={() => handleDelete(item._id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-green-400">Add New Data</h2>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button type="submit" className="p-3 bg-green-500 rounded-lg text-white font-bold hover:bg-green-600 transition">
              Add Data
            </button>
          </form>
        </div>
      </main>

      <div className="mt-8 p-6 bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-yellow-400">Statistics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="description.length" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
const io = require("socket.io")(server, {
    cors: { origin: "http://localhost:3000" }
  });
  
  app.post("/api/data", async (req, res) => {
    const newItem = await DataModel.create(req.body);
    const allData = await DataModel.find();
    io.emit("updateData", allData);
    res.json(newItem);
  });
  
  app.delete("/api/data/:id", async (req, res) => {
    await DataModel.findByIdAndDelete(req.params.id);
    const allData = await DataModel.find();
    io.emit("updateData", allData);
    res.sendStatus(200);
  });
  import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaTrash } from "react-icons/fa";
import "./tailwind-output.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/data");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/data", formData);
      setData([...data, response.data]);
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding data:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/data/${id}`);
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <header className="flex justify-between items-center p-2 bg-gray-800 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-cyan-400">Futuristic Dashboard</h1>
      </header>

      {loading && <div className="text-center text-yellow-400">Loading...</div>}

      <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-purple-400">Stored Data</h2>
          <div className="mt-4 max-h-96 overflow-y-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-cyan-400 border-b border-gray-600">
                  <th className="p-2">Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-700">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.description}</td>
                    <td className="p-2">
                      <button
                        className="text-red-400 hover:text-red-600"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-green-400">Add New Data</h2>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button type="submit" className="p-3 bg-green-500 rounded-lg text-white font-bold hover:bg-green-600 transition" disabled={loading}>
              {loading ? "Adding..." : "Add Data"}
            </button>
          </form>
        </div>
      </main>

      <div className="mt-8 p-6 bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-yellow-400">Statistics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="description.length" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default 
/////;

<div class="relative">
  <button type="button" class="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900" aria-expanded="false">
    <span>Solutions</span>
    <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
      <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
    </svg>
  </button>

  <!--
    Flyout menu, show/hide based on flyout menu state.

    Entering: "transition ease-out duration-200"
      From: "opacity-0 translate-y-1"
      To: "opacity-100 translate-y-0"
    Leaving: "transition ease-in duration-150"
      From: "opacity-100 translate-y-0"
      To: "opacity-0 translate-y-1"
  -->
  <div class="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
    <div class="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 shadow-lg ring-gray-900/5">
      <div class="p-4">
        <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
          <div class="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
            <svg class="size-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
          </div>
          <div>
            <a href="#" class="font-semibold text-gray-900">
              Analytics
              <span class="absolute inset-0"></span>
            </a>
            <p class="mt-1 text-gray-600">Get a better understanding of your traffic</p>
          </div>
        </div>
        <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
          <div class="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
            <svg class="size-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
            </svg>
          </div>
          <div>
            <a href="#" class="font-semibold text-gray-900">
              Engagement
              <span class="absolute inset-0"></span>
            </a>
            <p class="mt-1 text-gray-600">Speak directly to your customers</p>
          </div>
        </div>
        <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
          <div class="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
            <svg class="size-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
            </svg>
          </div>
          <div>
            <a href="#" class="font-semibold text-gray-900">
              Security
              <span class="absolute inset-0"></span>
            </a>
            <p class="mt-1 text-gray-600">Your customers&#039; data will be safe and secure</p>
          </div>
        </div>
        <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
          <div class="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
            <svg class="size-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <div>
            <a href="#" class="font-semibold text-gray-900">
              Integrations
              <span class="absolute inset-0"></span>
            </a>
            <p class="mt-1 text-gray-600">Connect with third-party tools</p>
          </div>
        </div>
        <div class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
          <div class="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
            <svg class="size-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <div>
            <a href="#" class="font-semibold text-gray-900">
              Automations
              <span class="absolute inset-0"></span>
            </a>
            <p class="mt-1 text-gray-600">Build strategic funnels that will convert</p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
        <a href="#" class="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100">
          <svg class="size-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path fill-rule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6.39-2.908a.75.75 0 0 1 .766.027l3.5 2.25a.75.75 0 0 1 0 1.262l-3.5 2.25A.75.75 0 0 1 8 12.25v-4.5a.75.75 0 0 1 .39-.658Z" clip-rule="evenodd" />
          </svg>
          Watch demo
        </a>
        <a href="#" class="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100">
          <svg class="size-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clip-rule="evenodd" />
          </svg>
          Contact sales
        </a>
      </div>
    </div>
  </div>
</div>


 {/* <div className=" flex  mt-8 p-6 bg-gray-800 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-yellow-400">Statistics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="description.length" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div> */}
// import React, { useState } from "react";
// import FindAllTable from "./FindAllTable"; // Import du composant à afficher

// const MainComponent = () => {
//   const [isOpen, setIsOpen] = useState(false); // État du modal

//   return (
//     <div className="p-6">
//       {/* Bouton pour ouvrir le modal */}
//       <button 
//         onClick={() => setIsOpen(true)} 
//         className="p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition"
//       >
//         Afficher le Tableau
//       </button>

//       {/* MODAL - Superposition */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white w-4/5 h-4/5 p-6 rounded-lg shadow-lg relative">
//             {/* Bouton pour fermer le modal */}
//             <button 
//               onClick={() => setIsOpen(false)} 
//               className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-black"
//             >
//               ✖
//             </button>

//             {/* Affichage du composant */}
//             <FindAllTable 
//               topicName="JavaScript Frameworks"
//               topicDescription="Popular JavaScript frameworks for frontend development"
//               repositories={[
//                 {
//                   name: "React",
//                   url: "https://github.com/facebook/react",
//                   stars: 200000,
//                   description: "A JavaScript library for building user interfaces",
//                   tags: ["JavaScript", "Frontend", "UI"],
//                 },
//                 {
//                   name: "Vue.js",
//                   url: "https://github.com/vuejs/vue",
//                   stars: 195000,
//                   description: "The Progressive JavaScript Framework",
//                   tags: ["JavaScript", "Frontend", "Reactive"],
//                 },
//               ]}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainComponent;
