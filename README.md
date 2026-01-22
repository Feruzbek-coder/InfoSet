# InfoSet

Bu loyiha ta'lim, dasturlash va IT bo'yicha maqolalar saytini yaratish uchun mo'ljallangan.

## Texnologiyalar

- **Next.js 14** - React asosida qurilgan full-stack framework
- **TypeScript** - Tip xavfsizligi uchun
- **Tailwind CSS** - Zamonaviy styling uchun
- **JSON** - Ma'lumotlar bazasi sifatida (boshlang'ich)

## Xususiyatlari

### Foydalanuvchilar uchun:
- ✅ Maqolalarni ko'rish va o'qish
- ✅ Kategoriya bo'yicha filtrlash
- ✅ Qidiruv funksiyasi
- ✅ Responsive dizayn

### Admin panel:
- ✅ Yangi maqola qo'shish
- ✅ Mavjud maqolalarni tahrirlash
- ✅ Maqolalarni o'chirish
- ✅ CRUD operatsiyalari

## Loyihani ishga tushirish

### Talablar
1. Node.js (v18 yoki undan yuqori)
2. npm yoki yarn

### O'rnatish

1. **Node.js o'rnatish**
   - https://nodejs.org saytiga o'ting
   - LTS versiyasini yuklab oling va o'rnating

2. **Bog'liqliklarni o'rnatish**
   ```bash
   npm install
   ```

3. **Development serverini ishga tushirish**
   ```bash
   npm run dev
   ```

4. **Brauzerda ochish**
   http://localhost:3000 ga o'ting

## Papka tuzilmasi

```
src/
├── app/
│   ├── globals.css          # Global CSS styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Bosh sahifa
│   ├── maqolalar/
│   │   └── page.tsx         # Maqolalar sahifasi
│   ├── admin/
│   │   └── page.tsx         # Admin panel
│   └── api/
│       └── articles/
│           └── route.ts     # API endpoint
└── data/
    └── articles.json        # Maqolalar ma'lumotlari
```

## Foydalanish

### Admin Panel
1. `/admin` sahifasiga o'ting
2. "Yangi Maqola Qo'shish" tugmasini bosing
3. Forma to'ldiring va saqlang
4. Maqolalarni tahrirlash yoki o'chirish mumkin

### Maqolalar sahifasi
1. `/maqolalar` sahifasiga o'ting
2. Qidiruv orqali maqola toping
3. Kategoriya bo'yicha filtrlanaydi
4. Maqolani o'qish uchun "Batafsil" tugmasini bosing

## Keyingi qadamlar

- [ ] Ma'lumotlar bazasini qo'shish (PostgreSQL/MySQL)
- [ ] Foydalanuvchi autentifikatsiyasi
- [ ] Rasm yuklash imkoniyati
- [ ] Izohlar tizimi
- [ ] SEO optimallashtirish

## Yordam

Agar muammo yuzaga kelsa:
1. Node.js o'rnatilganligini tekshiring: `node --version`
2. Bog'liqliklarni qayta o'rnating: `npm install`
3. Cache ni tozalang: `npm run build`

## Litsenziya

Bu loyiha shaxsiy foydalanish uchun yaratilgan.