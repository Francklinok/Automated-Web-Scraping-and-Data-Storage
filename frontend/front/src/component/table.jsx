import PropTypes from 'prop-types';

const FindAllTable = ({ onClose, topicName, topicDescription, repositories }) => {
  return ( 
    <div className="overflow-x-auto p-4">
      <div>
        <button onClick={onClose}>x</button>
      </div>
      <table className="min-w-full border border-gray-300">
        {/* Première ligne : Nom du topic */}
        <thead>
          <tr>
            <th colSpan="6" className="p-4 text-xl font-bold bg-gray-800 text-white text-center">
              {topicName}
            </th>
          </tr>
          {/* Deuxième ligne : Description du topic */}
          <tr>
            <th colSpan="6" className="p-3 text-md bg-gray-700 text-white text-center">
              {topicDescription}
            </th>
          </tr>
          {/* Troisième ligne : En-têtes des colonnes */}
          <tr className="bg-gray-300 text-gray-900">
            <th className="border px-4 py-2">RepoName</th>
            <th className="border px-4 py-2">RepoUrl</th>
            <th className="border px-4 py-2">Stars</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Tags</th>
          </tr>
        </thead>
        {/* Corps du tableau */}
        <tbody>
          {repositories.map((repo, index) => (
            <tr key={index} className="text-center border-b">
              <td className="border px-4 py-2">{repo.name}</td>
              <td className="border px-4 py-2">
                <a href={repo.url} className="text-blue-500 hover:underline">
                  {repo.url}
                </a>
              </td>
              <td className="border px-4 py-2">{repo.stars}</td>
              <td className="border px-4 py-2">{repo.description}</td>
              <td className="border px-4 py-2">{repo.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Validation des props avec PropTypes
FindAllTable.propTypes = {
  onClose: PropTypes.func.isRequired, // Fonction pour fermer
  topicName: PropTypes.string.isRequired, // Nom du topic
  topicDescription: PropTypes.string, // Description du topic (optionnel)
  repositories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      stars: PropTypes.number,
      description: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string) // Tableau de chaînes de caractères
    })
  ).isRequired
};

// Valeurs par défaut (facultatif)
FindAllTable.defaultProps = {
  topicDescription: "Aucune description disponible",
  repositories: []
};

export default FindAllTable;
