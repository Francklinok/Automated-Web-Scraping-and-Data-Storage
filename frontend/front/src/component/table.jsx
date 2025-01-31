// import PropTypes from 'prop-types';

// const FindAllTable = ({ onClose, data }) => {
//   return ( 
//     <div className="overflow-x-auto p-4">
//       <div>
//         <button onClick={onClose}>x</button>
//       </div>
//       <table className="min-w-full border border-gray-300">
//         {/* Première ligne : Nom du topic */}
//         <thead>
//           <tr>
//             <th colSpan="6" className="p-4 text-xl font-bold bg-gray-800 text-white text-center">
//               {data.topicName[0]}
//             </th>
//           </tr>
//           {/* Deuxième ligne : Description du topic */}
//           <tr>
//             <th colSpan="6" className="p-3 text-md bg-gray-700 text-white text-center">
//               {data.topicDescription[0]}
//             </th>
//           </tr>
//           {/* Troisième ligne : En-têtes des colonnes */}
//           <tr className="bg-gray-300 text-gray-900">
//             <th className="border px-4 py-2">RepoName</th>
//             <th className="border px-4 py-2">RepoUrl</th>
//             <th className="border px-4 py-2">Stars</th>
//             <th className="border px-4 py-2">Description</th>
//             <th className="border px-4 py-2">Tags</th>
//           </tr>
//         </thead>
//         {/* Corps du tableau */}
//         <tbody>
//           {data.map((repo, index) => (
//             <tr key={index} className="text-center border-b">
//               <td className="border px-4 py-2">{repo.reposName}</td>
//               <td className="border px-4 py-2">
//                 <a href={repo.repoUrl} className="text-blue-500 hover:underline">
//                   {repo.repoUrl}
//                 </a>
//               </td>
//               <td className="border px-4 py-2">{repo.repoStar}</td>
//               <td className="border px-4 py-2">{repo.repoDescription}</td>
//               <td className="border px-4 py-2">{repo.repoTags.join(", ")}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // Validation des props avec PropTypes
// FindAllTable.propTypes = {
//   onClose: PropTypes.func.isRequired, // Fonction pour fermer
//   topicName: PropTypes.string.isRequired, // Nom du topic
//   topicDescription: PropTypes.string, // Description du topic (optionnel)
//   repositories: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired,
//       stars: PropTypes.number,
//       description: PropTypes.string,
//       tags: PropTypes.arrayOf(PropTypes.string) // Tableau de chaînes de caractères
//     })
//   ).isRequired
// };

// // Valeurs par défaut (facultatif)
// FindAllTable.defaultProps = {
//   topicDescription: "Aucune description disponible",
//   repositories: []
// };

// export default FindAllTable;
import PropTypes from 'prop-types';

const FindAllTable = ({ onClose, data }) => {
  // Regrouper les repos par topic
  const groupedData = new Map();

  data.forEach((repo) => {
    if (!groupedData.has(repo.Topic)) {
      groupedData.set(repo.Topic, {
        topicDescription: repo.TopicDescription,
        repos: [],
      });
    }
    groupedData.get(repo.Topic).repos.push(repo);
  });

  return (
    <div className="overflow-x-auto p-4">
      <div>
        <button onClick={onClose}>x</button>
      </div>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-300 text-gray-900">
            <th className="border px-4 py-2">Repo Name</th>
            <th className="border px-4 py-2">Repo URL</th>
            <th className="border px-4 py-2">Stars</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Tags</th>
          </tr>
        </thead>
        <tbody>
          {[...groupedData.entries()].map(([topic, { topicDescription, repos }], topicIndex) => (
            <React.Fragment key={topicIndex}>
              {/* Ligne du topic (affichée une seule fois) */}
              <tr>
                <td colSpan="5" className="p-4 text-xl font-bold bg-gray-800 text-white text-center">
                  {topic}
                </td>
              </tr>
              <tr>
                <td colSpan="5" className="p-3 text-md bg-gray-700 text-white text-center">
                  {topicDescription}
                </td>
              </tr>
              {/* Liste des dépôts */}
              {repos.map((repo, repoIndex) => (
                <tr key={repoIndex} className="text-center border-b">
                  <td className="border px-4 py-2">{repo.RepoName}</td>
                  <td className="border px-4 py-2">
                    <a href={repo.RepoUrl} className="text-blue-500 hover:underline">
                      {repo.RepoUrl}
                    </a>
                  </td>
                  <td className="border px-4 py-2">{repo.Stars}</td>
                  <td className="border px-4 py-2">{repo.Description}</td>
                  <td className="border px-4 py-2">{repo.Tags}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Validation des props avec PropTypes
FindAllTable.propTypes = {
  onClose: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Topic: PropTypes.string.isRequired,
      TopicDescription: PropTypes.string.isRequired,
      RepoName: PropTypes.string.isRequired,
      RepoUrl: PropTypes.string.isRequired,
      Stars: PropTypes.number.isRequired,
      Description: PropTypes.string.isRequired,
      Tags: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FindAllTable;
