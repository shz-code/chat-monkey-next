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
│   ├── auth
│   │   └── login.tsx
│   └── dashboard
│       ├── add
│       │   └── page.tsx
│       └── page.tsx
├── components
│   ├── ui (Reuseable ui components)
│   │   └── Button
│   ├── AddFriendForm.tsx
│   └── Providers.tsx (To wrap the whole app to get dynamic context)
├── lib
│   ├── validations
│   │   └── validators.tsx
│   ├── utilities.ts (cn)
│   └── db.ts
└── types
    ├── db.d.ts (DB Model Types)
    └── next-auth.d.ts (TS Augmentation to extend base Next Auth JST, Session interface)