# Host System DB Frontend on a GCP VM (Compute Engine)

Use this guide when you already have a **VM** and want to run the **web** app with Docker.

| App              | Container port | URL pattern                                              |
| ---------------- | -------------- | -------------------------------------------------------- |
| Web (`apps/web`) | 3000           | `http://YOUR_VM_IP:3000` or `https://www.yourdomain.com` |

The **admin** console lives in a **separate repository** (sibling `admin/` locally) and is deployed independently on port **3001**.

> Prefer Cloud Run for managed scaling? See [DEPLOYMENT-GCP.md](./DEPLOYMENT-GCP.md).

---

## What you need

1. A Google Compute Engine VM (Ubuntu 22.04 LTS recommended, **2 vCPU / 4 GB RAM** minimum)
2. External IP on the VM
3. SSH access (`gcloud compute ssh` or Console SSH)
4. Your backend API URL (if you have one)
5. This frontend repo pushed to GitHub (or another remote you can clone)

---

## Step 1 — Open firewall ports

In Google Cloud Console → **VPC network → Firewall**, create rules (or use `gcloud`):

```bash
# Allow HTTP traffic to web + admin (dev / quick start)
gcloud compute firewall-rules create allow-system-db-frontend \
  --direction=INGRESS \
  --priority=1000 \
  --network=default \
  --action=ALLOW \
  --rules=tcp:3000,tcp:3001,tcp:80,tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=system-db-frontend
```

Attach the tag to your VM:

```bash
gcloud compute instances add-tags YOUR_VM_NAME \
  --zone=YOUR_ZONE \
  --tags=system-db-frontend
```

Also allow these ports in the VM’s **network tags / firewall** if you use a custom VPC.

Find your external IP:

```bash
gcloud compute instances describe YOUR_VM_NAME \
  --zone=YOUR_ZONE \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

---

## Step 2 — SSH into the VM

```bash
gcloud compute ssh YOUR_VM_NAME --zone=YOUR_ZONE
```

Or use **SSH** from the Compute Engine console.

---

## Step 3 — Install Docker on the VM

On Ubuntu:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git

# Docker Engine + Compose plugin
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Apply group (or log out and SSH again)
newgrp docker

docker --version
docker compose version
```

---

## Step 4 — Clone the project

```bash
cd ~
git clone https://github.com/YOUR_ORG/YOUR_REPO.git frontend
cd frontend
```

If the repo is private, use a [GitHub deploy key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys) or a personal access token.

---

## Step 5 — Create production env file

```bash
cp .env.example .env.production
nano .env.production
```

Set values using your **VM external IP** (or domain if you already have one):

```bash
NEXT_PUBLIC_BACKEND_URL=http://YOUR_BACKEND_IP_OR_HOST:3006
NEXT_PUBLIC_SITE_URL=http://YOUR_VM_EXTERNAL_IP:3000
NEXT_PUBLIC_ADMIN_URL=http://YOUR_VM_EXTERNAL_IP:3001
NEXT_PUBLIC_APP_NAME=System DB
NEXT_PUBLIC_APP_ENV=production
```

Example with IP `34.100.20.5`:

```bash
NEXT_PUBLIC_BACKEND_URL=http://34.100.20.5:3006
NEXT_PUBLIC_SITE_URL=http://34.100.20.5:3000
NEXT_PUBLIC_ADMIN_URL=http://34.100.20.5:3001
```

> **Important:** `NEXT_PUBLIC_*` is baked in at **Docker build time**. If you change these URLs later, rebuild:  
> `docker compose -f docker-compose.prod.yml up -d --build`

---

## Step 6 — Build and start both apps

```bash
cd ~/frontend

# Load env vars for compose build args
set -a
source .env.production
set +a

docker compose -f docker-compose.prod.yml up -d --build
```

First build can take **10–20 minutes**.

Check status:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f --tail=100
```

Health checks:

```bash
curl -fsS http://127.0.0.1:3000/api/health
curl -fsS http://127.0.0.1:3001/api/health
```

From your laptop / phone browser:

- Web: `http://YOUR_VM_EXTERNAL_IP:3000`
- Admin: `http://YOUR_VM_EXTERNAL_IP:3001/account/admin/login`

---

## Step 7 — (Recommended) Nginx + HTTPS with a domain

Using only `:3000` / `:3001` is fine for testing. For production, map domains and use SSL.

### 7a. DNS

Create records pointing to the VM external IP:

| Type | Host           | Value                 |
| ---- | -------------- | --------------------- |
| A    | `www` (or `@`) | `YOUR_VM_EXTERNAL_IP` |
| A    | `admin`        | `YOUR_VM_EXTERNAL_IP` |

