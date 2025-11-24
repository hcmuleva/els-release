    # 🎓 College Kit# 🎓 College Kit

    Build the **same College Member Directory** four times (Levels 1–4), each adding complexity.Build the **College Member Directory** four times (Levels 1–4), adding one layer of complexity per iteration. This repository contains ONLY these four levels.

    ## Overview## 🧭 Overview

    | Level | Focus | Tech | Result || Level | Focus | Tech | Outcome |

    |-------|-------|------|--------||-------|-------|------|---------|

    | 1 | React fundamentals | React, JSX, components, props | Static UI || 1 | React fundamentals | React, JSX, components, props, arrays | Static UI (cards + basic stats) |

    | 2 | State & routing | Hooks, React Router, forms | Interactive multi-page app || 2 | State, effects, routing | Hooks (`useState`,`useEffect`), React Router, forms | Interactive multi‑page directory (search, filters, forms) |

    | 3 | Backend & auth | Context API, Express/Strapi, JWT | Full-stack authenticated app || 3 | Global state, backend, auth | Context API, Express/REST, Strapi, JWT | Full‑stack authenticated app (protected routes) |

    | 4 | Production & real-time | Service layer, Ably WebSockets | Real-time production app || 4 | Production & real‑time | Service layer, Ably WebSockets, advanced React | Real‑time production‑ready app (presence, notifications) |

    ## Requirements## 📦 Requirements

    - Node 18+, npm 9+Node 18+, npm 9+, Git (recommended), VS Code. Optional: Strapi (Level 3), Ably account (Level 4).

    - Git (recommended)

    - VS Code## 🗂️ Structure

    - Optional: Strapi (Level 3), Ably account (Level 4)Each level:

    ````

    ## Structurecollege-app-client-level-X/   # Reference implementation

    Each level contains:lessons/                      # Guided markdown tutorials

    - `college-app-client-level-X/` - Reference implementationpractice-lab/                 # Sandbox to experiment

    - `lessons/` - Tutorials```

    - `practice-lab/` - SandboxExtras: Level 3 adds `college-app-server/`; Level 4 adds `service/` (outside `src/`).



    Level 3 adds `college-app-server/`. Level 4 adds `service/` directory.## 🚀 Setup (PowerShell)

    Clone:

    ## Setup (PowerShell)```powershell

    git clone <repo-url>

    **Clone:**cd college-kit-app-development

    ```powershell```

    git clone <repo-url>Practice Lab (start here):

    cd college-kit-app-development```powershell

    ```cd level-1/practice-lab   # or level-2 / level-3 / level-4

    npm install

    **Practice Lab:**npm run dev

    ```powershell```

    cd level-1/practice-labReference App:

    npm install```powershell

    npm run devcd level-1/college-app-client-level-1  # change 1 → 2/3/4

    ```npm install

    npm run dev

    **Reference App:**```

    ```powershellLevel 3 Express API (optional):

    cd level-1/college-app-client-level-1```powershell

    npm installcd level-3/college-app-server/express-api

    npm run devnpm install

    ```npm start

    ````

    **Level 3 Backend (optional):**Level 3 Strapi CMS (optional):

    `powershell`powershell

    cd level-3/college-app-server/express-apicd level-3/college-app-server/strapi-cms

    npm installnpm install

    npm startnpm run develop

    ````

    Level 4 env vars:

    **Level 4 (requires .env):**```powershell

    ```powershellcd level-4/college-app-client-level-4

    cd level-4/college-app-client-level-4Copy-Item .env.example .env

    Copy-Item .env.example .env```

    # Edit .env with VITE_API_URL and VITE_ABLY_API_KEYEdit `.env`:

    npm install```

    npm run devVITE_API_URL=http://localhost:1337/api

    ```VITE_ABLY_API_KEY=your-ably-key-here

    ```

    ## Learning Path

    1. **Level 1** → React fundamentals## 🔐 Auth (Levels 3–4)

    2. **Level 2** → State, effects, routingJWT + Context. Protected routes redirect when unauthenticated.

    3. **Level 3** → Backend integration, auth

    4. **Level 4** → Real-time features, production patterns## ⚡ Real‑Time (Level 4)

    Ably pub/sub handled via a singleton client + channel helpers in `service/realtime/`.

    ## Troubleshooting

    | Issue | Fix |## 🧪 Learning Flow

    |-------|-----|1 → Fundamentals | 2 → Interactivity & Routing | 3 → Full‑stack & Auth | 4 → Real‑time & Production

    | Port busy | `npm run dev -- --port 5174` |

    | Env vars ignored | Restart dev server |## 🛠 Troubleshooting

    | 401 errors | Re-login and verify token || Issue | Fix |

    | No real-time updates | Check Ably API key ||-------|-----|

    | Port busy | `npm run dev -- --port 5174` |

    ## Scope| Env vars ignored | Restart dev server |

    This repository contains **only Levels 1–4**. References to other levels removed.| 401 errors | Re‑login & verify token stored |

    | Missing realtime | Check Ably key & channel names |

    **Happy Learning!** 🚀

    ## ✅ Scope
    Only Levels 1–4. All references to other levels or external hosted servers removed.

    ## 📘 Next Steps
    Add notes in practice labs; extend Level 3 API (pagination/roles); evaluate a UI library after Level 4.

    **Happy Learning!** Compare each iteration and reflect on what changed & why. 🚀

    ## ⚡ Real‑Time (Level 4)
    Ably pub/sub managed via a singleton + channel helpers in `service/realtime/`.

    ## 🧪 Learning Flow
    1 → Fundamentals
    2 → Interactivity & Routing
    3 → Full‑stack & Auth
    4 → Real‑time & Production

    ## 🛠 Troubleshooting
    | Issue | Fix |
    |-------|-----|
    | Port busy | `npm run dev -- --port 5174` |
    | Env vars ignored | Restart dev server |
    | 401 errors | Re‑login & verify token stored |
    | Missing realtime | Check Ably key & channel names |

    ## ✅ Scope
    Only Levels 1–4. All references to other levels or external hosted servers removed.

    ## 📘 Next Steps
    Add personal notes in each practice lab; extend Level 3 API (pagination/roles); optionally evaluate a UI library after Level 4.

    **Happy Learning!** Compare each iteration and reflect on what changed & why. 🚀
    # 🎓 College Kit

    Progressive learning system where you build the **same College Member Directory** four times, adding one layer of complexity per level. This repository includes ONLY Levels 1–4.

    ## 🧭 Overview
    | Level | Focus | Key Tech | Result |
    |-------|-------|----------|--------|
    | 1 | React fundamentals | React, JSX, components, props, arrays | Static UI (cards + basic stats) |
    | 2 | State + effects + routing | Hooks (`useState`,`useEffect`), React Router, forms | Interactive multi‑page directory (search, filters, forms) |
    | 3 | Global state + backend + auth | Context API, Express/REST, Strapi, JWT | Full‑stack authenticated app (protected routes) |
    | 4 | Production patterns + real‑time | Service layer, Ably WebSockets, advanced React | Real‑time production‑ready app (presence, notifications) |

    ## 📦 Requirements
    Node 18+, npm 9+, Git (recommended), VS Code. Optional: Strapi (Level 3), Ably account (Level 4).

    ## 🗂️ Structure
    Each level folder contains:
    ```
    college-app-client-level-X/   # Reference implementation
    lessons/                      # Guided markdown tutorials
    practice-lab/                 # Safe sandbox to experiment
    ```
    Extras: Level 3 adds `college-app-server/`; Level 4 adds `service/` (outside `src/`).

    ## 🚀 Setup (PowerShell)
    Clone:
    ```powershell
    git clone <repo-url>
    cd college-kit-app-development
    ```
    Practice Lab (recommended start):
    ```powershell
    cd level-1/practice-lab   # or level-2 / level-3 / level-4
    npm install
    npm run dev
    ```
    Reference App:
    ```powershell
    cd level-1/college-app-client-level-1  # change 1 → 2/3/4
    npm install
    npm run dev
    ```
    Level 3 Express API (optional):
    ```powershell
    cd level-3/college-app-server/express-api
    npm install
    npm start
    ```
    Level 3 Strapi CMS (optional):
    ```powershell
    cd level-3/college-app-server/strapi-cms
    npm install
    npm run develop
    ```
    Level 4 env vars:
    ```powershell
    cd level-4/college-app-client-level-4
    Copy-Item .env.example .env
    ```
    Edit `.env`:
    ```
    VITE_API_URL=http://localhost:1337/api
    VITE_ABLY_API_KEY=your-ably-key-here
    ```

    ## 🔐 Auth (Levels 3–4)
    JWT + Context. Protected routes redirect when unauthenticated.

    ## ⚡ Real‑Time (Level 4)
    Ably pub/sub handled via a singleton client + channel helpers in `service/realtime/`.

    ## 🧪 Learning Flow
    1 → Fundamentals
    2 → Interactivity & Routing
    3 → Full‑stack & Auth
    4 → Real‑time & Production

    ## 🛠 Troubleshooting
    | Issue | Fix |
    |-------|-----|
    | Port busy | `npm run dev -- --port 5174` |
    | Env vars ignored | Restart dev server |
    | 401 errors | Re‑login & verify token stored |
    | Missing realtime | Check Ably key & channel names |

    ## ✅ Scope
    Only Levels 1–4. All references to Level 5/6 or external hosted servers removed.

    ## 📘 Next Steps
    Add personal notes in each practice lab, extend Level 3 API (pagination/roles), optionally evaluate a UI library after Level 4.

    **Happy Learning!** Compare each iteration and reflect on what changed & why. 🚀
    ````
