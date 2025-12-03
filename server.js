import express from 'express';
import { getLast20Submissions } from './getSubmission.js';
import { getSubmissionDetails } from './index.js';

const app = express();
const PORT = 3000;

// Replace with your actual username
// const USERNAME = "rish527";

app.get('/:username', async (req, res) => {
    try {
        const { username } = req.body;
        console.log(`Fetching last 20 submissions for ${username}...`);
        const submissions = await getLast20Submissions(username);

        const detailedSubmissions = [];

        // Fetch code for each submission
        // Note: Fetching sequentially to avoid rate limiting or overwhelming the server, 
        // but could be done in parallel with Promise.all if the API allows.
        for (const sub of submissions) {
            try {
                console.log(`Fetching details for submission ${sub.id}...`);
                const details = await getSubmissionDetails(sub.id);
                detailedSubmissions.push({
                    ...sub,
                    code: details.code,
                    runtime: details.runtimeDisplay,
                    memory: details.memoryDisplay,
                    statusCode: details.statusCode
                });
            } catch (err) {
                console.error(`Failed to fetch details for submission ${sub.id}:`, err.message);
                // Include partial data if details fail
                detailedSubmissions.push({
                    ...sub,
                    error: "Failed to fetch code details"
                });
            }
        }

        res.json({
            username: USERNAME,
            count: detailedSubmissions.length,
            submissions: detailedSubmissions
        });

    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
