This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<!-- docker-compose build web
docker-compose up -d web
docker ps

# Format: docker build -t <name>:<tag> .
docker build --no-cache -t natal-nextjs-web:1.0.4 --build-arg NEXT_PUBLIC_SUPABASE_URL="https://nghqvuqrmzjrfhuvuion.supabase.co" --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naHF2dXFybXpqcmZodXZ1aW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTUxMjgsImV4cCI6MjA4MDMzMTEyOH0.ah7Q8tivcjFdj2p-U5AsO0X8rlsln9FxzJw4cVCajk0" --build-arg NEXT_PUBLIC_N8N_WEBHOOK_URL="https://auto.apps.kediritechnopark.com/webhook/natal-chatbot" .

docker run -d --name natal-web -p 3000:3000 --restart unless-stopped natal-nextjs-web:1.0.4

docker save -o natal-web-104.tar natal-nextjs-web:1.0.4

docker load -i natal-web-104.tar
