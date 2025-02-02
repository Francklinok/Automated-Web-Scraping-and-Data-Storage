import mongoose from 'mongoose';

// Defining the Schema object for MongoDB
const Schema = mongoose.Schema;

// Defining the schema for the 'Repository' model
const repoSchema = new Schema({
    // Topic name related to the repository
    Topic: {
        type: String,  // The 'Topic' field is a string
        required: true,  // This field is required
        maxlength: 100  // The maximum length of the topic name
    },
    // Description of the topic
    TopicDescription: {
        type: String,  // The 'TopicDescription' is a string
        maxlength: 500  // Maximum length of the description
    },
    // Repository name
    RepoName: {
        type: String,  // The 'RepoName' is a string
        required: true,  // This field is required
        maxlength: 100  // The maximum length of the repository name
    },
    // URL of the repository
    RepoUrl: {
        type: String,  // The 'RepoUrl' is a string
        required: true,  // This field is required
        match: /^https?:\/\/(www\.)?github\.com\/.+/  // Regex to validate GitHub repository URL
    },
    // Stars received by the repository
    Stars: {
        type: Number,  // The 'Stars' field is a number
        min: 0,  // Minimum value for stars is 0
        default: 0  // Default value if no stars are specified
    },
    // Description of the repository
    Description: {
        type: String,  // The 'Description' is a string
        maxlength: 1000  // Maximum length of the description
    },
    // Tags related to the repository
    Tags: {
        type: [String],  // 'Tags' is an array of strings
        default: []  // Default value is an empty array
    }
}, { timestamps: true });  // Automatically adds 'createdAt' and 'updatedAt' fields

// Creating the 'Repository' model based on the schema
const Repository = mongoose.model('Repository', repoSchema);

// Exporting the model to be used in other parts of the application
export default Repository;









