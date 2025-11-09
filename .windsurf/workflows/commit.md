---
description: add, commit and push to Github
auto_execution_mode: 3
---

# Git Commit Workflow

This workflow automates the git commit process with linting and proper commit message generation.

## Commands

### /commit
- **Description**: Perform a git commit with automatic linting and proper message generation
- **Steps**:
  1. Stage all changes: `git add .`
  2. Run linter: `pnpm linter`
     - If there are linting errors:
       - Auto-fix any fixable issues
       - Show the user the changes made by the linter
       - Ask for confirmation before proceeding
       - If user confirms, stage the changes: `git add .`
       - If user rejects, abort the commit
  3. Generate commit message:
     - Use `git diff --cached --name-status` to see staged changes
     - Create a descriptive commit message following conventional commits format
     - Show the generated message to the user for confirmation
  4. Create commit: `git commit -m "{generated_message}"`
  5. Push changes: `git push`
     - If push fails because the branch doesn't exist remotely, execute the suggested command (e.g., `git push --set-upstream origin <branch-name>`)

## Output
- Show the status after each major step
- Display the final result of the push operation
- If successful, show the commit hash and branch name