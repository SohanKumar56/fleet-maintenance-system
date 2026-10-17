# Fleet Maintenance Management System - Ansible Automation

This directory contains Ansible automation for provisioning, configuration management, and service orchestration of the Fleet Maintenance Management System server nodes.

## Directory Structure

```text
ansible/
├── ansible.cfg                          # Optimal Ansible runtime defaults (UTF-8, local/remote settings)
├── inventory.ini                        # Target node inventory (local, staging, production)
├── playbook.yml                         # Master configuration playbook (idempotent, all 6 prerequisites)
├── first-execution.log                  # Deliverable: First execution log (ok=24, failed=0)
├── templates/                           # Jinja2 templates for configuration and systemd
│   ├── application.env.j2               # Environment variables for Spring Boot backend
│   ├── fleet-maintenance.service.j2     # Systemd service unit definition
│   └── logrotate-fleet.j2               # Logrotate policy for application logs
└── README.md                            # Documentation and execution guide
```

## Server Prerequisites Automated by Playbook

1. **Packages**: `default-jdk-headless` (Java 17 runtime), `nodejs`, `npm`, `docker.io`, `docker-compose-plugin`, `curl`, `git`, `tar`, `ca-certificates`, `logrotate`, `ufw`.
2. **Users & Groups**: System user `fleetapp` and group `fleetapp`, with `docker` group membership for non-root execution.
3. **Folders**: `/opt/fleet-maintenance`, `/opt/fleet-maintenance/releases`, `/etc/fleet-maintenance`, `/var/log/fleet-maintenance`, `/var/lib/fleet-maintenance/data`, `/var/lib/docker-registry`.
4. **Files**: `/etc/fleet-maintenance/application.env`, `/etc/systemd/system/fleet-maintenance.service`, `/etc/logrotate.d/fleet-maintenance`.
5. **Ports**: `8090` (Backend API), `5173` (Frontend portal), `8092` (Docker container), `5000` (Docker registry), `8080` (Jenkins), `22` (SSH).
6. **Services**: `docker.service` (running/enabled), `fleet-maintenance.service` (systemd daemon enabled).

## How to Execute the Playbook

### 1. Syntax Validation
```bash
LC_ALL=C.UTF-8 LANG=C.UTF-8 ansible-playbook -i inventory.ini playbook.yml --syntax-check
```

### 2. Dry-Run / Verification Mode (Check Mode)
```bash
LC_ALL=C.UTF-8 LANG=C.UTF-8 ansible-playbook -i inventory.ini playbook.yml --check -e ansible_become_enabled=false --limit local
```

### 3. Production Deployment Execution (with sudo privileges)
```bash
LC_ALL=C.UTF-8 LANG=C.UTF-8 ansible-playbook -i inventory.ini playbook.yml -K
```