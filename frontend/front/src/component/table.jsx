import PropTypes from 'prop-types';
import React from "react"

// This component is responsible for displaying a table of repositories grouped by topic.
const FindAllTable = ({ onClose, data }) => {

  // Grouping the repositories by their respective topic
  const groupedData = new Map();

  data.forEach((repo) => {
        // If the topic doesn't exist in the map, we create it with an empty array for repositories.
    if (!groupedData.has(repo.Topic)) {
      groupedData.set(repo.Topic, {
        topicDescription: repo.TopicDescription,
        repos: [],// Initialize an empty array for repositories under this topic.
      });
    }
        // Adding the repository to the appropriate topic group.
    groupedData.get(repo.Topic).repos.push(repo);
  });

  return (
    <div className="">

    <div className="overflow-y-auto max-h-150 p-4">
      <div>
        <button className = 'text-right ' onClick={onClose}>x</button>
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
