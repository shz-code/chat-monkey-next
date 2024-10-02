# Chat Monkey

# Folder structure

src
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api
│   │   └── auth
│   │       └── [...nextauth]
│   │           └── route.ts (Next Auth Urls)
│   └── auth
│       └── login.tsx
├── components
│   ├── ui (Reuseable ui components)
│   │   └── Button
│   └── Providers.tsx (To wrap the whole app to get dynamic context)
├── lib
│   ├── utilities.ts (cn)
│   └── db.ts
└── types
    ├── db.d.ts (DB Model Types)
    └── next-auth.d.ts (TS Augmentation to extend base Next Auth JST, Session interface)