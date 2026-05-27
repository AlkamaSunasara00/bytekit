import React, { useState } from "react";
import { ArrowLeftIcon, CheckIcon, CopyIcon, GitBranchIcon, SearchIcon } from "../icons";

interface GitGuideViewProps {
  onBack: () => void;
  showToast: (msg: string) => void;
}

interface CommandAction {
  id: string;
  label: string;
  commandTemplate: string;
  explanation: string;
  warning?: string;
  variables: string[]; // e.g. ["branch-name"]
}

export const GitGuideView: React.FC<GitGuideViewProps> = ({ onBack, showToast }) => {
  // Step 1: Active Category ID
  const [activeCategory, setActiveCategory] = useState<string>("undo");
  // Step 2: Selected Action ID
  const [selectedActionId, setSelectedActionId] = useState<string>("undo-last-keep");
  
  // Variable Inputs state
  const [varBranchName, setVarBranchName] = useState("feature-branch");
  const [varMessage, setVarMessage] = useState("feat: implement authentication");
  const [varN, setVarN] = useState("3");
  const [varHash, setVarHash] = useState("a1b2c3d");
  const [varFile, setVarFile] = useState("src/App.tsx");
  const [varRemote, setVarRemote] = useState("origin");

  // Cheatsheet search state
  const [cheatsheetSearch, setCheatsheetSearch] = useState("");
  // Emergency accordion active states
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Success indicator for Builder Copy
  const [builderCopied, setBuilderCopied] = useState(false);
  // Success indicator for cheatsheet rows
  const [copiedCheatsheetCmd, setCopiedCheatsheetCmd] = useState<string | null>(null);

  // Action categories
  const categories = [
    { id: "undo", label: "Undo & Fix" },
    { id: "branches", label: "Branches" },
    { id: "remote", label: "Remote & Sync" },
    { id: "commits", label: "Commits" },
    { id: "stash", label: "Stash" },
    { id: "history", label: "History & Log" },
    { id: "rebase", label: "Rebase & Merge" },
    { id: "tags", label: "Tags" },
    { id: "config", label: "Config & Setup" },
  ];

  // Map category to action options
  const actionsMap: Record<string, CommandAction[]> = {
    undo: [
      {
        id: "undo-last-keep",
        label: "Undo last commit (keep changes)",
        commandTemplate: "git reset --soft HEAD~1",
        explanation: "Undoes the last commit on your current branch. Your modified files are preserved in the staging area (as if you had not run git commit).",
        variables: [],
      },
      {
        id: "undo-last-discard",
        label: "Undo last commit (discard changes)",
        commandTemplate: "git reset --hard HEAD~1",
        explanation: "Undoes the last commit and completely throws away all changes made in it.",
        warning: "This is a destructive operation! All uncommitted modifications in that last commit will be permanently lost.",
        variables: [],
      },
      {
        id: "undo-pushed-safe",
        label: "Undo a pushed commit safely",
        commandTemplate: "git revert <hash> && git push",
        explanation: "Creates a new commit that records the exact inverse of the changes in the target commit. Safe for shared remote branches since it preserves history.",
        variables: ["hash"],
      },
      {
        id: "discard-all-local",
        label: "Discard all local changes",
        commandTemplate: "git reset --hard HEAD",
        explanation: "Resets the working directory and staging index to match the current HEAD. Erases all modifications.",
        warning: "Destructive operation! All uncommitted local changes will be lost forever.",
        variables: [],
      },
      {
        id: "remove-file-last-commit",
        label: "Remove a file from last commit",
        commandTemplate: "git rm --cached <file> && git commit --amend --no-edit",
        explanation: "Removes a file from the last commit while keeping it in your local directory (adds it back to untracked state).",
        variables: ["file"],
      },
      {
        id: "fix-last-commit-msg",
        label: "Fix last commit message",
        commandTemplate: "git commit --amend -m \"<message>\"",
        explanation: "Updates the commit message of the most recent commit. Only safe for commits that have not been pushed to shared branches.",
        variables: ["message"],
      },
    ],
    branches: [
      {
        id: "create-branch",
        label: "Create new branch",
        commandTemplate: "git branch <branch-name>",
        explanation: "Creates a new branch pointing to your current active commit.",
        variables: ["branch-name"],
      },
      {
        id: "switch-branch",
        label: "Switch to branch",
        commandTemplate: "git checkout <branch-name>",
        explanation: "Changes your active working copy to match the selected branch.",
        variables: ["branch-name"],
      },
      {
        id: "create-switch-branch",
        label: "Create and switch to branch",
        commandTemplate: "git checkout -b <branch-name>",
        explanation: "Creates a new branch and immediately checks it out.",
        variables: ["branch-name"],
      },
      {
        id: "delete-local-branch",
        label: "Delete local branch",
        commandTemplate: "git branch -d <branch-name>",
        explanation: "Safely deletes a local branch. Prevents deletion if the branch contains unmerged changes.",
        variables: ["branch-name"],
      },
      {
        id: "delete-remote-branch",
        label: "Delete remote branch",
        commandTemplate: "git push <remote> --delete <branch-name>",
        explanation: "Tells the remote repository server to delete the target branch.",
        warning: "Destructive. Other developers on your team will no longer see this branch on remote fetch.",
        variables: ["remote", "branch-name"],
      },
      {
        id: "rename-current-branch",
        label: "Rename current branch",
        commandTemplate: "git branch -m <branch-name>",
        explanation: "Renames the branch you currently have checked out.",
        variables: ["branch-name"],
      },
      {
        id: "list-all-branches",
        label: "List all branches",
        commandTemplate: "git branch -a",
        explanation: "Lists all local and remote-tracking branches available in your repository.",
        variables: [],
      },
    ],
    remote: [
      {
        id: "push-current",
        label: "Push current branch",
        commandTemplate: "git push -u <remote> <branch-name>",
        explanation: "Uploads your local branch commits to the remote repository and sets the upstream tracking target.",
        variables: ["remote", "branch-name"],
      },
      {
        id: "force-push-safe",
        label: "Force push (safely)",
        commandTemplate: "git push --force-with-lease",
        explanation: "Updates the remote history but fails if somebody else has pushed changes since your last fetch.",
        warning: "⚠️ Much safer than --force. Always prefer this over basic --force to avoid overwriting teammate commits.",
        variables: [],
      },
      {
        id: "pull-latest",
        label: "Pull latest changes",
        commandTemplate: "git pull",
        explanation: "Fetches changes from the tracked remote branch and merges them directly into your current local branch.",
        variables: [],
      },
      {
        id: "pull-rebase",
        label: "Pull and rebase",
        commandTemplate: "git pull --rebase",
        explanation: "Fetches remote changes, then plays your local unpushed commits on top of the newly retrieved changes. Keeps a clean linear history.",
        variables: [],
      },
      {
        id: "add-remote",
        label: "Add remote origin",
        commandTemplate: "git remote add origin <message>", // using message field for URL
        explanation: "Links your local repository to a remote server URL named 'origin'.",
        variables: ["message"],
      },
      {
        id: "change-remote-url",
        label: "Change remote URL",
        commandTemplate: "git remote set-url origin <message>",
        explanation: "Modifies the repository endpoint URL for the existing 'origin' remote.",
        variables: ["message"],
      },
      {
        id: "fetch-all-remotes",
        label: "Fetch all remotes",
        commandTemplate: "git fetch --all",
        explanation: "Downloads all tracking branches, references, and objects from every registered remote. Does not modify your local work.",
        variables: [],
      },
    ],
    commits: [
      {
        id: "stage-all",
        label: "Stage all changes",
        commandTemplate: "git add .",
        explanation: "Stages all modifications, deletions, and new untracked files in the current workspace.",
        variables: [],
      },
      {
        id: "stage-file",
        label: "Stage specific file",
        commandTemplate: "git add <file>",
        explanation: "Stages changes of a single targeted file path for the next commit.",
        variables: ["file"],
      },
      {
        id: "commit-msg",
        label: "Commit with message",
        commandTemplate: "git commit -m \"<message>\"",
        explanation: "Saves your staged modifications into a new commit with a descriptive message.",
        variables: ["message"],
      },
      {
        id: "amend-commit",
        label: "Amend last commit",
        commandTemplate: "git commit --amend",
        explanation: "Combines newly staged modifications with the previous commit instead of creating a brand new one.",
        variables: [],
      },
      {
        id: "cherry-pick",
        label: "Cherry-pick a commit",
        commandTemplate: "git cherry-pick <hash>",
        explanation: "Copies the changes introduced by a specific commit hash and commits it directly to your active branch.",
        variables: ["hash"],
      },
      {
        id: "squash-commits",
        label: "Squash last N commits",
        commandTemplate: "git rebase -i HEAD~<N>",
        explanation: "Opens an interactive rebase interface allowing you to squash or rename the last N commits.",
        warning: "Will rewrite history! Do not squash commits that have already been pushed to shared remote branches.",
        variables: ["N"],
      },
      {
        id: "empty-commit",
        label: "Create empty commit",
        commandTemplate: "git commit --allow-empty -m \"<message>\"",
        explanation: "Creates a commit with zero modifications. Often used to trigger CI/CD pipelines.",
        variables: ["message"],
      },
    ],
    stash: [
      {
        id: "stash-changes",
        label: "Stash current changes",
        commandTemplate: "git stash",
        explanation: "Saves both staged and unstaged modifications to a temporary stack and resets the workspace to clean state.",
        variables: [],
      },
      {
        id: "stash-name",
        label: "Stash with a name",
        commandTemplate: "git stash save \"<message>\"",
        explanation: "Stashes your changes and adds a custom description label to make it easy to identify.",
        variables: ["message"],
      },
      {
        id: "list-stashes",
        label: "List all stashes",
        commandTemplate: "git stash list",
        explanation: "Displays all stashes currently stored on the repository stack.",
        variables: [],
      },
      {
        id: "apply-last-stash",
        label: "Apply last stash",
        commandTemplate: "git stash apply",
        explanation: "Restores files from the most recent stash. Does not remove it from the stash stack.",
        variables: [],
      },
      {
        id: "apply-specific-stash",
        label: "Apply specific stash",
        commandTemplate: "git stash apply stash@{<N>}",
        explanation: "Restores files from a specific stash index N.",
        variables: ["N"],
      },
      {
        id: "delete-stash",
        label: "Delete a stash",
        commandTemplate: "git stash drop stash@{<N>}",
        explanation: "Removes a specific stash from the stack permanently.",
        warning: "Destructive. Stashed modifications will be deleted.",
        variables: ["N"],
      },
      {
        id: "apply-drop-stash",
        label: "Apply and drop stash",
        commandTemplate: "git stash pop",
        explanation: "Applies the most recent stash to your working directory and immediately deletes it from the stash stack.",
        variables: [],
      },
    ],
    history: [
      {
        id: "pretty-log",
        label: "Pretty one-line log",
        commandTemplate: "git log --oneline",
        explanation: "Outputs a condensed list of commit messages showing only the first 7 characters of hashes.",
        variables: [],
      },
      {
        id: "log-graph",
        label: "Log with graph",
        commandTemplate: "git log --oneline --graph --all",
        explanation: "Renders an ASCII text graph representation of your commit branches and tag structures.",
        variables: [],
      },
      {
        id: "log-file",
        label: "Log for specific file",
        commandTemplate: "git log --follow -p -- <file>",
        explanation: "Shows full history logs, commits, and diff edits that have affected a specific file path.",
        variables: ["file"],
      },
      {
        id: "show-commit-changes",
        label: "Show a commit's changes",
        commandTemplate: "git show <hash>",
        explanation: "Displays complete descriptions and file diff additions/deletions introduced in a commit hash.",
        variables: ["hash"],
      },
      {
        id: "search-commits-msg",
        label: "Search commits by message",
        commandTemplate: "git log --grep=\"<message>\"",
        explanation: "Searches the commit message database for matching string tokens.",
        variables: ["message"],
      },
      {
        id: "find-line-author",
        label: "Find who changed a line",
        commandTemplate: "git blame <file>",
        explanation: "Annotations printed alongside every line of the file showing the author name and commit hash that modified it last.",
        variables: ["file"],
      },
      {
        id: "show-file-past",
        label: "Show file at past commit",
        commandTemplate: "git show <hash>:<file>",
        explanation: "Prints the full content of a file at a past commit snapshot without checking it out.",
        variables: ["hash", "file"],
      },
    ],
    rebase: [
      {
        id: "rebase-main",
        label: "Rebase onto main",
        commandTemplate: "git rebase main",
        explanation: "Plays your active branch's local commits on top of the 'main' branch HEAD. Keeps history linear.",
        warning: "Never rebase commits that have already been pushed to a public shared remote branch.",
        variables: [],
      },
      {
        id: "interactive-rebase",
        label: "Interactive rebase",
        commandTemplate: "git rebase -i <hash>",
        explanation: "Launches an interactive checklist of commits from the specified hash to rewrite, squash, drop or edit them.",
        variables: ["hash"],
      },
      {
        id: "abort-rebase",
        label: "Abort a rebase",
        commandTemplate: "git rebase --abort",
        explanation: "Completely halts the current rebasing process and restores your local branch to its state before rebasing was started.",
        variables: [],
      },
      {
        id: "continue-rebase",
        label: "Continue after conflict",
        commandTemplate: "git rebase --continue",
        explanation: "Resumes the rebase loop after you have manually resolved all merge conflicts in files and run 'git add'.",
        variables: [],
      },
      {
        id: "merge-branch",
        label: "Merge a branch",
        commandTemplate: "git merge <branch-name>",
        explanation: "Integrates commits from the targeted branch into your active branch.",
        variables: ["branch-name"],
      },
      {
        id: "merge-no-ff",
        label: "Merge with no fast-forward",
        commandTemplate: "git merge --no-ff <branch-name>",
        explanation: "Forces creation of a dedicated merge commit, preserving historical existence of a feature branch.",
        variables: ["branch-name"],
      },
      {
        id: "squash-merge",
        label: "Squash merge",
        commandTemplate: "git merge --squash <branch-name>",
        explanation: "Condenses all feature branch commits into a single commit and merges it to your active branch. Creates a clean log.",
        variables: ["branch-name"],
      },
    ],
    tags: [
      {
        id: "create-light-tag",
        label: "Create lightweight tag",
        commandTemplate: "git tag <branch-name>", // using branch name field for tag name
        explanation: "Creates an unannotated reference pointing to the current commit.",
        variables: ["branch-name"],
      },
      {
        id: "create-annotated-tag",
        label: "Create annotated tag",
        commandTemplate: "git tag -a <branch-name> -m \"<message>\"",
        explanation: "Creates a detailed tag reference containing details, tags description, and dates.",
        variables: ["branch-name", "message"],
      },
      {
        id: "push-tags-remote",
        label: "Push tags to remote",
        commandTemplate: "git push <remote> --tags",
        explanation: "Uploads all your local tags metadata to the remote server.",
        variables: ["remote"],
      },
      {
        id: "delete-local-tag",
        label: "Delete local tag",
        commandTemplate: "git tag -d <branch-name>",
        explanation: "Deletes a tag pointer on your local workspace.",
        variables: ["branch-name"],
      },
      {
        id: "delete-remote-tag",
        label: "Delete remote tag",
        commandTemplate: "git push <remote> --delete tag <branch-name>",
        explanation: "Deletes the tag pointer from the remote repository.",
        variables: ["remote", "branch-name"],
      },
      {
        id: "list-all-tags",
        label: "List all tags",
        commandTemplate: "git tag",
        explanation: "Lists all tag references saved in the repository.",
        variables: [],
      },
    ],
    config: [
      {
        id: "set-username",
        label: "Set global username",
        commandTemplate: "git config --global user.name \"<message>\"",
        explanation: "Configures your global user identity name applied to commits you author.",
        variables: ["message"],
      },
      {
        id: "set-email",
        label: "Set global email",
        commandTemplate: "git config --global user.email \"<message>\"",
        explanation: "Configures your global email address applied to commits.",
        variables: ["message"],
      },
      {
        id: "set-default-branch",
        label: "Set default branch name",
        commandTemplate: "git config --global init.defaultBranch <branch-name>",
        explanation: "Configures git to use the targeted name (e.g. 'main') for new repos initialized locally.",
        variables: ["branch-name"],
      },
      {
        id: "create-gitignore",
        label: "Create .gitignore",
        commandTemplate: "touch .gitignore",
        explanation: "Creates a blank gitignore file to list paths that git should ignore.",
        variables: [],
      },
      {
        id: "init-repo",
        label: "Initialize a repo",
        commandTemplate: "git init",
        explanation: "Initializes a blank local Git repository database inside the current directory.",
        variables: [],
      },
      {
        id: "clone-repo",
        label: "Clone a repo",
        commandTemplate: "git clone <message>",
        explanation: "Clones a remote repository server directory onto your local computer.",
        variables: ["message"],
      },
      {
        id: "show-config",
        label: "Show current config",
        commandTemplate: "git config --list",
        explanation: "Prints all active Git configurations and values resolved in this environment.",
        variables: [],
      },
    ],
  };

  // Cheatsheet commands array
  const cheatsheetData = [
    { cmd: "git init", desc: "Initialize a local Git repository", ex: "git init", grp: "Setup" },
    { cmd: "git clone [url]", desc: "Clone a remote repository directory", ex: "git clone https://github.com/user/repo.git", grp: "Setup" },
    { cmd: "git config --global user.name '[name]'", desc: "Set author name for commits globally", ex: "git config --global user.name 'Jane Doe'", grp: "Setup" },
    { cmd: "git config --global user.email '[email]'", desc: "Set author email globally", ex: "git config --global user.email 'jane@example.com'", grp: "Setup" },
    
    { cmd: "git add [file]", desc: "Stage modifications of a file", ex: "git add index.html", grp: "Staging" },
    { cmd: "git add .", desc: "Stage all modified and new files", ex: "git add .", grp: "Staging" },
    { cmd: "git status", desc: "Check staging states and active branch changes", ex: "git status", grp: "Staging" },
    { cmd: "git diff", desc: "View file additions/deletions index", ex: "git diff", grp: "Staging" },

    { cmd: "git commit -m '[msg]'", desc: "Commit staged modifications", ex: "git commit -m 'feat: add login page'", grp: "Committing" },
    { cmd: "git commit --amend", desc: "Add newly staged changes to previous commit", ex: "git commit --amend --no-edit", grp: "Committing" },
    
    { cmd: "git branch [name]", desc: "Create a new branch pointer", ex: "git branch feature-auth", grp: "Branching" },
    { cmd: "git checkout [name]", desc: "Switch checkout working directory to branch", ex: "git checkout feature-auth", grp: "Branching" },
    { cmd: "git checkout -b [name]", desc: "Create new branch and switch to it", ex: "git checkout -b feature-chat", grp: "Branching" },
    { cmd: "git branch -d [name]", desc: "Delete a local branch", ex: "git branch -d feature-auth", grp: "Branching" },
    { cmd: "git branch -a", desc: "List local and remote tracking branches", ex: "git branch -a", grp: "Branching" },

    { cmd: "git merge [branch]", desc: "Merge target branch into current branch", ex: "git merge feature-auth", grp: "Merging" },
    { cmd: "git merge --squash [branch]", desc: "Squash commits into one and merge", ex: "git merge --squash feature-auth", grp: "Merging" },
    { cmd: "git rebase [branch]", desc: "Rebase active branch commits onto target branch", ex: "git rebase main", grp: "Merging" },

    { cmd: "git push [remote] [branch]", desc: "Push local commits to remote repository", ex: "git push origin main", grp: "Remote" },
    { cmd: "git pull", desc: "Pull remote changes and merge them", ex: "git pull", grp: "Remote" },
    { cmd: "git fetch", desc: "Fetch references and objects from remote", ex: "git fetch origin", grp: "Remote" },
    { cmd: "git remote -v", desc: "List registered remote servers", ex: "git remote -v", grp: "Remote" },

    { cmd: "git reset --soft HEAD~1", desc: "Undo last commit, keeping files staged", ex: "git reset --soft HEAD~1", grp: "Undoing" },
    { cmd: "git reset --hard HEAD~1", desc: "Undo last commit and throw away modifications", ex: "git reset --hard HEAD~1", grp: "Undoing" },
    { cmd: "git checkout -- [file]", desc: "Discard unstaged modifications in a file", ex: "git checkout -- index.html", grp: "Undoing" },
    { cmd: "git revert [commit]", desc: "Create new commit undoing target commit", ex: "git revert c2b3a4", grp: "Undoing" },

    { cmd: "git reflog", desc: "Print local history log of HEAD movements", ex: "git reflog", grp: "Advanced" },
    { cmd: "git cherry-pick [commit]", desc: "Copy commit into current branch", ex: "git cherry-pick e3d4c5", grp: "Advanced" },
    { cmd: "git stash", desc: "Stash modified files temporarily", ex: "git stash", grp: "Advanced" },
    { cmd: "git stash pop", desc: "Apply last stash and delete it from stash", ex: "git stash pop", grp: "Advanced" },
  ];

  // Git Concepts data
  const concepts = [
    {
      title: "HEAD",
      desc: "HEAD is simply a pointer. It points to the current active branch or commit in your repository. Think of it as the 'current cursor' in your git timeline. Changing branch updates HEAD to point to the new branch's latest commit.",
      example: "Usually HEAD points to a branch: e.g. HEAD -> main. If checking out a specific past commit, HEAD becomes detached: e.g. HEAD -> a1b2c3d.",
    },
    {
      title: "Staging Area (Index)",
      desc: "An intermediate sandbox layer between your local working directory and your Git history index. It allows you to select, review, and organize exactly what files and edits you want to commit. You stage edits with git add, and seal them with git commit.",
      example: "Staging all changes with 'git add .', or selectively staging a file with 'git add src/App.tsx'. Allows committing only specific sections of work.",
    },
    {
      title: "Detached HEAD",
      desc: "This state occurs when you check out a specific commit hash directly, rather than checking out a branch reference. Any commits made in this state belong to no branch, and will be abandoned when you switch branches.",
      example: "If you run 'git checkout a1b2c3d', HEAD detaches. To save changes made here, run 'git checkout -b new-saving-branch' to hook them to a branch.",
    },
    {
      title: "Rebase vs Merge",
      desc: "Both commands integrate changes from one branch into another, but do it differently. Merge creates a dedicated new 'merge commit' linking both branches, keeping original history. Rebase copies your local branch commits and replays them on top of the target branch HEAD, producing a flat linear timeline.",
      example: "Use Merge for shared master branches to preserve structural branch history. Use Rebase for local feature branches before merging to keep a clean history.",
    },
    {
      title: "Fast-forward merge",
      desc: "A fast-forward merge occurs when the target branch has no new commits since the source branch split. Git simply slides the target branch pointer forward to match the source branch. No new merge commit is created.",
      example: "Merging feature into main when main had no changes. Main pointer slides forward directly to match feature's HEAD.",
    },
    {
      title: "Git reflog",
      desc: "Reflog records every single movement of the HEAD pointer in your repository. It acts as an absolute safety net: even if you run git reset --hard and lose commits, or delete a branch, the reflog stores everything you did for 90 days.",
      example: "Run 'git reflog' to find the commit hash before a disastrous reset. Then run 'git reset --hard [hash]' to completely recover your files.",
    },
    {
      title: ".gitignore patterns",
      desc: "A plain-text file in your repository telling Git which files and folders to ignore. It uses standard glob syntax patterns to ignore compiled binaries, sensitive configs, vendor directories (like node_modules), or IDE metadata.",
      example: "node_modules/ ignores directory recursively. *.env ignores credentials config files. build/ ignores compiled bundle outputs.",
    },
    {
      title: "SSH vs HTTPS",
      desc: "Two protocols used to pull/push commits from/to Git hosting platforms like GitHub. HTTPS uses standard browser username/password credentials (or personal access tokens). SSH uses public/private cryptography keypairs set up on your machine.",
      example: "HTTPS requires credential inputs or setup helpers. SSH key configuration allows passwordless, secure command execution.",
    },
    {
      title: "Conventional Commits",
      desc: "A lightweight convention on top of commit messages, providing an easy set of rules for creating clear commit history. Standardized as: 'type(scope): description'. Tells team developers and tools what each commit does.",
      example: "feat: add user login API. fix(button): adjust hover alignment padding. chore: update standard webpack loader config.",
    },
    {
      title: "Git bisect",
      desc: "A debugging tool that uses binary search to quickly pinpoint which commit introduced a bug. You tell it a 'bad' commit (e.g. current HEAD) and a 'good' commit (e.g. past release). It checks out commits in between for testing.",
      example: "Start with 'git bisect start', mark current 'git bisect bad', mark past 'git bisect good c2b3a4'. Test the checked out commit, mark good or bad.",
    },
  ];

  // Emergency Kit accordion data
  const emergencyKit = [
    {
      id: "err-commit-main",
      title: "I accidentally committed to main",
      desc: "If you committed changes directly to main locally, but wanted to do it on a feature branch, you can create a feature branch containing your changes and reset main back.",
      cmds: "git branch feature-auth\ngit reset --hard HEAD~1\ngit checkout feature-auth",
      warn: "Only safe if you haven't pushed main to remote yet. Do not reset if pushed.",
    },
    {
      id: "err-pushed-secrets",
      title: "I pushed secrets/passwords to GitHub",
      desc: "Deleting commits with secrets is hard. Running basic commits does not erase them from git history repository. Use git-filter-repo or BFG Repo-Cleaner to delete it from history immediately.",
      cmds: "pip install git-filter-repo\ngit filter-repo --path config.env --invert-paths",
      warn: "⚠️ Rewrites history! Force pushing is required. Tell team members to clone fresh copies.",
    },
    {
      id: "err-deleted-branch",
      title: "I deleted a branch I needed",
      desc: "Even if a branch was deleted locally, the commits are not erased immediately. You can retrieve its latest commit hash from the git reflog and restore it.",
      cmds: "git reflog\n# Look for commit before deletion (e.g. moving from feature)\ngit checkout -b feature-recovered <hash>",
      warn: "Recover as soon as possible before git garbage collector runs.",
    },
    {
      id: "err-rebase-wrong",
      title: "My rebase went wrong",
      desc: "If rebase gets messy, conflicts are too high, or you made a mistake, you can abort the rebase and go back to where you started.",
      cmds: "git rebase --abort",
      warn: "Restores your working directory cleanly.",
    },
    {
      id: "err-lost-uncommitted",
      title: "I lost my uncommitted changes",
      desc: "If you ran git checkout or git reset and lost your uncommitted changes, Git does not keep track of uncommitted files! However, if you at least staged them once, you can find them in Git objects.",
      cmds: "git fsck --lost-found\n# This dumps recovered loose blobs to .git/lost-found/other/",
      warn: "⚠️ If changes were never staged or stashed, they cannot be recovered. Be very careful.",
    },
    {
      id: "err-merge-conflict",
      title: "Merge conflict I can't resolve",
      desc: "If a merge conflict gets out of hand and you need a reset to resolve or plan later, you can abort the merge completely.",
      cmds: "git merge --abort",
      warn: "Resets file states cleanly.",
    },
    {
      id: "err-reset-remote",
      title: "I need to completely reset to remote",
      desc: "If your local branch is completely messed up and you want to match the remote server's branch exactly, fetch remote and hard reset.",
      cmds: "git fetch origin\ngit reset --hard origin/main",
      warn: "⚠️ Destructive! All local commits and unstaged edits on this branch will be deleted.",
    },
    {
      id: "err-wrong-branch",
      title: "I committed to the wrong branch",
      desc: "If you committed to branch A instead of branch B, cherry-pick the commit to branch B, then reset branch A.",
      cmds: "git checkout branch-B\ngit cherry-pick <hash>\ngit checkout branch-A\ngit reset --hard HEAD~1",
      warn: "Rewrites branch-A's history. Only do if unpushed.",
    },
  ];

  // Resolve current builder generated command
  const activeActionList = actionsMap[activeCategory] || [];
  const activeAction = activeActionList.find(a => a.id === selectedActionId) || activeActionList[0];

  const getGeneratedCommand = () => {
    if (!activeAction) return "";
    let cmd = activeAction.commandTemplate;
    cmd = cmd.replace(/<branch-name>/g, varBranchName);
    cmd = cmd.replace(/<message>/g, varMessage);
    cmd = cmd.replace(/<N>/g, varN);
    cmd = cmd.replace(/<hash>/g, varHash);
    cmd = cmd.replace(/<file>/g, varFile);
    cmd = cmd.replace(/<remote>/g, varRemote);
    return cmd;
  };

  const handleCopyBuilder = () => {
    const cmd = getGeneratedCommand();
    navigator.clipboard.writeText(cmd);
    setBuilderCopied(true);
    showToast("Command copied!");
    setTimeout(() => setBuilderCopied(false), 2000);
  };

  const handleCopyCheatsheet = (cmdText: string) => {
    navigator.clipboard.writeText(cmdText);
    setCopiedCheatsheetCmd(cmdText);
    showToast("Command copied!");
    setTimeout(() => setCopiedCheatsheetCmd(null), 2000);
  };

  // Filter cheatsheet
  const filteredCheatsheet = cheatsheetData.filter((row) =>
    row.cmd.toLowerCase().includes(cheatsheetSearch.toLowerCase()) ||
    row.desc.toLowerCase().includes(cheatsheetSearch.toLowerCase()) ||
    row.grp.toLowerCase().includes(cheatsheetSearch.toLowerCase())
  );

  return (
    <div style={{ background: "#FAFAFA", minHeight: "100%", paddingBottom: "80px" }}>
      
      {/* PAGE HEADER */}
      <header style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E4DD", padding: "40px 0" }}>
        <div className="container" style={{ position: "relative" }}>
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              position: "absolute",
              left: "-12px",
              top: "-8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#534AB7",
              background: "#EEEDFE",
              padding: "6px 14px",
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            <ArrowLeftIcon size={14} />
            <span>Back to Tools</span>
          </button>

          <div style={{ marginTop: "40px" }}>
            <h1 style={{ fontSize: "40px", fontFamily: "var(--font-display)", fontWeight: "normal", color: "#2C2C2A", margin: "0 0 8px 0" }}>
              Git Guide
            </h1>
            <p style={{ color: "#888780", fontSize: "16px", margin: 0 }}>
              Every command you need. No more Googling.
            </p>
          </div>
        </div>
      </header>

      {/* SECTION 1: COMMAND BUILDER */}
      <section className="container" style={{ marginTop: "48px" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E4DD", borderRadius: "12px", padding: "32px" }}>
          <h2 style={{ fontSize: "24px", fontFamily: "var(--font-body)", fontWeight: 700, color: "#2C2C2A", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <GitBranchIcon size={22} style={{ color: "#534AB7" }} />
            <span>Build a Git Command</span>
          </h2>

          <div className="builder-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "32px" }}>
            {/* Left Options Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Step 1: Category Selection */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#888780", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                  Step 1 — What do you want to do?
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }} className="builder-cat-grid">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          const acts = actionsMap[cat.id];
                          if (acts && acts.length > 0) {
                            setSelectedActionId(acts[0].id);
                          }
                        }}
                        style={{
                          padding: "10px 8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textAlign: "center",
                          borderRadius: "8px",
                          border: "1px solid",
                          borderColor: isActive ? "#534AB7" : "#E5E4DD",
                          backgroundColor: isActive ? "#EEEDFE" : "#FFFFFF",
                          color: isActive ? "#534AB7" : "#2C2C2A",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Specific Action Selection */}
              {activeCategory && (
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "#888780", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                    Step 2 — Pick specific action
                  </label>
                  <select
                    value={selectedActionId}
                    onChange={(e) => setSelectedActionId(e.target.value)}
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 12px",
                      border: "1px solid #E5E4DD",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "var(--text)",
                      background: "#FFFFFF",
                    }}
                  >
                    {activeActionList.map((action) => (
                      <option key={action.id} value={action.id}>
                        {action.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 3: Variables Fill-in */}
              {activeAction && activeAction.variables.length > 0 && (
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "#888780", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                    Step 3 — Fill in variables
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {activeAction.variables.includes("branch-name") && (
                      <div className="form-group">
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#2C2C2A" }}>Branch Name:</label>
                        <input
                          type="text"
                          value={varBranchName}
                          onChange={(e) => setVarBranchName(e.target.value)}
                          style={{ padding: "8px 12px", border: "1px solid #E5E4DD", borderRadius: "8px", height: "38px" }}
                        />
                      </div>
                    )}
                    {activeAction.variables.includes("message") && (
                      <div className="form-group">
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#2C2C2A" }}>Commit Message / Remote URL:</label>
                        <input
                          type="text"
                          value={varMessage}
                          onChange={(e) => setVarMessage(e.target.value)}
                          style={{ padding: "8px 12px", border: "1px solid #E5E4DD", borderRadius: "8px", height: "38px" }}
                        />
                      </div>
                    )}
                    {activeAction.variables.includes("N") && (
                      <div className="form-group">
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#2C2C2A" }}>Number of Commits (N):</label>
                        <input
                          type="number"
                          value={varN}
                          onChange={(e) => setVarN(e.target.value)}
                          style={{ padding: "8px 12px", border: "1px solid #E5E4DD", borderRadius: "8px", height: "38px" }}
                        />
                      </div>
                    )}
                    {activeAction.variables.includes("hash") && (
                      <div className="form-group">
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#2C2C2A" }}>Commit Hash:</label>
                        <input
                          type="text"
                          value={varHash}
                          onChange={(e) => setVarHash(e.target.value)}
                          style={{ padding: "8px 12px", border: "1px solid #E5E4DD", borderRadius: "8px", height: "38px" }}
                        />
                      </div>
                    )}
                    {activeAction.variables.includes("file") && (
                      <div className="form-group">
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#2C2C2A" }}>File Path:</label>
                        <input
                          type="text"
                          value={varFile}
                          onChange={(e) => setVarFile(e.target.value)}
                          style={{ padding: "8px 12px", border: "1px solid #E5E4DD", borderRadius: "8px", height: "38px" }}
                        />
                      </div>
                    )}
                    {activeAction.variables.includes("remote") && (
                      <div className="form-group">
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#2C2C2A" }}>Remote Name:</label>
                        <input
                          type="text"
                          value={varRemote}
                          onChange={(e) => setVarRemote(e.target.value)}
                          style={{ padding: "8px 12px", border: "1px solid #E5E4DD", borderRadius: "8px", height: "38px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Output Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: 700, color: "#888780", textTransform: "uppercase", display: "block" }}>
                Step 4 — Generated Command Output
              </label>

              {activeAction && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Dark block */}
                  <div
                    style={{
                      background: "#1E1E2E",
                      borderRadius: "8px",
                      padding: "24px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      minHeight: "100px",
                    }}
                  >
                    <code
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "#F8F8F2",
                        fontSize: "15px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        lineHeight: "1.6",
                      }}
                    >
                      {getGeneratedCommand()}
                    </code>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopyBuilder}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      {builderCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                      <span>{builderCopied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>

                  {/* Explanation text */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p style={{ color: "#2C2C2A", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                      {activeAction.explanation}
                    </p>
                    
                    {activeAction.warning && (
                      <div
                        style={{
                          background: "#FFF5F5",
                          border: "1px solid #FEB2B2",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          color: "#C53030",
                          fontSize: "13px",
                          fontWeight: 600,
                          marginTop: "8px",
                        }}
                      >
                        ⚠️ {activeAction.warning}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SEARCHABLE CHEATSHEET */}
      <section className="container" style={{ marginTop: "56px" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E4DD", borderRadius: "12px", padding: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ fontSize: "24px", fontFamily: "var(--font-body)", fontWeight: 700, color: "#2C2C2A", margin: 0 }}>
              Quick Reference Cheatsheet
            </h2>

            {/* Filter Search Input */}
            <div style={{ position: "relative", width: "300px" }} className="cheatsheet-search-wrapper">
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#888780",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SearchIcon size={16} />
              </span>
              <input
                type="text"
                placeholder="Search cheatsheet commands..."
                value={cheatsheetSearch}
                onChange={(e) => setCheatsheetSearch(e.target.value)}
                style={{
                  width: "100%",
                  height: "38px",
                  padding: "0 12px 0 36px",
                  border: "1px solid #E5E4DD",
                  borderRadius: "8px",
                  fontSize: "13px",
                  background: "#FAFAFA",
                }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: "auto", border: "1px solid #E5E4DD", borderRadius: "8px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E4DD" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: "#888780", fontSize: "12px", textTransform: "uppercase" }}>Category</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: "#888780", fontSize: "12px", textTransform: "uppercase" }}>Command</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: "#888780", fontSize: "12px", textTransform: "uppercase" }}>What it does</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, color: "#888780", fontSize: "12px", textTransform: "uppercase" }}>Example</th>
                  <th style={{ padding: "12px 16px", width: "60px" }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredCheatsheet.length > 0 ? (
                  filteredCheatsheet.map((row, idx) => (
                    <tr
                      key={idx}
                      className="cheatsheet-tr"
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#FAFAFA" : "#FFFFFF",
                        borderBottom: "1px solid #E5E4DD",
                        transition: "background-color 0.15s ease",
                      }}
                    >
                      <td style={{ padding: "14px 16px", fontWeight: 600, color: "#888780", fontSize: "12px" }}>
                        {row.grp}
                      </td>
                      <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: "13px", color: "#534AB7", fontWeight: 600 }}>
                        {row.cmd}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#2C2C2A" }}>
                        {row.desc}
                      </td>
                      <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "#888780" }}>
                        {row.ex}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <button
                          onClick={() => handleCopyCheatsheet(row.cmd)}
                          style={{
                            color: copiedCheatsheetCmd === row.cmd ? "#1D9E75" : "#888780",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Copy command"
                        >
                          {copiedCheatsheetCmd === row.cmd ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#888780" }}>
                      No commands found matching "{cheatsheetSearch}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 3: GIT CONCEPTS EXPLAINED */}
      <section className="container" style={{ marginTop: "56px" }}>
        <h2 style={{ fontSize: "28px", fontFamily: "var(--font-body)", fontWeight: 700, color: "#2C2C2A", marginBottom: "24px" }}>
          Git Concepts Explained
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="concepts-grid">
          {concepts.map((concept, idx) => (
            <div
              key={idx}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E4DD",
                borderRadius: "12px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontFamily: "var(--font-body)", fontWeight: 700, color: "#534AB7", margin: 0 }}>
                {concept.title}
              </h3>
              <p style={{ color: "#2C2C2A", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                {concept.desc}
              </p>
              <div
                style={{
                  background: "#FAFAFA",
                  borderLeft: "3px solid #E5E4DD",
                  padding: "10px 14px",
                  fontSize: "13px",
                  color: "#888780",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <strong>Example:</strong> {concept.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: GIT WORKFLOWS */}
      <section className="container" style={{ marginTop: "56px" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E4DD", borderRadius: "12px", padding: "32px" }}>
          <h2 style={{ fontSize: "28px", fontFamily: "var(--font-body)", fontWeight: 700, color: "#2C2C2A", marginBottom: "32px" }}>
            Git Workflows Visualized
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {/* 1. Feature Branch Workflow */}
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#2C2C2A", marginBottom: "16px" }}>
                1. Feature Branch Workflow
              </h3>
              <p style={{ color: "#888780", fontSize: "14px", marginBottom: "20px" }}>
                Developers create a new feature branch from the main branch to write code. Once the feature is complete and reviewed, it is merged back into the main branch.
              </p>
              {/* CSS Diagram */}
              <div style={{ display: "flex", alignItems: "center", minHeight: "120px", position: "relative", background: "#FAFAFA", padding: "20px", borderRadius: "8px", overflowX: "auto" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "40px", width: "100%", position: "relative", minWidth: "400px" }}>
                  {/* Main Line */}
                  <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#534AB7", width: "80px" }}>main</span>
                    {/* line */}
                    <div style={{ height: "3px", backgroundColor: "#534AB7", flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "relative" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#534AB7", position: "absolute", left: "10%" }} />
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#534AB7", position: "absolute", right: "10%" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "#888780", marginLeft: "12px" }}>merge</span>
                  </div>

                  {/* Branch Line */}
                  <div style={{ display: "flex", alignItems: "center", position: "relative", paddingLeft: "120px" }}>
                    {/* diagonal connector */}
                    <div style={{ position: "absolute", left: "80px", top: "-30px", width: "40px", height: "40px", borderLeft: "3px dashed #1D9E75", borderBottom: "3px dashed #1D9E75", borderBottomLeftRadius: "12px" }} />
                    {/* diagonal merge return */}
                    <div style={{ position: "absolute", right: "120px", top: "-30px", width: "40px", height: "40px", borderRight: "3px dashed #1D9E75", borderBottom: "3px dashed #1D9E75", borderBottomRightRadius: "12px" }} />
                    
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#1D9E75", width: "80px" }}>feature</span>
                    <div style={{ height: "3px", backgroundColor: "#1D9E75", flex: 1, display: "flex", alignItems: "center", justifyContent: "space-around", position: "relative" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#1D9E75" }} />
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#1D9E75" }} />
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#1D9E75" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Gitflow Workflow */}
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#2C2C2A", marginBottom: "16px" }}>
                2. Gitflow Workflow
              </h3>
              <p style={{ color: "#888780", fontSize: "14px", marginBottom: "20px" }}>
                A legacy, highly structured workflow model separating commits into permanent `main` (for releases), parallel `develop` (for integration), and temporary short-lived feature or release branches.
              </p>
              {/* CSS Diagram */}
              <div style={{ display: "flex", alignItems: "center", minHeight: "180px", position: "relative", background: "#FAFAFA", padding: "20px", borderRadius: "8px", overflowX: "auto" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: "100%", position: "relative", minWidth: "400px" }}>
                  {/* main */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#534AB7", width: "80px" }}>main</span>
                    <div style={{ height: "3px", backgroundColor: "#534AB7", flex: 1, position: "relative" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#534AB7", position: "absolute", left: "10%", top: "-5px" }} />
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#534AB7", position: "absolute", right: "10%", top: "-5px" }} />
                    </div>
                  </div>

                  {/* develop */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#D85A30", width: "80px" }}>develop</span>
                    <div style={{ height: "3px", backgroundColor: "#D85A30", flex: 1, position: "relative", display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#D85A30", marginTop: "-3px" }} />
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#D85A30", marginTop: "-3px" }} />
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#D85A30", marginTop: "-3px" }} />
                    </div>
                  </div>

                  {/* feature */}
                  <div style={{ display: "flex", alignItems: "center", paddingLeft: "100px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#1D9E75", width: "80px" }}>feature</span>
                    <div style={{ height: "3px", backgroundColor: "#1D9E75", flex: 1, position: "relative", display: "flex", justifyContent: "space-around" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#1D9E75", marginTop: "-2px" }} />
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#1D9E75", marginTop: "-2px" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Trunk-Based Development */}
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#2C2C2A", marginBottom: "16px" }}>
                3. Trunk-Based Development
              </h3>
              <p style={{ color: "#888780", fontSize: "14px", marginBottom: "20px" }}>
                Developers merge extremely small, short-lived feature branches directly into a single central branch ('trunk') multiple times a day. Highly optimized for continuous deployment.
              </p>
              {/* CSS Diagram */}
              <div style={{ display: "flex", alignItems: "center", minHeight: "120px", position: "relative", background: "#FAFAFA", padding: "20px", borderRadius: "8px", overflowX: "auto" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", position: "relative", minWidth: "400px" }}>
                  {/* trunk */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#534AB7", width: "80px" }}>trunk (main)</span>
                    <div style={{ height: "3px", backgroundColor: "#534AB7", flex: 1, display: "flex", justifyContent: "space-between", padding: "0 10px", position: "relative" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#534AB7", marginTop: "-3px" }} />
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#534AB7", marginTop: "-3px" }} />
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#534AB7", marginTop: "-3px" }} />
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#534AB7", marginTop: "-3px" }} />
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#534AB7", marginTop: "-3px" }} />
                    </div>
                  </div>

                  {/* fast merges */}
                  <div style={{ display: "flex", paddingLeft: "120px", gap: "40px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#1D9E75" }} />
                      <span style={{ fontSize: "9px", color: "#1D9E75", marginTop: "2px" }}>feat A</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#1D9E75" }} />
                      <span style={{ fontSize: "9px", color: "#1D9E75", marginTop: "2px" }}>feat B</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#D85A30" }} />
                      <span style={{ fontSize: "9px", color: "#D85A30", marginTop: "2px" }}>hotfix</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: EMERGENCY KIT */}
      <section className="container" style={{ marginTop: "56px" }}>
        <div style={{ border: "2px solid #FEB2B2", borderRadius: "12px", background: "#FFF5F5", padding: "32px" }}>
          <h2 style={{ fontSize: "28px", fontFamily: "var(--font-body)", fontWeight: 800, color: "#C53030", margin: "0 0 4px 0" }}>
            🚨 Git Emergency Kit
          </h2>
          <p style={{ color: "#E53E3E", fontSize: "15px", fontWeight: 500, margin: "0 0 24px 0" }}>
            When things go wrong — here's how to fix it
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {emergencyKit.map((item) => {
              const isOpen = activeAccordion === item.id;
              return (
                <div
                  key={item.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #FEB2B2",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {/* Trigger */}
                  <button
                    onClick={() => setActiveAccordion(isOpen ? null : item.id)}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#C53030",
                      background: isOpen ? "#FFF5F5" : "transparent",
                    }}
                  >
                    <span>• {item.title}</span>
                    <span style={{ fontSize: "12px" }}>{isOpen ? "▼" : "▶"}</span>
                  </button>

                  {/* Panel */}
                  {isOpen && (
                    <div style={{ padding: "20px", borderTop: "1px solid #FEB2B2", display: "flex", flexDirection: "column", gap: "14px" }}>
                      <p style={{ color: "#2C2C2A", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                        {item.desc}
                      </p>

                      <div style={{ background: "#1E1E2E", padding: "16px", borderRadius: "6px", overflowX: "auto" }}>
                        <pre style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "13px", color: "#F8F8F2", lineHeight: "1.5" }}>
                          {item.cmds}
                        </pre>
                      </div>

                      {item.warn && (
                        <div style={{ color: "#9B2C2C", fontSize: "12px", fontWeight: 700 }}>
                          ⚠️ {item.warn}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Table Row Hover effect styling */}
      <style jsx global>{`
        .cheatsheet-tr:hover {
          background-color: #F4F3FF !important;
        }
        @media (max-width: 768px) {
          .builder-layout {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .builder-cat-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .concepts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
