import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Bu API faqat bir marta ishlatiladi - ma'lumotlarni JSON'dan PostgreSQL'ga ko'chirish uchun
export async function GET() {
  try {
    // Learning articles
    const learningArticles = [
      {
        "title": "Kompyuter savodxonligi nima?",
        "content": "\n![komp savodxonlik.jpg](/uploads/1767505581555-komp savodxonlik.jpg)\nKompyuter savodxonligi — bu kompyuterdan to'g'ri, xavfsiz va mustaqil foydalana olish qobiliyatidir.\nOddiy qilib aytganda:\n🧠 Kompyuter savodxonligi — kompyuterni yoqishdan boshlab, unda dastur ochish, fayl saqlash, internetdan foydalanishgacha bo'lgan bilimlar majmuasidir.\nKompyuter savodxonligi quyidagilarni o'z ichiga oladi:\n•\tkompyuterni yoqish va o'chirish\n•\tsichqoncha va klaviaturadan foydalanish\n•\tdasturlarni ochish va yopish\n•\tfayl va papkalar bilan ishlash\n•\tinternetdan to'g'ri foydalanish\n•\tdasturlarni o'rnatish va o'chirish\n📌 Muhim:\nKompyuter savodxonligi faqatgina dasturchi bo'lish degani emas.\nBu — zamonaviy hayot uchun zarur bo'lgan asosiy bilim.\n\n2. Nima uchun kompyuterda ishlashni o'rganish kerak?\nBugungi kunda kompyutersiz hayotni tasavvur qilish qiyin. Ko'plab ishlar faqat kompyuter orqali bajariladi.\nKompyuter bilishning foydalari:\n🎓 O'qish uchun\n•\tonlayn darslar\n•\telektron darsliklar\n•\ttopshiriqlarni yozish va yuborish\n💼 Ish uchun\n•\thujjatlar tayyorlash\n•\te-mail yuborish\n•\thisobotlar bilan ishlash\n🌐 Kundalik hayotda\n•\tinternetdan ma'lumot izlash\n•\tdavlat xizmatlari (onlayn)\n•\tto'lovlar va arizalar\n💻 Kelajak kasblari uchun\n•\tdasturlash\n•\tdizayn\n•\tofis ishlari\n•\tmasofaviy ishlar\n👉 Kompyuterni bilmaslik — imkoniyatlarni cheklaydi.\n👉 Kompyuterni bilish — eshiklarni ochadi.\n\n3. Ushbu qo'llanma kimlar uchun mo'ljallangan?\nBu qo'llanma maxsus boshlovchilar uchun tayyorlangan.\n👥 Qo'llanma quyidagilar uchun:\n•\tumuman kompyuterda ishlamaganlar\n•\tkompyuterdan qo'rqadiganlar 😄\n•\tmaktab o'quvchilari (10–12 yoshdan boshlab)\n•\tota-onalar\n•\tkasb o'rganmoqchi bo'lganlar\n•\tkeyinchalik Python dasturlashni o'rganmoqchi bo'lganlar\n\n📌 Muhim:\nAgar siz \"men kompyuterni umuman bilmayman\" desangiz — bu qo'llanma aynan siz uchun.\n\n4. Qo'llanma bilan qanday ishlash kerak?\nBu qo'llanma bosqichma-bosqich o'rganish uchun mo'ljallangan.\n📖 O'rganish tartibi:\n1.\tBoblarni ketma-ket o'qing\n2.\tHar bir rasmga e'tibor bering\n3.\tAmaliy mashqlarni albatta bajarib ko'ring\n4.\tShoshilmang — tushunib o'rganing\n🧩 Mashqlar nima uchun kerak?\n•\tbilimni mustahkamlash uchun\n•\tqo'rquvni yengish uchun\n•\tmustaqil ishlashni o'rganish uchun\n❗ Muhim tavsiyalar:\n•\tXato qilishdan qo'rqmang\n•\tBir joyini tushunmasangiz, qayta o'qing\n•\tHar kim ham noldan boshlagan\n\nKompyuterni va dasturlashni o'rganishda omad!\n",
        "category": "Dasturlashga qadam",
        "author": "Admin",
        "date": "2026-01-04"
      },
      {
        "title": "1-BOB. KOMPYUTER BILAN TANISHUV",
        "content": "![9a625209-96a6-445c-9ea7-7d2a032dd414-md.jpeg](/uploads/1767613735018-9a625209-96a6-445c-9ea7-7d2a032dd414-md.jpeg)\n\n1-BOB. KOMPYUTER BILAN TANISHUV\n \n1.1 Kompyuter nima?\nKompyuter — bu elektron qurilma bo'lib, u inson tomonidan berilgan buyruqlar asosida ma'lumotlarni qabul qiladi, qayta ishlaydi va natijani chiqaradi yoki saqlaydi.\nOddiy tushuntirish bilan aytganda:\n🧠 Kompyuter — bu aqlli yordamchi.\nSiz buyruq berasiz, u esa juda tez bajaradi.\nKompyuter:\n•\to'ylamaydi\n•\tqaror qabul qilmaydi\n•\tfaqat siz nima desangiz, shuni bajaradi\n\n1.2 Kompyuter nimalar uchun ishlatiladi?\nBugungi kunda kompyuter kundalik hayotning ajralmas qismi hisoblanadi.\nKompyuter quyidagi ishlar uchun ishlatiladi:\n📄 Hujjatlar bilan ishlash\n•\tariza yozish\n•\trezyume tayyorlash\n•\tmatnlar yozish\n🌐 Internetdan foydalanish\n•\tma'lumot izlash\n•\tyangilik o'qish\n•\tijtimoiy tarmoqlar\n🎓 O'qish va ta'lim\n•\tonlayn darslar\n•\ttopshiriqlar bajarish\n•\telektron kitoblar\n🎬 Dam olish\n•\tvideo ko'rish\n•\tmusiqa tinglash\n•\to'yinlar\n💻 Kasb va ish uchun\n•\tofis ishlari\n•\tdizayn\n•\tdasturlash (keyingi bosqichlarda)\n\n1.3 Kompyuter turlari\n\nKompyuterlar tashqi ko'rinishi va ishlatilishiga qarab bir nechta turga bo'linadi.\n1️⃣ Shaxsiy kompyuter (Desktop)\n•\tStol ustida turadi\n•\tAlohida monitor, klaviatura, sichqoncha bo'ladi\n•\tKo'pincha ofis va uyda ishlatiladi\nAfzalligi:\n•\tKatta ekran\n•\tUzoq vaqt ishlashga qulay\n\n2️⃣ Noutbuk (Laptop)\n•\tKo'tarib yurish mumkin\n•\tIchida hamma qurilmalar bor\n•\tBatareya bilan ishlaydi\nAfzalligi:\n•\tIxcham\n•\tHar joyda ishlatish mumkin\n\n3️⃣ Planshet (Tablet)\n•\tSensorli ekran\n•\tKlaviaturasiz ishlaydi\n•\tAsosan o'yin va video uchun\n📌 Eslatma:\nBu qo'llanmada desktop va noutbuk asosiy hisoblanadi.\n\n1.4 Kompyuter qanday ishlaydi? (juda sodda tushuntirish)\nKompyuter ishlashi 3 bosqichdan iborat:\n1️⃣ Kiritish (Input)\nBu — kompyuterga buyruq berish:\n•\tklaviaturadan yozish\n•\tsichqoncha bilan bosish\n2️⃣ Qayta ishlash (Process)\n•\tkompyuter ichida hisoblaydi\n•\tbuyruqni tushunadi\n3️⃣ Natija (Output)\n•\tnatijani ekranga chiqaradi\n•\tyoki fayl qilib saqlaydi\nOddiy misol:\n•\tSiz: 5 + 5 yozasiz\n•\tKompyuter: hisoblaydi\n•\tNatija: 10\n1.5 Kompyuterning asosiy qismlari (umumiy)\nBoshlovchi bilishi kerak bo'lgan asosiy qurilmalar:\n•\tMonitor — natija ko'rinadigan ekran\n•\tKlaviatura — yozish uchun\n•\tSichqoncha (Mouse) — bosish va tanlash uchun\n•\tTizim bloki — kompyuterning \"miyasi\"\n👉 Keyingi bobda har birini alohida, batafsil o'rganamiz.\n1.6 Boshlovchilar uchun muhim tushunchalar\n✅ Kompyuter buzilib qolmaydi, agar:\n•\tto'g'ri ishlatilsa\n•\tto'g'ri o'chirilsa\n✅ Xato qilish — o'rganishning bir qismi\n✅ Har bir mutaxassis ham noldan boshlagan",
        "category": "Dasturlashga qadam",
        "author": "Admin",
        "date": "2026-01-05"
      }
    ]

    // Articles
    const articles = [
      {
        "title": "Windows XP va Windows 7: Ikki avlod operatsion tizimlari",
        "content": "![photo_2025-11-24_18-31-07.jpg](/uploads/1763991096584-photo_2025-11-24_18-31-07.jpg)\nWindows XP va Windows 7: Ikki avlod operatsion tizimlari\n\nKompyuterlar tarixida Windows operatsion tizimlari muhim o'rin tutadi. Ulardan eng mashhurlari — Windows XP va Windows 7 bo'lib, har biri o'z davrida ulkan muvaffaqiyat va texnologik yangiliklarni olib kelgan.",
        "category": "Software",
        "author": "Admin",
        "date": "2025-11-24"
      },
      {
        "title": "🖥 Microsoft Office 2010 va undan yuqori versiyalar",
        "content": "🖥 Microsoft Office 2010 va undan yuqori versiyalari\n\n📌 Microsoft Office – bu ofis dasturlari to'plami bo'lib, hujjatlar tayyorlash, hisob-kitob qilish, taqdimot qilish va ma'lumotlar bazasi bilan ishlash uchun mo'ljallangan.",
        "category": "Software",
        "author": "Admin",
        "date": "2025-11-11"
      },
      {
        "title": "Kompyuter sekin ishlayotganida qanday tezlashtirish mumkin",
        "content": "Kompyuter sekin ishlashining asosiy sabablari va ularni hal qilish usullari haqida batafsil ma'lumot. Bu maqolada siz kompyuteringizni tezlashtirish uchun amaliy maslahatlar topasiz.",
        "category": "Tezlashtirish",
        "author": "Admin",
        "date": "2024-01-15"
      },
      {
        "title": "Virus va zararli dasturlardan himoyalanish",
        "content": "Kompyuterni viruslar va zararli dasturlardan himoyalash bo'yicha eng samarali usullar. Antivirus dasturlarini to'g'ri tanlash va sozlash.",
        "category": "Xavfsizlik",
        "author": "Admin",
        "date": "2024-01-10"
      },
      {
        "title": "Hard disk xatoliklarini aniqlash va tuzatish",
        "content": "Hard diskdagi xatolar va ularni aniqlash usullari. Disk defragmentatsiyasi va disk tekshirish vositalari haqida ma'lumot.",
        "category": "Hardware",
        "author": "Admin",
        "date": "2024-01-05"
      }
    ]

    // Insert learning articles
    for (const article of learningArticles) {
      await pool.query(
        'INSERT INTO learning_articles (title, content, category, author, date, image) VALUES ($1, $2, $3, $4, $5, $6)',
        [article.title, article.content, article.category, article.author, article.date, '']
      )
    }

    // Insert articles
    for (const article of articles) {
      await pool.query(
        'INSERT INTO articles (title, content, category, author, date, image) VALUES ($1, $2, $3, $4, $5, $6)',
        [article.title, article.content, article.category, article.author, article.date, '']
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Ma\'lumotlar muvaffaqiyatli ko\'chirildi!',
      learningCount: learningArticles.length,
      articlesCount: articles.length
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
