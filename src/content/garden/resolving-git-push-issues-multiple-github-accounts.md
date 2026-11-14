---
title: "Resolving Git Push Issues with Multiple GitHub Accounts: A Step-by-Step Guide"
description: "Troubleshoot Git push errors caused by mixing up work and personal GitHub accounts by checking credentials, switching to SSH, and updating remote URLs."
date: 2023-02-21
type: Article
status: complete
tags: ["react", "tech", "git", "push issues", "github", "version conrol"]
featured: false
published: true
slug: "resolving-git-push-issues-multiple-github-accounts"
---


Having multiple GitHub accounts, one for work and another for personal projects, can sometimes lead to confusion and permission issues when pushing code to repositories. One common issue arises when attempting to push to a personal repository using the work account credentials. In this blog post, I'll share my experience and provide a step-by-step guide to help you resolve such issues.

## The Problem:

When I initiated a new repository for a personal project and tried to push my code, I encountered the following error:

```bash
git push --set-upstream origin main  
remote: Permission to KundaiClayton/next-trpc-sst.git denied to [WorkGitAccName]. 
fatal: unable to access 'https://github.com/[PersonalGitAccName]/xxxxxx.git/': The requested URL returned error: 403

```
The error message clearly indicated that I was trying to push using the wrong account. To confirm this, I checked the current credentials stored by the Git Credentials Manager using the following command

```bash
echo "protocol=https
host=github.com" | git credential fill
```
Since I specified the HTTPS protocol, the credentials displayed were for my work GitHub account, which is not set up for SSH. The result was as follows::

```bash
protocol=https
host=github.com
username=work-git-acc-name
password=your-password-or-token

```
To view the credentials for my personal GitHub account, which is set up for SSH, I changed the command to:
```bash
echo "protocol=ssh
host=github.com" | git credential fill
```

## The Solution

To resolve the issue, I needed to change the remote URL from HTTPS to SSH. Here's how you can do it:
1. Get the SSH URL of your repository. You can find this on the main page of your repository on GitHub. Click on the "Code" button, then switch to the "SSH" tab and copy the URL.
2. Open your terminal and navigate to your project directory.
3. Run the following command to change the remote URL:
```bash
git remote set-url origin your-ssh-url
```

Replace `your-ssh-url` with the SSH URL you copied from GitHub.
After making this change, I was able to push my code without any problems.

## Conclusion

Managing multiple GitHub accounts can be tricky, but by understanding the root cause of the issue and following the steps outlined above, you can easily resolve permission errors when pushing code to your repositories. This blog post serves as a reminder for me and may also be helpful for others facing similar challenges.
