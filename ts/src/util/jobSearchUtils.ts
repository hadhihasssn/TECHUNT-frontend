import { JobInterface } from "../interface/interfaces";

export function findMostSuitableJobPost(jobPosts: JobInterface[], requiredSkills: string[]) {
    const mostSuitableJobPost :JobInterface[] = []
    for (const jobPost of jobPosts) {
        const score = calculateSuitabilityScore(jobPost.Skills, requiredSkills);
        if (score > 0) {
            mostSuitableJobPost.push(jobPost)
        }
    }
    return mostSuitableJobPost;
}
function calculateSuitabilityScore(skills: string[], requiredSkills: string[]): number {
    let score = 0;
    for (const skill of skills) {
        if (requiredSkills?.includes(skill)) {
            score++;
        }
    }
    return score;
}