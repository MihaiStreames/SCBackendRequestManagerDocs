# Endpoints Folder Guide

This file explains the structure and purpose of the `/endpoints/` folder, organized by port number.
Each folder corresponds to a specific service, and inside are Markdown files (`.md`) documenting the requests for that service.

### **1. Authentication Service**
- **Folder**: `/endpoints/9130/`
  - **Purpose**: Handles user authentication.
  - **Requests**:
    - `/login_steam.md`: Documenting `POST /v0/login/steam`
    - `/login_xboxlive.md`: Documenting `POST /v1/login/xboxlive`
    - `/login_playstation.md`: Documenting `POST /v0/login/playstation`
    - `/account.md`: Documenting `GET /v0/account`

### **2. Arbiter Service**
- **Folder**: `/endpoints/9110/`
  - **Purpose**: Manages validation, heartbeats, and character selection.
  - **Requests**:
    - `/validate.md`: Documenting `POST /v0/validate`
    - `/heartbeat.md`: Documenting `POST /v0/heartbeat`
    - `/jason_select.md`: Documenting `POST /v0/jason/select`
    - `/xbox_servers_session.md`: Documenting `PUT /v0/xbox/servers/session` (Xbox-specific).

### **3. Instance Authority**
- **Folder**: `/endpoints/9120/`
  - **Purpose**: Handles instance-level reporting and heartbeats.
  - **Requests**:
    - `/instance_report.md`: Documenting `POST /v0/report`
    - `/instance_heartbeat.md`: Documenting `POST /v0/heartbeat`

### **4. Profile Authority**
- **Folder**: `/endpoints/9140/`
  - **Purpose**: Manages profiles, matchmaking, achievements, and stats.
  - **Requests**:
    - **Matchmaking**:
      - `/matchmaking_status.md`: Documenting `GET /v0/matchmaking/status`
    - **Experience and Achievements**:
      - `/experience.md`: Documenting `POST /v1/experience`
      - `/achievements_unlock.md`: Documenting `POST /v0/achievements/unlock`
    - **Infractions**:
      - `/infractions_add.md`: Documenting `POST /v0/infractions/add`
    - **Single Player**:
      - `/singleplayer_profile.md`: Documenting `GET /v0/singleplayer/profile`
      - `/singleplayer_report.md`: Documenting `POST /v0/singleplayer/report`
    - **Purchasing**:
      - `/inventory_purchase.md`: Documenting `POST /v0/inventory/purchase`
    - **Perk Roll**:
      - `/inventory_perks_purchase.md`: Documenting `POST /v1/inventory/perks/purchase`
      - `/inventory_perks_cashin.md`: Documenting `POST /v0/inventory/perks/cashin`
    - **Match Stats**:
      - `/stats_matches_report.md`: Documenting `POST /v0/stats/matches/report`
    - **Player Stats**:
      - `/stats.md`: Documenting `GET /v0/stats`
    - **Player Achievements**:
      - `/achievements.md`: Documenting `GET /v0/achievements`
    - **Pamela Tapes**:
      - `/data_pamelatapes_active.md`: Documenting `GET /v0/data/pamelatapes/active`
      - `/inventory_pamelatapes_add.md`: Documenting `POST /v0/inventory/pamelatapes/add`
    - **Tommy Tapes**:
      - `/data_tommytapes_active.md`: Documenting `GET /v0/data/tommytapes/active`
      - `/inventory_tommytapes_add.md`: Documenting `POST /v0/inventory/tommytapes/add`
    - **Modifiers**:
      - `/data_modifiers.md`: Documenting `GET /v0/data/modifiers`

### **5. News Service**
- **Folder**: `/endpoints/9150/`
  - **Purpose**: Fetches news updates.
  - **Requests**:
    - `/news.md`: Documenting `GET /v0/news`

### **6. Key Distribution Service**
- **Folder**: `/endpoints/9111/`
  - **Purpose**: Handles AES-256 key creation and retrieval.
  - **Requests**:
    - `/aes256_create.md`: Documenting `POST /v0/aes256/create`
    - `/aes256_retrieve.md`: Documenting `GET /v0/aes256/retrieve`

### **7. Matchmaking Service**
- **Folder**: `/endpoints/3030/`
  - **Purpose**: Manages matchmaking functionality.
  - **Requests**:
    - `/bypass.md`: Documenting `POST /v1/bypass`
    - `/cancel.md`: Documenting `POST /v1/cancel`
    - `/describe.md`: Documenting `GET /v1/describe`
    - `/regions_udp.md`: Documenting `GET /v1/regions/udp`
    - `/queue.md`: Documenting `POST /v1/queue`

---

Each `.md` file in the folders should include:
- **Endpoint**: Full URL and method.
- **Description**: Purpose of the request.
- **Parameters**: Required and optional.
- **Response**: Example responses and their meaning.
- **Game Behavior**: Based on testing and possibility, how the game behaves around said endpoints.