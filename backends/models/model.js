
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dataModel = new Schema({
    reposName: {
        type: String,
        required: true,
        maxlength: 100
    },
    reposStar: { // Corrigé ici
        type: Number,
        min: 0
    },
    reposDescription: {
        type: String,
        maxlength: 500 // Corrigé ici
    },
    reposUrl: {
        type: String,
        required: true,
        match: /https?:\/\/(www\.)?github\.com\/.+/
    },
    tags: {
        type: [String],
        default: []
    }
}, { timestamps: true }); // Correction ici

const Repos = mongoose.model('Repositories', dataModel);
export default Repos;