### 7b. Install Nginx + Certbot

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/system-db`:

```nginx
# Web → localhost:3000
server {
    listen 80;
    server_name www.yourdomain.com yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Admin → localhost:3001
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/system-db /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Issue certificates:

```bash
sudo certbot --nginx -d www.yourdomain.com -d yourdomain.com -d admin.yourdomain.com
```

### 7c. Rebuild with HTTPS URLs

Update `.env.production`:

```bash
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
NEXT_PUBLIC_ADMIN_URL=https://admin.yourdomain.com
```

Then rebuild:

```bash
set -a && source .env.production && set +a
docker compose -f docker-compose.prod.yml up -d --build
```

You can close public access to ports 3000/3001 afterward and only expose 80/443.

---

## Day-to-day operations

### Update to latest code

```bash
cd ~/frontend
bash scripts/deploy-vm.sh
```

Or manually:

```bash
cd ~/frontend
git pull
set -a && source .env.production && set +a
docker compose -f docker-compose.prod.yml up -d --build
```

### Restart

```bash
docker compose -f docker-compose.prod.yml restart
```

### Stop

```bash
docker compose -f docker-compose.prod.yml down
```

### Logs

```bash
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml logs -f admin
```

### Free disk space after several builds

```bash
docker image prune -f
docker builder prune -f
```

---

## Troubleshooting

| Problem                                                        | Fix                                                                                                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Demo / role login succeeds locally but redirects back to login | Accessing over **HTTP** while cookies were `Secure` — fixed by `COOKIE_SECURE=false` / http `NEXT_PUBLIC_SITE_URL`; rebuild after pull |
| Browser can’t connect                                          | Firewall rule missing; check VM has an external IP; security group / tags                                                              |
| `Cannot allocate memory` during build                          | Use a larger machine (e2-standard-2 or bigger) or add swap                                                                             |
| `COPY services ./services` / `"/services": not found`          | Repo was missing tracked `services/` — `git pull` so `services/.gitkeep` exists, then rebuild                                          |
| Admin redirects still use localhost                            | Rebuild after setting `NEXT_PUBLIC_*` correctly                                                                                        |
| API calls fail from browser                                    | `NEXT_PUBLIC_BACKEND_URL` must be reachable from the user’s machine (not only from the VM)                                             |
| Containers exit immediately                                    | `docker compose -f docker-compose.prod.yml logs`                                                                                       |
| Port already in use                                            | `sudo lsof -i :3000` / `:3001` and stop the other process                                                                              |

Add swap (helps small VMs during build):

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Quick checklist

- [ ] Firewall allows 3000/3001 (or 80/443 with Nginx)
- [ ] Docker + Compose installed
- [ ] Repo cloned on the VM
- [ ] `.env.production` has real IP or domain URLs
- [ ] `docker compose -f docker-compose.prod.yml up -d --build` succeeded
- [ ] `/api/health` returns OK on both ports
- [ ] (Optional) Nginx + Certbot for HTTPS domains

---

## CI/CD — automate deploys with GitHub Actions

Workflows in this repo:

| Workflow | File                           | When           | What                                                       |
| -------- | ------------------------------ | -------------- | ---------------------------------------------------------- |
| CI       | `.github/workflows/ci.yml`     | push / PR      | lint, typecheck, build, tests                              |
| Deploy   | `.github/workflows/deploy.yml` | push to `main` | build/push images to GHCR + optional SSH deploy to this VM |

SSH deploy is **opt-in**. Until you finish the checklist below, pushes to `main` only publish Docker images; they do **not** update the VM.

### Prerequisites on the VM (one-time)

Complete Steps 1–6 above so the app already runs on the VM. Then:

```bash
# Confirm path (you will paste this into GitHub variable DEPLOY_PATH)
pwd
# e.g. /home/YOUR_USER/frontend

# Ensure deploy script is executable after next pull
chmod +x scripts/deploy-vm.sh

# Confirm git can pull without prompts (private repos need a deploy key or PAT)
git pull
```

### 1. Create an SSH key for GitHub Actions (on your laptop)

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ./gha_deploy_key -N ""
```

### 2. Install the public key on the VM

```bash
# SSH into the VM, then:
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "PASTE_CONTENTS_OF_gha_deploy_key.pub" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Firewall must allow SSH (`tcp:22`) from the internet (or at least from GitHub Actions IPs if you restrict).

### 3. GitHub → Settings → Environments

Create an environment named **`production`** (the Deploy job uses it).

### 4. GitHub → Settings → Secrets and variables → Actions

#### Repository variables

| Name                    | Example                    | Required                             |
| ----------------------- | -------------------------- | ------------------------------------ |
| `ENABLE_SSH_DEPLOY`     | `true`                     | **Yes** — turns on SSH deploy        |
| `DEPLOY_PATH`           | `/home/YOUR_USER/frontend` | **Yes** — absolute path on the VM    |
| `NEXT_PUBLIC_SITE_URL`  | `http://YOUR_VM_IP:3000`   | Recommended (baked into GHCR images) |
| `NEXT_PUBLIC_ADMIN_URL` | `http://YOUR_VM_IP:3001`   | Recommended                          |
| `APP_NAME`              | `System DB`                | Optional                             |

#### Repository (or `production` environment) secrets

| Name                      | Example                                    | Required                             |
| ------------------------- | ------------------------------------------ | ------------------------------------ |
| `DEPLOY_HOST`             | `34.100.20.5`                              | **Yes** — VM external IP or hostname |
| `DEPLOY_USER`             | `YOUR_LINUX_USER`                          | **Yes**                              |
| `DEPLOY_SSH_KEY`          | _(full private key from `gha_deploy_key`)_ | **Yes**                              |
| `NEXT_PUBLIC_BACKEND_URL` | `http://YOUR_BACKEND:3006`                 | Recommended                          |
| `DEPLOY_URL`              | `http://YOUR_VM_IP:3000`                   | Optional external web health check   |
| `DEPLOY_ADMIN_URL`        | `http://YOUR_VM_IP:3001`                   | Optional external admin health check |

Optional variable: `DEPLOY_SSH_PORT` (default `22`).

> Put SSH secrets on the **`production` environment** if you want approval gates; put `ENABLE_SSH_DEPLOY` and `DEPLOY_PATH` as **repository variables** (the workflow `if:` reads repo vars).

### 5. Private repo access on the VM

If the GitHub repo is private, the VM must `git pull` without a password:

- Add a [GitHub deploy key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys) (read-only) to the VM, **or**
- Use HTTPS remote + a fine-scoped PAT stored in the VM git credential helper.

### 6. Trigger a deploy

```bash
# From your laptop — after merging to main:
git push origin main
```

Or: GitHub → **Actions** → **Deploy – Production** → **Run workflow**.

What runs on success:

1. Build & push `*-web` / `*-admin` images to GHCR
2. SSH into the VM → `bash scripts/deploy-vm.sh`  
   (`git fetch` + `reset --hard origin/main` → load `.env.production` → `docker compose … up -d --build` → local health checks)

### Manual deploy (without CI)

Still works anytime:

```bash
cd ~/frontend
bash scripts/deploy-vm.sh
```

Or the older one-liner:

```bash
cd ~/frontend
git pull
set -a && source .env.production && set +a
docker compose -f docker-compose.prod.yml up -d --build
```

### Troubleshooting CI/CD

| Symptom                                 | Fix                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
| Deploy job shows **SSH deploy skipped** | Set repo variable `ENABLE_SSH_DEPLOY` to exactly `true`                               |
| `DEPLOY_PATH is required`               | Set variable `DEPLOY_PATH` to the absolute clone path on the VM                       |
| SSH permission denied                   | Public key not in `~/.ssh/authorized_keys`; wrong `DEPLOY_USER`; key paste truncated  |
| `git fetch` / pull fails on VM          | Private repo: add deploy key or PAT on the VM                                         |
| Health check fails in Actions           | Open firewall for 3000/3001 (or 80/443); set `DEPLOY_URL` correctly                   |
| Wrong API/site URLs in the app          | Update `.env.production` **on the VM** and redeploy (compose rebuilds from that file) |

---

## Quick start (no CI)

```bash
# On your laptop — open firewall + tag VM (once)
gcloud compute firewall-rules create allow-system-db-frontend \
  --allow=tcp:3000,tcp:3001 --source-ranges=0.0.0.0/0 --target-tags=system-db-frontend
gcloud compute instances add-tags YOUR_VM_NAME --zone=YOUR_ZONE --tags=system-db-frontend

# SSH
gcloud compute ssh YOUR_VM_NAME --zone=YOUR_ZONE

# On the VM
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker
git clone https://github.com/YOUR_ORG/YOUR_REPO.git frontend && cd frontend
cp .env.example .env.production
# edit NEXT_PUBLIC_SITE_URL / ADMIN_URL / BACKEND_URL to use YOUR_VM_IP
set -a && source .env.production && set +a
docker compose -f docker-compose.prod.yml up -d --build
```

Then open `http://YOUR_VM_IP:3000` and `http://YOUR_VM_IP:3001`.
