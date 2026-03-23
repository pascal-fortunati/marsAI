import { insertSubmission } from "../models/submissionModel.js";

export async function createSubmission(payload) {
    const id = await insertSubmission(payload);
    return { id, email: payload.director_email };
}