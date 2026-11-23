# Repository workflow submission checklist

Use this checklist for the next workflow submission. The repository is currently public at [kalviumcommunity/2627SPR0I-EventTracker](https://github.com/kalviumcommunity/2627SPR0I-EventTracker); verify that the course staff can still open it before recording.

## Before opening a pull request

- [ ] Start from the latest default branch and create a descriptive feature or fix branch.
- [ ] Link the work to the reported [sign-in redirect incident](incident-auth-redirect.md), and add the course tracker URL if there is a separate assigned issue.
- [ ] Make and test the change on the branch.
- [ ] Open a pull request targeting the default branch. Use the repository's pull request template.

## Review and merge

- [ ] Request a review from a teammate.
- [ ] Wait for the teammate to leave a visible review on the pull request.
- [ ] Address comments and record the result before merging.

A direct push to the default branch changes the shared branch without a pull request. It therefore bypasses the pull request's review discussion, approval point, and any pre-merge checks or review requirements configured for that pull request. The commit remains visible in Git history, but there is no pull request for a teammate to review before integration.

**Does work pushed directly to the default branch complete the branch-and-PR workflow? No.** It may put the code on the default branch, but it does not demonstrate a feature branch, pull request, or pre-merge teammate review.

## Recording walkthrough

Show these items on screen rather than describing unrelated application models:

1. The public repository page and its URL.
2. The default branch and the feature branch.
3. The pull request, its target branch, and its incident link.
4. The explanation above of what a direct push bypasses.
5. The teammate's visible review and how any requested changes were handled.
6. The final merge or current PR status.
7. Answer directly: **A direct push to the default branch does not complete the branch-and-PR review workflow.**
