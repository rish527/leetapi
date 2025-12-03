// const https = require('https');
import https from 'https';

// ⚠️ REPLACE THESE WITH YOUR ACTUAL COOKIE VALUES
const LEETCODE_SESSION = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYXV0aF91c2VyX2lkIjoiMTIxMjM3OTUiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJhbGxhdXRoLmFjY291bnQuYXV0aF9iYWNrZW5kcy5BdXRoZW50aWNhdGlvbkJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIxZDg0ZTYwNGVkOWEzNGE0YmU4ZDU3N2E4MjNmY2I5YTliNmNlNDczNmM1MTVjYjMxYWEwNGViMTUzOGIxNTk0Iiwic2Vzc2lvbl91dWlkIjoiZTcyNGIzOGQiLCJpZCI6MTIxMjM3OTUsImVtYWlsIjoicmlzaGF2MDMyMDA1QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoicmlzaDUyNyIsInVzZXJfc2x1ZyI6InJpc2g1MjciLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvcmlzaDUyNy9hdmF0YXJfMTc0NTc0NDE2Mi5wbmciLCJyZWZyZXNoZWRfYXQiOjE3NjQ3NDU1NTcsImlwIjoiMTQuMTM5LjIzOC41NCIsImlkZW50aXR5IjoiM2M5ZmM3ZGRlYzliNTg4MjNjMWM5Njc1NmRiZDQ1ZDgiLCJkZXZpY2Vfd2l0aF9pcCI6WyI5YmY0MTgwMWIwNGRlZDlkZTQzZWJjNzNjNzFkOWZhZCIsIjE0LjEzOS4yMzguNTQiXX0.MCjpQODR4zEznf7bW-927JegLb4DdWuEtPtGST3Ed5M";
const CSRF_TOKEN = "Xn8NpCt746iAImfnqLFB4OSFNWq8JDja";

export const getSubmissionDetails = (submissionId) => {
    return new Promise((resolve, reject) => {
        const graphqlQuery = {
            operationName: "submissionDetails",
            variables: {
                submissionId: submissionId
            },
            query: `
                query submissionDetails($submissionId: Int!) {
                    submissionDetails(submissionId: $submissionId) {
                        code
                        timestamp
                        runtimeDisplay
                        memoryDisplay
                        # ✅ Change 'status' to 'statusCode'
                        statusCode 
                        lang {
                            name
                        }
                        question {
                            titleSlug
                        }
                    }
                }
            `
        };

        const options = {
            hostname: 'leetcode.com',
            path: '/graphql/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Crucial for authentication
                'Cookie': `LEETCODE_SESSION=${LEETCODE_SESSION}; csrftoken=${CSRF_TOKEN}`,
                'x-csrftoken': CSRF_TOKEN,
                'Referer': 'https://leetcode.com/',
                'User-Agent': 'Node.js Script'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    const submission = result.data.submissionDetails;

                    if (submission) {
                        resolve(submission);
                    } else {
                        reject(new Error("Submission not found or API error: " + JSON.stringify(result)));
                    }
                } catch (e) {
                    reject(new Error("Failed to parse JSON response: " + e.message));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(`Request error: ${e.message}`));
        });

        // Write the query data to the request body
        req.write(JSON.stringify(graphqlQuery));
        req.end();
    });
};