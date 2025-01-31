import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const repoSchema = new Schema({
    Topic: {
        type: String,
        required: true,
        maxlength: 100
    },
    TopicDescription: {
        type: String,
        maxlength: 500
    },
    RepoName: {
        type: String,
        required: true,
        maxlength: 100
    },
    RepoUrl: {
        type: String,
        required: true,
        match: /^https?:\/\/(www\.)?github\.com\/.+/
    },
    Stars: {
        type: Number,
        min: 0,
        default: 0
    },
    Description: {
        type: String,
        maxlength: 1000
    },
    Tags: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const Repository = mongoose.model('Repository', repoSchema);
export default Repository;
