# Auth Middleware Logic Flow

This document describes the middleware processing flow for the Mini CRM project, including Internationalization (i18n), Authentication, and Role-Based Access Control (RBAC).

## 1. Overall Processing Flow (Main Middleware)

The project uses `middleware.ts` as the primary entry point, combining `next-intl` and a custom `authMiddleware`.

```mermaid
graph TD
    A[Request Start] --> B{Asset/Next Internals?}
    B -- Yes --> C[Skip - Continue to render]
    B -- No --> D[Execute authMiddleware]
    D --> E{authMiddleware returns Response?}
    E -- Redirect --> F[Execute Redirect]
    E -- null --> G[Execute intlMiddleware]
    G --> H[End - Return Final Response]
```

## 2. Detailed Auth & RBAC Logic

The flowchart below illustrates the specific validation steps within `middleware/auth.ts`:

```mermaid
flowchart TD
    Start([Start authMiddleware]) --> CheckAsset{Check Asset/Internal?}
    CheckAsset -- Yes --> Continue([Continue - return null])
    CheckAsset -- No --> GetInfo[Retrieve Locale, Token, Role & Path]

    GetInfo --> CheckRoot{Path is '/'?}
    CheckRoot -- Yes --> RootAuth{Is Authenticated?}
    RootAuth -- No --> RedirLogin[Redirect /auth/login]
    RootAuth -- Yes --> RedirDash[Redirect to Dashboard by Role]

    CheckRoot -- No --> CheckPublic{Is Public Route?<br/>/auth/*, /error}
    
    CheckPublic -- No --> CheckToken{Has Token?}
    CheckToken -- No --> RedirLogin
    CheckToken -- Yes --> CheckRBAC{In Management area?<br/>/admin, /manager, /sale}
    
    CheckRBAC -- Yes --> Authorized{Is Authorized for this area?}
    Authorized -- No --> Redir403[Redirect Error 403<br/>Forbidden]
    Authorized -- Yes --> Continue
    
    CheckRBAC -- No --> Redir404[Redirect Error 404<br/>Not Found]

    CheckPublic -- Yes --> CheckLogged{Is Authenticated?}
    CheckLogged -- Yes --> IsError{Is /error page?}
    IsError -- No --> RedirDash
    IsError -- Yes --> Continue
    CheckLogged -- No --> Continue

    %% Styling
    style RedirLogin fill:#f96,stroke:#333
    style Redir403 fill:#f66,stroke:#333
    style Redir404 fill:#f66,stroke:#333
    style RedirDash fill:#6f9,stroke:#333
    style Continue fill:#9cf,stroke:#333
```

## 3. Access Control matrix

| Role | Authorized Prefixes | Primary Dashboard |
| :--- | :--- | :--- |
| **Admin** | `/admin/*`, `/manager/*`, `/sale/*` | 
| **Manager** | `/manager/*`, `/sale/*` | 
| **Sale** | `/sale/*` | 

## 4. Error Handling

-   **403 Forbidden**: Triggered when an authenticated user attempts to access a prefix that their role does not have permission for (e.g., a Sale user trying to access `/admin`).
-   **404 Not Found**: Triggered when the requested path is neither a Public route nor starts with a recognized management prefix (`/admin`, `/manager`, `/sale`).
