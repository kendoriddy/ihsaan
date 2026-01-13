# GitHub Secrets Setup Guide

Your CI/CD workflow requires 3 secrets to be configured in GitHub:

## Required Secrets

1. **HOST** - Your server's IP address or domain name
2. **USERNAME** - SSH username for your server
3. **SSH_KEY** - Private SSH key to authenticate with your server

## How to Set Up

### Step 1: Get Your SSH Key from the Server

If you already have an SSH key on your server, you can get it:

```bash
# On your server, check if you have an SSH key
cat ~/.ssh/id_rsa
# OR
cat ~/.ssh/id_ed25519
```

If you don't have an SSH key, generate one:

```bash
# On your server
ssh-keygen -t ed25519 -C "github-actions"
# OR if ed25519 is not supported:
ssh-keygen -t rsa -b 4096 -C "github-actions"
```

**Important:** Copy the **private key** (the one that starts with `-----BEGIN OPENSSH PRIVATE KEY-----` or `-----BEGIN RSA PRIVATE KEY-----`)

### Step 2: Add the Public Key to Authorized Keys

Make sure the public key is in your server's authorized_keys:

```bash
# On your server
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
# OR
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each:

   **HOST:**
   - Name: `HOST`
   - Value: Your server IP or domain (e.g., `123.45.67.89` or `yourdomain.com`)

   **USERNAME:**
   - Name: `USERNAME`
   - Value: Your SSH username (e.g., `root`, `ubuntu`, `deploy`)

   **SSH_KEY:**
   - Name: `SSH_KEY`
   - Value: Your **private** SSH key (the entire content including `-----BEGIN...` and `-----END...` lines)

### Step 4: Test the Connection

You can test if the SSH key works by connecting from your local machine:

```bash
ssh -i ~/.ssh/your_private_key username@your-server-ip
```

## Quick Reference

- **HOST**: Server IP or domain
- **USERNAME**: SSH username (usually `root`, `ubuntu`, or your user)
- **SSH_KEY**: Full private key content (keep it secure!)

## Security Notes

⚠️ **Never commit SSH keys to your repository!**
- Only add them as GitHub Secrets
- The private key should never be in your code
- Keep your private keys secure and don't share them

