# Next.js Project

## 1. Requirements

- Node.js (แนะนำ 18+)
- npm หรือ yarn

## 2. การติดตั้งและตั้งค่า

1. **ติดตั้ง dependencies**

```bash
npm install
```

หรือ

```bash
yarn install
```

2. **ตั้งค่า environment variables** สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์ (ตัวอย่าง):

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_IMAGE_URL=http://localhost:8000/updloads
```

## 3. การรันโปรเจกต์ (Development)

```bash
npm run dev
```

หรือ

```bash
yarn dev
```

เปิดเว็บเบราว์เซอร์ที่ `http://localhost:3000`

## 4. การ build สำหรับ Production

```bash
npm run build
npm start
```

หรือ

```bash
yarn build
yarn start
```

## 5. โครงสร้างโปรเจกต์ (ตัวอย่าง)

```
app/
  page.tsx
  admin/
    page.tsx
components/
public/
```

## 6. การเข้าเมนู Admin

ให้เข้าไปที่ลิงก์:

```
/admin
```

