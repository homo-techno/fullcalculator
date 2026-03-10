# 500 новых калькуляторов для fullcalculator.com
## Стратегический план расширения контента

**Дата составления:** Март 2026
**Цель:** 500 новых уникальных калькуляторов без SEO-каннибализации
**Исполнитель:** Claude Haiku (пакетное создание по 15 шт.)

---

## 1. АНАЛИЗ ТЕКУЩЕГО СЕМАНТИЧЕСКОГО ЯДРА

| Раздел | Кол-во калькуляторов | Покрытие |
|--------|---------------------|----------|
| Math | 352 | Очень полное |
| Finance | 1,532 | Очень полное |
| Health | 630 | Полное |
| Everyday | 1,852 | Очень полное |
| Science | 700 | Полное |
| Conversion | 347 | Полное |
| **ИТОГО** | **5,413** | — |

## 2. АНАЛИЗ КОНКУРЕНТОВ — НЕЗАКРЫТЫЕ НИШИ

| Ниша | Omni | CalcSoup | Calc.net | fullcalculator |
|------|------|----------|----------|---------------|
| AI / LLM costs | ❌ | ❌ | ❌ | ❌ → **БИГ ГЭП** |
| Gig economy platforms | частично | ❌ | ❌ | частично |
| Creator economy | частично | ❌ | ❌ | частично |
| FIRE movement (FatFIRE, CoastFIRE) | частично | ❌ | ❌ | частично |
| Legal calculators | ❌ | ❌ | ❌ | ❌ → **БИГ ГЭП** |
| Brewing/fermentation | ✅ (Omni) | ❌ | ❌ | ❌ |
| 3D printing / maker | ❌ | ❌ | ❌ | ❌ → **БИГ ГЭП** |
| Emergency preparedness | ❌ | ❌ | ❌ | ❌ → **БИГ ГЭП** |
| Gaming (video + tabletop) | частично | частично | ❌ | ❌ |
| Agriculture / farming | ❌ | ❌ | ❌ | ❌ → **БИГ ГЭП** |
| Wedding planning (detailed) | частично | ❌ | ❌ | ❌ |
| Music production business | ❌ | ❌ | ❌ | ❌ |
| Mental health detailed | частично | ❌ | ❌ | частично |

---

## 3. ИНСТРУКЦИЯ ДЛЯ CLAUDE HAIKU

Для каждого батча Haiku должен создать файл `src/data/calculators/{slug}.ts` по стандарту проекта. Каждый калькулятор включает:

```typescript
{
  slug: "calculator-slug",
  title: "Calculator Name",
  description: "SEO-описание 150-160 символов",
  category: "finance" | "health" | "everyday" | "science" | "math" | "conversion",
  inputs: [...],
  formula: "...",
  output: {...}
}
```

**Требования к каждому калькулятору:**
- Уникальный slug (kebab-case)
- H1 title: конкретный, включает ключевое слово
- Meta description: 150-160 символов с CTA
- Минимум 3-5 инпутов
- Объяснение формулы
- Практический пример расчёта

---

## 4. 34 БАТЧА ПО 15 КАЛЬКУЛЯТОРОВ = 510 шт.

---

### БАТЧ 1: AI & LLM Costs (Раздел: Finance → Technology)
*Самая незаполненная ниша 2025-2026. Высокий поисковый спрос.*

1. **LLM API Cost Calculator** — стоимость запросов к OpenAI/Anthropic/Gemini по токенам
2. **AI Token Counter** — подсчёт токенов в тексте для разных моделей
3. **ChatGPT vs Claude vs Gemini Cost Comparison** — сравнение стоимости за одинаковый объём
4. **AI Image Generation Cost Calculator** — Midjourney/DALL-E/Stable Diffusion стоимость в месяц
5. **GPU Rental Cost Calculator** — стоимость аренды A100/H100 по часам vs задача
6. **AI Training Cost Estimator** — бюджет для fine-tuning модели
7. **AI Startup Compute Budget** — месячные расходы на LLM для стартапа
8. **AI vs Human Labor Cost** — сравнение AI-автоматизации vs найма человека
9. **RAG System Monthly Cost** — vector DB + embeddings + LLM для RAG-приложения
10. **AI Chatbot TCO Calculator** — полная стоимость владения AI-чатботом
11. **Prompt Efficiency Calculator** — экономия при оптимизации промптов
12. **LLM Context Window Cost** — стоимость длинного контекста (1M tokens)
13. **AI SaaS Pricing Model** — расчёт цены для AI-продукта с учётом LLM-издержек
14. **Vector Database Storage Cost** — сравнение Pinecone/Weaviate/Chroma по объёму
15. **AI Content Production ROI** — окупаемость AI-инструментов для контент-команды

---

### БАТЧ 2: Creator Economy — YouTube & Video (Раздел: Finance)
*Высокий спрос среди creators. Конкуренты покрывают слабо.*

1. **YouTube RPM Calculator** — доход с 1000 просмотров по нише и региону
2. **YouTube Channel Revenue Estimator** — доход по подписчикам + engagement
3. **YouTube Shorts Monetization Calculator** — сравнение Shorts vs обычные видео
4. **TikTok Creator Fund Calculator** — заработок с просмотров TikTok
5. **TikTok vs YouTube Revenue Comparison** — где выгоднее развивать канал
6. **Twitch Affiliate Revenue Calculator** — подписки + битсы + рекламы Twitch
7. **Twitch Partner Income Estimator** — доходы стримера с примерами ниш
8. **Instagram Reels Bonus Calculator** — бонусная программа Instagram
9. **Podcast CPM Calculator** — заработок на спонсорстве подкаста
10. **Podcast Sponsorship Rate Calculator** — цена рекламы по кол-ву слушателей
11. **Newsletter Sponsorship Pricing** — ставка за рекламу в email-рассылке
12. **Substack Revenue Calculator** — заработок на платных подписках
13. **Course Pricing Calculator** — оптимальная цена онлайн-курса
14. **Membership Site Revenue Model** — Patreon/Ko-fi/Memberful доход
15. **Content Creation Hourly Rate** — реальный hourly rate creator с учётом всех расходов

---

### БАТЧ 3: Creator Economy — E-commerce & Print (Раздел: Finance)
*Etsy, Amazon, print-on-demand — огромная аудитория.*

1. **Etsy Fee Calculator** — листинг + транзакция + обработка платежа Etsy
2. **Etsy Profit Margin Calculator** — чистая прибыль с учётом всех комиссий Etsy
3. **Redbubble Royalty Calculator** — заработок дизайнера на Redbubble
4. **Merch by Amazon Royalty Calculator** — роялти Amazon Merch по тирам
5. **Printful Profit Margin Calculator** — маржа при работе с Printful+Etsy/Shopify
6. **KDP (Kindle) Royalty Calculator** — роялти за книгу на Amazon KDP
7. **KDP Paperback vs Hardcover Profit** — сравнение форматов книги KDP
8. **Print-on-Demand Pricing Guide** — правильная цена продукта POD
9. **Shopify Store Profitability Calculator** — магазин с учётом комиссий + реклама
10. **Amazon FBA Fee Calculator** — сборы FBA с учётом размера/веса товара
11. **Amazon Seller Profit Calculator** — чистая прибыль Amazon seller
12. **Dropshipping Margin Calculator** — наценка дропшиппинга с учётом возвратов
13. **Upwork Fee Calculator** — чистый доход фрилансера после комиссий Upwork
14. **Fiverr Seller Net Income** — реальный заработок на Fiverr после комиссий
15. **Freelancer Rate vs Salary Comparison** — когда фриланс выгоднее найма

---

### БАТЧ 4: Gig Economy — Rideshare & Delivery (Раздел: Finance)
*Водители Uber/Lyft/DoorDash — масштабная аудитория.*

1. **Uber Driver Net Earnings Calculator** — доход после вычета расходов Uber
2. **Lyft Driver Profitability Calculator** — чистый доход водителя Lyft
3. **Uber vs Lyft Earnings Comparison** — сравнение по городу и часам
4. **DoorDash Dasher Earnings Calculator** — доход доставщика DoorDash
5. **Instacart Shopper Earnings Calculator** — доход шоппера Instacart
6. **Amazon Flex Hourly Pay Calculator** — фактический заработок Amazon Flex
7. **Gig Worker True Hourly Rate** — реальный hourly rate гиг-воркера после расходов
8. **Rideshare Vehicle Cost Per Mile** — стоимость эксплуатации авто для Uber/Lyft
9. **Gig Worker Tax Quarterly Estimate** — налоги самозанятого гиг-воркера
10. **Gig vs W2 Job Income Comparison** — сравнение самозанятости vs работы
11. **TaskRabbit Pricing Calculator** — сколько брать за задачи на TaskRabbit
12. **Rover Dog Walker Earnings** — заработок на Rover по типам услуг
13. **Wolt/UberEats Courier Earnings** — доход курьера в разных городах
14. **Gig Economy Mileage Deduction** — налоговый вычет за пробег самозанятого
15. **Side Hustle Profitability Tracker** — сравнение нескольких подработок

---

### БАТЧ 5: FIRE Movement (Раздел: Finance)
*Огромное сообщество FI/RE. Конкуренты покрывают минимально.*

1. **FIRE Number Calculator** — сколько нужно накопить для выхода на пенсию по FIRE
2. **FatFIRE Calculator** — FIRE с высоким уровнем жизни ($100k+/год)
3. **LeanFIRE Calculator** — FIRE с минимальными расходами (<$25k/год)
4. **CoastFIRE Number Calculator** — сколько накопить сейчас чтобы "плыть по течению"
5. **BaristaFIRE Calculator** — частичная пенсия + part-time работа
6. **ChubbyFIRE Calculator** — FIRE для среднего класса ($50-100k/год)
7. **FIRE with Pension Calculator** — как пенсия влияет на FIRE number
8. **Sequence of Returns Risk** — риск последовательности доходностей в FIRE
9. **Safe Withdrawal Rate Optimizer** — оптимальная ставка изъятия (3%, 3.5%, 4%)
10. **FIRE Tax Optimization Calculator** — оптимизация налогов при FIRE
11. **Geographic Arbitrage FIRE** — FIRE в стране с низкой стоимостью жизни
12. **FIRE with Kids Cost Calculator** — как дети влияют на FIRE number
13. **Roth Conversion Ladder Calculator** — стратегия Roth для early retiree
14. **FIRE Healthcare Cost Estimator** — расходы на здравоохранение до Medicare
15. **Years to FIRE Calculator** — через сколько лет достигнешь FIRE числа

---

### БАТЧ 6: Real Estate Advanced (Раздел: Finance)
*BRRRR, house hacking, ADU — популярные стратегии без калькуляторов.*

1. **BRRRR Method Calculator** — Buy-Rehab-Rent-Refinance-Repeat доходность
2. **House Hacking Calculator** — доход от аренды комнат для оплаты ипотеки
3. **ADU (Accessory Dwelling Unit) ROI** — окупаемость строительства доп. жилья
4. **Short-Term vs Long-Term Rental** — Airbnb vs долгосрочная аренда сравнение
5. **Real Estate Syndication Returns** — доходность инвестиций через синдикацию
6. **Real Estate Crowdfunding ROI** — сравнение платформ краудфандинга недвижимости
7. **Tiny House vs Apartment Cost** — сравнение крошечного дома и аренды
8. **Co-living Cost Comparison** — совместное проживание vs своя квартира
9. **Property Tax Appeal Calculator** — потенциальная экономия при оспаривании налога
10. **1031 Exchange Timeline & Tax Savings** — (отдельный детальный калькулятор)
11. **Rental Property Depreciation Schedule** — детальная амортизация недвижимости
12. **Real Estate Partnership Equity Split** — распределение долей в партнёрстве
13. **Opportunity Zone Tax Benefit** — выгода от инвестиций в Opportunity Zone
14. **Fix and Flip ARV Calculator** — After Repair Value и потенциал прибыли
15. **Seller Financing Calculator** — условия продавца-кредитора для покупателя

---

### БАТЧ 7: Legal & Court (Раздел: Finance → Legal)
*Практически полностью отсутствует у всех конкурентов. Уникальная ниша.*

1. **Small Claims Court Maximum Calculator** — лимит суммы иска по штатам США
2. **Child Support Calculator by State** — расчёт алиментов по методике штата
3. **Alimony Duration Calculator** — срок выплаты алиментов по длительности брака
4. **Divorce Asset Division Calculator** — справедливый раздел имущества
5. **Legal Fee Hourly Cost Tracker** — стоимость юридических услуг по делу
6. **Contingency Fee Calculator** — гонорар успеха адвоката (30-40%)
7. **Settlement vs Trial Value Calculator** — выгода урегулирования vs суда
8. **Statute of Limitations Deadline** — когда истекает срок исковой давности
9. **Security Deposit Legality Check** — максимальный депозит по штатам
10. **Employment Wrongful Termination Damages** — возможный размер компенсации
11. **Copyright Infringement Damages** — диапазон ущерба за нарушение авторских прав
12. **Contract Breach Damages Calculator** — расчёт убытков при нарушении договора
13. **Workers Compensation Benefit** — пособие по производственной травме
14. **Personal Injury Settlement Value** — оценка компенсации при ДТП/травме
15. **Landlord-Tenant Dispute Cost** — стоимость судебного разбирательства с арендодателем

---

### БАТЧ 8: Brewing & Fermentation (Раздел: Everyday → Food)
*Пивоварение — огромное хобби-сообщество. На fullcalculator нет.*

1. **Beer IBU Calculator** — горечь пива (International Bitterness Units)
2. **Beer ABV Calculator from OG/FG** — алкоголь из начальной и конечной плотности
3. **Beer SRM Color Calculator** — цвет пива по солодам
4. **Beer Mash Efficiency Calculator** — эффективность затирания солода
5. **Beer Priming Sugar Calculator** — сахар для карбонизации в бутылках
6. **Beer Water Chemistry Calculator** — минеральный профиль воды для пива
7. **All-Grain Beer Strike Water** — температура воды для затирания
8. **Beer Carbonation Level Calculator** — уровень CO2 в пиве
9. **Homebrew Batch Cost Calculator** — стоимость варки пива дома
10. **Wine Making Yield Calculator** — выход вина из винограда/фруктов
11. **Sourdough Starter Hydration** — гидратация закваски для хлеба
12. **Baker's Percentage Calculator** — проценты пекаря для хлебных рецептов
13. **Bread Hydration Ratio Calculator** — соотношение воды к муке
14. **Kombucha SCOBY Feeding Schedule** — подкормка чайного гриба
15. **Fermentation Time & Temperature Guide** — время ферментации по температуре

---

### БАТЧ 9: 3D Printing & Maker Space (Раздел: Everyday → Technology)
*Maker-сообщество огромно. Ни один конкурент не покрывает.*

1. **3D Print Filament Weight Calculator** — вес и стоимость пластика для модели
2. **3D Print Time Estimator** — время печати по объёму и настройкам
3. **3D Print Cost Calculator** — полная стоимость: пластик + электричество + амортизация
4. **FDM vs Resin Printing Cost** — сравнение технологий для хоббиста
5. **3D Print Layer Height vs Time** — компромисс качества и скорости печати
6. **Resin Casting Weight Calculator** — вес смолы для заливки формы
7. **CNC Machining Time Estimate** — время обработки детали на ЧПУ
8. **Laser Cutting Area Calculator** — площадь резки + время + стоимость
9. **Vinyl Cutter Material Calculator** — количество винила для проекта
10. **Candle Making Wax Calculator** — вес воска + фитиль для размера тары
11. **Candle Fragrance Load Calculator** — % аромата для разных восков
12. **Soap Making Lye (NaOH) Calculator** — щёлочь для рецепта мыла
13. **Resin Art Mixing Ratio Calculator** — соотношение смолы к отвердителю
14. **Embroidery Thread Length Calculator** — длина нити для паттерна
15. **Laser Engraving Cost Calculator** — цена гравировки для бизнеса

---

### БАТЧ 10: DIY Crafts & Fabric Arts (Раздел: Everyday)
*Шитьё, вязание, квилтинг — женская аудитория, высокий трафик.*

1. **Circle Skirt Calculator** — метраж ткани для юбки-солнце по размеру
2. **Quilt Size Calculator** — размер квилта и количество блоков
3. **Knitting Gauge Calculator** — пересчёт паттерна под свою пряжу
4. **Crochet Amigurumi Size Scaler** — масштабирование амигуруми
5. **Yarn Weight Calculator for Pattern** — сколько мотков пряжи нужно
6. **Sewing Pattern Seam Allowance Adjuster** — корректировка швов
7. **Fabric Shrinkage Calculator** — сколько купить с запасом на усадку
8. **Cross Stitch Thread Calculator** — нитки для вышивки крестиком
9. **Loom Weaving Warp Calculator** — длина основы для ткацкого станка
10. **Leather Hide Area Calculator** — площадь кожи для изделия
11. **Macramé Cord Length Calculator** — длина шнура для макраме
12. **Bookbinding Paper Requirements** — бумага и материалы для переплёта
13. **Screen Printing Ink Coverage** — расход трафаретной краски
14. **Felt Craft Material Calculator** — фетр для поделки по выкройке
15. **Tote Bag Fabric Calculator** — ткань для пошива сумки-шоппера

---

### БАТЧ 11: Agriculture & Farming (Раздел: Science → Everyday)
*Практически отсутствует у всех. Ниша с растущей аудиторией.*

1. **Crop Yield Estimator** — урожайность по площади и культуре
2. **Fertilizer NPK Application Rate** — доза удобрений на акр/гектар
3. **Pesticide Dilution Rate Calculator** — разведение пестицида на площадь
4. **Irrigation Water Requirement by Crop** — потребность в воде по культуре
5. **Growing Degree Days (GDD) Calculator** — тепловые единицы для роста растений
6. **Frost Date Planting Calendar** — когда сажать по дате последнего мороза
7. **Livestock Feed Conversion Ratio** — конверсия корма в прирост массы
8. **Poultry Flock Profitability Calculator** — прибыльность куриной фермы
9. **Dairy Cow Milk Production Value** — выручка от молочного производства
10. **Beehive Honey Yield Calculator** — урожай мёда от одного улья
11. **Aquaculture Fish Stocking Density** — плотность посадки рыбы в УЗВ
12. **Aquaponics Fish-to-Plant Ratio** — баланс рыбы и растений в аквапонике
13. **Market Garden Profitability** — доходность рыночного огорода
14. **CSA Share Pricing Calculator** — цена абонемента фермерской корзины
15. **Cover Crop Seed Rate Calculator** — норма высева сидерата

---

### БАТЧ 12: Emergency Preparedness (Раздел: Everyday)
*Уникальная ниша. Никто не делает. Высокий поисковый спрос после катастроф.*

1. **Emergency Food Supply Calculator** — запас еды для семьи на X дней
2. **Emergency Water Storage Calculator** — литры воды на человека в день
3. **Bug-Out Bag Weight Calculator** — оптимальный вес 72-часового рюкзака
4. **Generator Fuel Consumption Calculator** — расход бензина для генератора
5. **Solar Generator Sizing Calculator** — мощность генератора для нужд дома
6. **Home Battery Backup Duration** — время автономной работы на батареях
7. **Emergency Fund Months Coverage** — на сколько хватит резервного фонда
8. **Evacuation Time Estimator** — расчётное время эвакуации по маршруту
9. **Fire Extinguisher Coverage Area** — зона покрытия огнетушителя
10. **Medication Emergency Supply Calculator** — запас лекарств на случай ЧС
11. **Radiation Shelter-in-Place Duration** — время укрытия при ядерном инциденте
12. **Flood Damage Estimate Calculator** — оценка ущерба от наводнения
13. **First Aid Kit Supply Checklist** — минимальный состав аптечки на семью
14. **Emergency Communication Range** — дальность рации в разных условиях
15. **Wildfire Evacuation Zone Risk Score** — риск зоны при лесном пожаре

---

### БАТЧ 13: Gaming — Tabletop & Board Games (Раздел: Everyday)
*Настольные игры — растущая ниша. Почти никто не делает калькуляторы.*

1. **D&D Character Stats Point Buy Calculator** — распределение очков характеристик D&D
2. **D&D Encounter Difficulty Calculator** — сложность столкновения по CR существ
3. **D&D Spell Slots Calculator** — количество ячеек заклинаний по уровню
4. **Magic: The Gathering Deck Mana Curve** — оптимальная кривая маны колоды
5. **MTG Probability of Drawing Card** — вероятность вытянуть карту в начале
6. **Pokémon IV/EV Calculator** — эффективные очки Pokémon
7. **Warhammer Point Cost Calculator** — стоимость армии в очках
8. **Board Game Play Time Estimator** — время партии по числу игроков
9. **Dice Pool Probability Calculator** — вероятность при броске нескольких кубиков
10. **Chess ELO Rating Change Calculator** — изменение рейтинга после партии
11. **Catan Resource Production Calculator** — производство ресурсов по позиции
12. **Ticket to Ride Route Score** — очки за маршруты в Ticket to Ride
13. **Risk Battle Probability Calculator** — вероятность победы в Risk
14. **Pandemic Infection Rate Calculator** — распространение болезни в Pandemic
15. **Terraforming Mars Corporation Score** — подсчёт очков по стратегии

---

### БАТЧ 14: Gaming — Video Games (Раздел: Everyday)
*Видеоигры — одна из крупнейших аудиторий. Калькуляторов почти нет.*

1. **Minecraft Resource Calculator** — сколько ресурсов нужно для постройки
2. **Stardew Valley Crop Profit Calculator** — прибыль с культуры по сезону
3. **Animal Crossing Turnip Price Predictor** — предсказание цен на репу
4. **Path of Exile Build DPS Calculator** — урон персонажа в PoE
5. **Elden Ring Optimal Level Calculator** — уровень для вторжений/помощи
6. **League of Legends CS/Min to Gold** — конвертация фармовых миньонов в золото
7. **Clash of Clans Upgrade Time Calculator** — время прокачки базы
8. **Fortnite Storm Circle Timer** — таймер кругов бури Fortnite
9. **WoW Classic Dungeon XP/Hour** — опыт в час в данжах Classic WoW
10. **Hearthstone Card Dust Value** — ценность карт в пыль/крафт
11. **Pokémon GO CP Calculator** — Combat Power после эволюции
12. **FPS Game Sens Converter** — конвертер чувствительности мыши между играми
13. **Game Achievement Completion Time** — примерное время 100% прохождения
14. **Gaming Monitor Refresh Rate vs Resolution** — оптимальный баланс для GPU
15. **Video Game Collection Value Estimator** — стоимость коллекции ретро-игр

---

### БАТЧ 15: Sports Betting & DFS (Раздел: Everyday → Finance)
*Огромная аудитория бетторов. Калькуляторы востребованы.*

1. **Sports Betting Arbitrage Calculator** — гарантированная прибыль на разных линиях
2. **Expected Value (EV) Sports Bet** — математическое ожидание ставки
3. **Parlay Probability & Payout** — детальный расчёт экспресса с вероятностями
4. **Round Robin Bet Calculator** — все комбинации круговой ставки
5. **Teaser Bet Calculator** — расчёт тизера с корректировкой линий
6. **Betting Bankroll Management** — система управления банкроллом
7. **No-Vig Fair Odds Calculator** — честные котировки без маржи букмекера
8. **CLV (Closing Line Value) Calculator** — ценность ставки относительно закрытия линии
9. **Fantasy Football Trade Analyzer** — анализ равноценности трейда
10. **Fantasy Baseball Auction Value** — стоимость игрока на аукционе
11. **DFS Lineup Salary Calculator** — оптимальное использование зарплатного кэпа
12. **Sports Betting ROI Tracker** — доходность ставок по истории
13. **Point Spread to Probability** — перевод форы в вероятность победы
14. **Moneyline Implied Probability** — вероятность из американских котировок
15. **Prop Bet Edge Calculator** — поиск ценности в тотальных ставках

---

### БАТЧ 16: Mental Health & Digital Wellness (Раздел: Health)
*Растущий спрос. Конкуренты имеют только базовые скоринги.*

1. **Screen Time Health Impact Calculator** — влияние экранного времени на здоровье
2. **Digital Detox Score** — насколько срочно нужен цифровой детокс
3. **Social Media Anxiety Index** — оценка тревоги от соцсетей
4. **Doom Scrolling Time Cost** — сколько часов/лет тратится на бессмысленный скролл
5. **Loneliness Index Calculator** — оценка социальной изоляции по UCLA шкале
6. **Work-Life Balance Score** — числовая оценка баланса работы и жизни
7. **Cognitive Load Estimator** — насколько перегружен мозг в течение дня
8. **Decision Fatigue Calculator** — усталость от принятия решений
9. **Therapy Cost ROI Calculator** — стоимость терапии vs. производительность
10. **Burnout Recovery Timeline** — сколько времени нужно на восстановление от выгорания
11. **Digital Minimalism Score** — оценка цифровой минималистичности
12. **Sleep Quality vs Screen Time** — корреляция качества сна и экранов
13. **Mindfulness Practice ROI** — продуктивность при регулярной медитации
14. **Emotional Regulation Score (DBT-based)** — оценка навыков регуляции эмоций
15. **Mental Health Day Need Predictor** — когда следует взять mental health day

---

### БАТЧ 17: Sustainability & Net Zero (Раздел: Science → Everyday)
*ESG и личная устойчивость — растущий тренд.*

1. **Personal Net Zero Date Calculator** — когда достигнешь нулевых выбросов
2. **EV vs ICE 10-Year Total Cost** — детальное сравнение электро vs бензин
3. **Heat Pump vs Gas Furnace ROI** — окупаемость теплового насоса
4. **Home Electrification Cost Calculator** — полный бюджет перехода с газа на электро
5. **Electric Water Heater vs Gas** — экономия при переходе на электро-бойлер
6. **EV Home Charging Station Cost** — установка зарядки + экономия на АЗС
7. **Electric Bike vs Car Annual Cost** — экономия при переходе на е-велосипед
8. **Vegan Diet Carbon Savings** — снижение углеродного следа при переходе на веганство
9. **Food Miles Carbon Calculator** — углеродный след доставки еды
10. **Fast Fashion Environmental Cost** — реальная стоимость дешёвой одежды
11. **Microplastics Exposure Estimator** — ежедневная доза микропластика
12. **Carbon Tax Financial Impact** — как углеродный налог влияет на личные расходы
13. **Net Metering Solar Savings** — экономия при продаже солнечной энергии в сеть
14. **Community Solar Share Savings** — выгода от участия в солнечной кооперации
15. **Home Energy Audit Savings Estimator** — потенциал экономии после аудита

---

### БАТЧ 18: Specialty Nutrition (Раздел: Health)
*Диетические подходы с аудиторией но без калькуляторов.*

1. **Anti-Inflammatory Diet Score** — рейтинг противовоспалительности рациона
2. **FODMAP Load Calculator** — нагрузка FODMAP за приём пищи (для СРК)
3. **Histamine Intolerance Food Load** — уровень гистамина в дневном рационе
4. **Oxalate Content Daily Calculator** — суточное потребление оксалатов
5. **Lectin Avoidance Score** — уровень лектинов в рационе
6. **Ayurvedic Dosha Food Balance** — баланс дош по аюрведическому питанию
7. **Carnivore Diet Nutrient Completeness** — полнота питательных веществ на карниворе
8. **Mediterranean Diet Score** — соответствие средиземноморской диете
9. **DASH Diet Sodium & Nutrients Tracker** — соответствие диете DASH
10. **Blue Zone Diet Adherence Calculator** — насколько питание соответствует Blue Zones
11. **Food Combining Compatibility Check** — совместимость продуктов по теории
12. **Sulfur-Rich Food Load Calculator** — суточное потребление серосодержащих продуктов
13. **Nightshade Sensitivity Score** — уровень пасленовых в рационе
14. **Anti-Candida Diet Compliance** — соответствие диете против кандиды
15. **Lecky Gut Food Risk Score** — риск проницаемости кишечника по рациону

---

### БАТЧ 19: Automotive Specialty (Раздел: Science → Everyday)
*Тюнинг, EV-специфика, лизинг — незаполненные ниши.*

1. **EV Battery Degradation Estimator** — деградация батареи по циклам зарядки
2. **EV Range in Cold Weather** — потеря запаса хода при температуре ниже нуля
3. **EV Charging Cost at Home vs Public** — сравнение стоимости зарядки дома и на станции
4. **Electric Car Lease vs Buy Calculator** — лизинг vs покупка электромобиля
5. **Hybrid vs EV Fuel Savings** — сравнение гибрида и электро по пробегу
6. **Car Wrap Cost Estimator** — стоимость оклейки кузова плёнкой
7. **Window Tint Heat Rejection Value** — эффективность тонировки по классу плёнки
8. **Lift Kit Geometry Calculator** — изменение геометрии подвески при лифте
9. **Wheel Spacer Safety Check** — безопасность распорок по нагрузке
10. **Turbo Boost Pressure Calculator** — давление наддува и прирост мощности
11. **Nitrous Oxide Jet Sizing** — жиклёр закиси азота для kit'а
12. **Engine Swap Cost Estimator** — бюджет на свап двигателя
13. **Dyno Tune Power Gain Estimator** — прирост мощности от тюнинга
14. **Air Suspension Load Calculator** — нагрузка на пневмоподвеску
15. **Supercharger vs Turbocharger ROI** — компрессор vs турбо: стоимость vs прирост

---

### БАТЧ 20: Music Production & Business (Раздел: Everyday → Finance)
*Музыкальный бизнес — специфические расчёты отсутствуют везде.*

1. **Spotify Streaming Royalty Calculator** — заработок с числа стримов
2. **Apple Music vs Spotify Royalty Comparison** — где выгоднее выкладывать музыку
3. **Music Sync Licensing Value** — стоимость синхронизации для фильма/рекламы
4. **Recording Studio Session Cost** — стоимость записи по часам + инжиниринг
5. **Home Studio Setup ROI** — окупаемость домашней студии
16. **Music Distribution Fee Comparison** — DistroKid vs TuneCore vs CD Baby
6. **Tour Profit/Loss Calculator** — доходность турне с учётом всех расходов
7. **Concert Ticket Pricing Model** — оптимальная цена билета для окупаемости
8. **Beat Selling Price Guide** — сколько брать за бит: lease vs exclusive
9. **DJ Rate Calculator** — ставка диджея по типу мероприятия
10. **Band Merch Profit Margin** — маржа с мерча на концертах
11. **Vinyl Record Pressing Cost** — стоимость тиража винила
12. **Music Copyright Value Estimator** — ценность каталога прав
13. **Sample Clearance Cost Estimate** — стоимость очистки сэмпла
14. **Music Lesson Pricing Calculator** — оптимальная цена урока по уровню
15. **Podcast vs YouTube Audio Revenue** — сравнение монетизации аудио-контента

---

### БАТЧ 21: Photography & Videography Business (Раздел: Finance → Everyday)
*Фотографы-фрилансеры — большая аудитория с конкретными нуждами.*

1. **Photography Session Pricing Calculator** — правильная цена фотосессии
2. **Wedding Photography Package Builder** — стоимость пакета свадебного фото
3. **Video Production Day Rate Calculator** — дневная ставка видеографа
4. **Drone Photography Pricing Guide** — тарифы для аэросъёмки
5. **Stock Photography Monthly Earnings** — потенциальный доход от стоков
6. **Photography Business Break-Even** — минимум съёмок для покрытия расходов
7. **Camera Equipment Depreciation** — амортизация техники для налогов
8. **Timelapse Interval Calculator** — интервал съёмки для нужной скорости видео
9. **ND Filter Exposure Calculator** — выдержка с ND-фильтром по остановкам
10. **Golden Hour Duration Calculator** — длительность золотого часа по широте
11. **Photography Studio Hourly Rate** — аренда студии: сколько брать
12. **YouTube Video Production Cost ROI** — окупаемость вложений в видео
13. **Content Creator Equipment Budget** — минимальный набор для старта
14. **Photo Editing Time Billing Rate** — стоимость ретуши по времени
15. **Film Photography Cost per Shot** — стоимость кадра на плёнку vs цифра

---

### БАТЧ 22: Wedding & Event Planning (Раздел: Finance → Everyday)
*Свадебное планирование — очень высокий поисковый спрос.*

1. **Wedding Budget by Guest Count** — влияние числа гостей на каждый элемент
2. **Wedding Venue Comparison Calculator** — сравнение залов по всем параметрам
3. **Wedding Catering Cost Per Head** — еда + обслуживание за гостя
4. **DJ vs Live Band Cost Comparison** — что дешевле и когда
5. **Wedding Flowers Cost Estimator** — цветы по типу оформления и сезону
6. **Wedding Favor Cost per Guest** — бюджет подарков по числу гостей
7. **Wedding Photography vs Videography ROI** — что важнее вложить больше
8. **Destination Wedding Cost Comparison** — Мексика vs Италия vs Мальдивы
9. **Wedding Dress Budget Calculator** — dress + alterations + accessories
10. **Honeymoon Budget Builder** — медовый месяц по типам путешествий
11. **Corporate Event ROI Calculator** — возврат инвестиций от корпоративного события
12. **Birthday Party Budget by Age** — бюджет дня рождения: ребёнок vs взрослый
13. **Baby Shower Budget Calculator** — планирование бюджета Baby Shower
14. **Event Staffing Ratio Calculator** — нужное число персонала на N гостей
15. **Trade Show ROI Calculator** — окупаемость участия в выставке

---

### БАТЧ 23: Parenting & Family Finance (Раздел: Finance → Health)
*Родители — одна из крупнейших поисковых аудиторий.*

1. **Cost of Raising a Child (by age)** — расходы на ребёнка от 0 до 18 лет
2. **Nanny vs Daycare vs Au Pair Cost** — детальное сравнение вариантов
3. **After-School Activity Budget** — сколько уходит на кружки в год
4. **Kids Allowance Growth Simulator** — что если вкладывать карманные деньги
5. **Tooth Fairy Inflation Calculator** — сколько платит Tooth Fairy в 2026 году
6. **School Lunch vs Packed Lunch Savings** — экономия за год от ланч-бокса
7. **Birthday Party Per-Head Cost** — стоимость праздника за человека
8. **Teen Car Insurance Add-on Cost** — дополнительная страховка на подростка
9. **College Move-In Cost Estimator** — расходы при переезде в колледж
10. **Boomerang Adult Financial Impact** — расходы при возврате взрослого ребёнка
11. **Multigenerational Home Cost Savings** — выгода совместного проживания поколений
12. **Kids Sports Equipment Cost Tracker** — годовые расходы на спортивный инвентарь
13. **Family Vacation Budget Optimizer** — бюджет отпуска по возрастам детей
14. **School Supply Annual Budget** — ежегодные расходы на канцелярию
15. **Child Life Insurance Need Calculator** — нужна ли страховка жизни на ребёнка

---

### БАТЧ 24: Remote Work & Productivity (Раздел: Finance → Everyday)
*Remote work — постоянный тренд с финансовыми расчётами.*

1. **Remote Work vs Office Salary Comparison** — реальная разница с учётом расходов
2. **Home Office Tax Deduction Calculator** — вычет за домашний офис (US/UK)
3. **Commute Cost Annual Savings** — экономия при переходе на удалёнку
4. **Co-working Space vs Home Office** — когда выгоднее коворкинг
5. **Four-Day Work Week Productivity Model** — производительность при 4-дневной неделе
6. **Meeting ROI Calculator** — стоимость встречи в долларах по зарплатам
7. **Email Time Drain Annual Cost** — сколько стоит компании трата времени на email
8. **Context Switching Cost Calculator** — потери от переключения задач
9. **Deep Work Hours Value Calculator** — ценность часов глубокой концентрации
10. **Delegation ROI Calculator** — выгода от делегирования задач
11. **Automation Savings Calculator** — экономия от автоматизации процессов
12. **Virtual Assistant ROI Calculator** — окупаемость виртуального помощника
13. **Remote Team Time Zone Overlap** — количество пересекающихся рабочих часов
14. **Digital Nomad Income Tax Comparison** — налоги в разных юрисдикциях
15. **Outsourcing vs In-house Cost** — аутсорс vs штатный сотрудник

---

### БАТЧ 25: Travel & Points Hacking (Раздел: Finance → Everyday)
*Трэвел-хакинг — огромная ниша без специализированных инструментов.*

1. **Credit Card Sign-Up Bonus Value** — стоимость бонуса при открытии карты
2. **Points vs Cash Flight Comparison** — мили или деньги: что выгоднее
3. **Hotel Points Value Calculator** — стоимость одного пойнта лояльности
4. **Travel Rewards Optimization** — максимизация наград по категориям трат
5. **Airline Miles Expiration Value** — срочность использования миль
6. **Travel Hacking Annual Savings** — годовая экономия опытного трэвел-хакера
7. **Backpacking Budget by Country** — суточный бюджет по направлениям
8. **Slow Travel Cost Savings** — экономия при проживании 1+ месяц в месте
9. **Digital Nomad City Cost Index** — стоимость жизни для удалёнщика
10. **Long-Term Travel vs Home Cost** — выгодно ли жить в путешествии
11. **Van Life Annual Cost Calculator** — расходы на жизнь в автодоме
12. **Travel Insurance Break-Even** — когда страховка путешественника окупается
13. **Expat Cost of Living Comparison** — жизнь за границей vs дома
14. **Cruise vs Hotel Vacation Cost** — круиз против классического отдыха
15. **Airport Lounge Access Value** — стоимость доступа в залы ожидания

---

### БАТЧ 26: Pet Specialty (Раздел: Health → Everyday)
*Владельцы экзотических животных и аквариумистов — нишевая аудитория.*

1. **Reptile UV Lighting Requirement** — мощность UV-лампы по виду рептилии
2. **Freshwater Aquarium Stocking Density** — плотность рыбы (дюйм на галлон)
3. **Marine/Reef Tank Stocking Calculator** — допустимая биомасса в морском аквариуме
4. **Planted Tank CO2 Requirement** — потребность в CO2 по объёму и освещению
5. **Aquarium Filter Flow Rate** — нужная производительность фильтра
6. **Vivarium Humidity Calculator** — поддержание влажности для террариума
7. **Bird Cage Minimum Space per Species** — минимальный размер клетки для птицы
8. **Guinea Pig Space Calculator** — площадь вольера на одну/несколько морских свинок
9. **Rabbit Hutch Size per Rabbit** — норматив площади для кроликов
10. **Pet Food Cost Monthly Calculator** — месячный бюджет на корм по виду животного
11. **Vet Cost Annual Budget by Pet** — среднегодовые ветрасходы по виду
12. **Pet Insurance Break-Even Point** — когда страховка питомца себя оправдывает
13. **Livestock Water Daily Needs** — потребность в воде для фермерских животных
14. **Exotic Pet Permit Cost Estimator** — стоимость разрешений на экзота
15. **Multi-Pet Household Cost Calculator** — совокупные расходы при нескольких питомцах

---

### БАТЧ 27: Fashion & Beauty Business (Раздел: Finance → Everyday)
*Модная и бьюти-индустрия — огромная аудитория с финансовыми вопросами.*

1. **Cost Per Wear Calculator** — стоимость вещи за каждый выход
2. **Capsule Wardrobe ROI Calculator** — экономия при переходе на капсульный гардероб
3. **Wardrobe Sustainability Score** — экологичность гардероба по материалам
4. **Luxury Item Resale Value Estimator** — стоимость люкса при перепродаже
5. **Makeup Break-Even vs Drugstore** — когда дорогая косметика выгоднее дешёвой
6. **Hair Dye Developer Ratio Calculator** — соотношение красителя и оксиданта
7. **Sunscreen SPF Need by Skin Type** — минимальный SPF по фототипу
8. **Perfume Longevity Estimator** — длительность звучания по концентрации
9. **Clothing Subscription Box Value** — выгода подписки на одежду
10. **Alterations Cost vs New Purchase** — когда перешить выгоднее новой покупки
11. **Personal Stylist ROI Calculator** — окупаемость услуг стилиста
12. **Beauty Routine Monthly Cost** — реальный бюджет на уход
13. **Hair Growth Rate Calculator** — рост волос по времени и питанию
14. **Skin Aging Calculator** — ускорение/замедление старения кожи
15. **Skincare Ingredient Concentration** — эффективный % активного компонента

---

### БАТЧ 28: SaaS & Startup Metrics (Раздел: Finance)
*B2B SaaS — профессиональная аудитория с высокой ценностью.*

1. **SaaS LTV Calculator** — пожизненная ценность клиента с churn
2. **SaaS LTV:CAC Ratio Calculator** — здоровье unit economics
3. **SaaS MRR Growth Rate** — темп роста MRR и прогноз ARR
4. **SaaS Churn Impact Calculator** — влияние churn на ARR через год
5. **SaaS Net Revenue Retention (NRR)** — удержание и расширение выручки
6. **SaaS Burn Multiple Calculator** — эффективность сжигания капитала
7. **Startup Runway Calculator** — сколько месяцев до нуля по текущему burn
8. **Startup Valuation (Revenue Multiple)** — оценка SaaS по мультипликатору ARR
9. **Freemium Conversion Rate Value** — стоимость freemium-пользователя
10. **SaaS Pricing Tier Optimizer** — оптимальные цены тарифов
11. **Convertible Note Dilution Calculator** — разводнение при конвертации ноты
12. **SAFE Note Terms Calculator** — условия SAFE: валуэйшн кэп vs дисконт
13. **Cap Table Dilution Simulator** — разводнение по раундам финансирования
14. **Employee Option Pool Impact** — влияние опционного пула на долю основателя
15. **Startup Exit Multiple Calculator** — доходность для инвесторов при разных оценках

---

### БАТЧ 29: Health — Chronic Conditions (Раздел: Health)
*Специфические состояния с большой поисковой аудиторией.*

1. **STOP-BANG Sleep Apnea Risk Score** — риск апноэ сна по 8 критериям
2. **FRAX Fracture Risk Calculator** — 10-летний риск перелома (остеопороз)
3. **Kidney Stone Risk Score** — риск образования камней по диете/биохимии
4. **Gallstone Risk Calculator** — риск желчных камней по факторам
5. **Fatty Liver (NAFLD) Score** — степень стеатоза печени
6. **Restless Leg Syndrome Severity** — шкала тяжести СБН
7. **IBS Food Trigger Score** — связь продуктов с симптомами СРК
8. **GERD Symptom Frequency Score** — частота симптомов ГЭРБ
9. **Thyroid Function Load Calculator** — нагрузка на щитовидную железу
10. **Hashimoto's Inflammation Score** — воспаление при тиреоидите
11. **Insulin Resistance Progression** — HOMA-IR прогресс трекер
12. **Metabolic Syndrome Risk Score** — агрегированный риск метаболического синдрома
13. **Migraine Trigger Correlation** — поиск триггеров мигрени по журналу
14. **Fibromyalgia Severity Scale** — шкала тяжести фибромиалгии (FIQ)
15. **Long COVID Symptom Burden Score** — оценка нагрузки симптомов пост-ковида

---

### БАТЧ 30: Crypto & DeFi Advanced (Раздел: Finance)
*DeFi-специфика отсутствует у всех конкурентов.*

1. **Yield Farming APY vs APR Converter** — разница APY и APR в DeFi
2. **Liquidity Pool Fee Income Calculator** — доход LP-провайдера за период
3. **Impermanent Loss Calculator (v3)** — непостоянные потери Uniswap v3
4. **DeFi Leverage Liquidation Price** — цена ликвидации при плечевой позиции
5. **NFT Royalty Income Calculator** — пассивный доход создателя NFT
6. **Crypto Staking Compound Frequency** — оптимальная частота реинвестиций
7. **Layer 2 Gas Savings vs Mainnet** — экономия на L2 vs Ethereum mainnet
8. **Crypto Tax Loss Harvesting Value** — налоговая оптимизация через убытки
9. **DCA Crypto Entry Price Calculator** — средняя цена входа при регулярных покупках
10. **HODL vs Active Trading ROI** — долгосрочное vs активное на истории
11. **Mining Pool Expected Earnings** — ожидаемый доход майнера в пуле
12. **Crypto Lending Rate Comparison** — сравнение ставок: Aave vs Compound vs Morpho
13. **Token Vesting Schedule Value** — стоимость вестинга в зависимости от расписания
14. **DAO Token Governance Value** — стоимость голосующей силы в DAO
15. **Crypto Portfolio Rebalancing Cost** — издержки ребалансировки с учётом газа

---

### БАТЧ 31: Home Renovation ROI (Раздел: Finance → Everyday)
*Расширение существующих строительных калькуляторов в финансовое.*

1. **Kitchen Remodel ROI Calculator** — возврат инвестиций при продаже дома
2. **Bathroom Remodel ROI Calculator** — окупаемость ремонта ванной
3. **Basement Finishing Cost vs Value** — добавленная стоимость при отделке подвала
4. **Attic Conversion ROI** — мансарда: расходы и прирост стоимости
5. **Garage Conversion to ADU Value** — гараж в жилое помещение
6. **Window Replacement Payback Period** — окупаемость новых окон по теплу
17. **Smart Home Installation ROI** — умный дом: расходы vs экономия и стоимость
7. **Swimming Pool ROI** — бассейн увеличивает или снижает стоимость дома
8. **Solar Panel Home Value Increase** — прирост стоимости дома от солнечных панелей
9. **Deck vs Patio ROI Comparison** — терраса из дерева vs мощёная площадка
10. **Landscaping ROI by Project Type** — возврат от озеленения при продаже
11. **Home Addition Cost vs Value** — пристройка комнаты: стоит ли это делать
12. **Roof Replacement ROI** — когда менять крышу и какой материал
13. **HVAC System Upgrade ROI** — возврат от нового HVAC при продаже
14. **Paint Color vs Resale Value** — влияние цвета покраски на цену дома

---

### БАТЧ 32: International & Expat Finance (Раздел: Finance)
*Экспаты и цифровые кочевники — глобальная аудитория.*

1. **FEIE Exclusion Calculator** — исключение иностранных доходов (Foreign Earned Income)
2. **Foreign Tax Credit vs FEIE** — когда выгоднее налоговый кредит vs исключение
3. **Expat Tax Burden Comparison** — налоги в 10+ странах для фрилансера
4. **International Wire Transfer Fee Comparison** — SWIFT vs SEPA vs Wise vs Revolut
5. **Remittance Cost Calculator** — стоимость перевода на родину из разных стран
6. **Dual Citizenship Application Cost** — расходы на получение второго гражданства
7. **Digital Nomad Visa Cost Comparison** — визы цифровых кочевников по странам
8. **Expat Health Insurance Premium** — стоимость страховки экспата по странам
9. **Territorial vs Worldwide Tax System** — влияние на налоги при смене резидентства
10. **Currency Hedging Cost Calculator** — стоимость хеджирования валютных рисков
11. **Purchasing Power Parity Calculator** — реальная стоимость жизни с учётом ПКС
12. **International School Annual Cost** — расходы на международную школу
13. **Expat Package Calculator** — ценность expat-пакета в дополнение к зарплате
14. **Cross-Border Tax Treaty Benefit** — экономия по налоговому договору
15. **Foreign Bank Account FBAR Threshold** — обязанность по FBAR/FATCA

---

### БАТЧ 33: Personal Growth & Habits (Раздел: Everyday → Health)
*Productivity/self-improvement — вечнозелёная ниша.*

1. **Habit Formation Success Probability** — вероятность закрепления привычки по теории
2. **Habit Streak Compound Value** — что даёт 1-летняя непрерывная привычка
3. **Reading Habit Annual ROI** — количество книг в год по времени чтения
4. **Learning a Language: Hours to Fluency** — часы до B2 по языку (FSI данные)
5. **Skill Acquisition Time Estimator** — часы для освоения навыка (10,000 часов Малкольма)
6. **Career Pivot Cost-Benefit Analysis** — выгода смены профессии за 5 лет
7. **Morning Routine Time ROI** — продуктивность утренней рутины
8. **Exercise Habit Lifetime Value** — финансовая ценность регулярных тренировок
9. **Journaling Time vs Mental Health Value** — ценность ежедневного дневника
10. **Networking ROI Calculator** — доход от профессиональных связей
11. **Mentorship Value Calculator** — ценность наставника vs самостоятельного роста
12. **Personal Coaching ROI** — окупаемость коучинга по зарплате
13. **Vocabulary Growth Rate Calculator** — рост словарного запаса при изучении языка
14. **Atomic Habits 1% Daily Compound** — эффект ежедневного улучшения на 1%
15. **Goal Achievement Probability Score** — вероятность достижения цели по факторам

---

### БАТЧ 34: Miscellaneous High-Value (смешанный, добивает до 510)
*Разные нишевые идеи с высоким спросом.*

1. **Divorce Financial Impact Calculator** — полные финансовые потери при разводе
2. **Co-habitation Cost Savings** — выгода от совместного проживания с партнёром
3. **Prenuptial Agreement Value Estimator** — когда брачный договор имеет смысл
4. **Online Dating ROI Calculator** — стоимость поиска партнёра через приложения
5. **Inheritance Tax Minimization** — легальное снижение налога на наследство
6. **Estate Planning Checklist Value** — финансовые потери при отсутствии завещания
7. **Life Insurance Needs (DIME Method)** — страховка через долги/доход/ипотеку/учёбу
8. **Umbrella Insurance Value Calculator** — когда нужна зонтичная страховка
9. **College Degree ROI by Major** — возврат инвестиций в образование по специальности
10. **Student Loan Payoff Strategy Comparison** — avalanche vs snowball vs refinance
11. **Gap Year Financial Impact** — стоимость разрыва в карьере/учёбе
12. **Scholarship Search ROI** — стоимость поиска стипендий vs потенциальный выигрыш
13. **Subscription Box Value Calculator** — выгода подписки vs покупки по отдельности
14. **Monthly Subscription Audit Calculator** — сколько уходит на все подписки в год
15. **Loyalty Program Break-Even** — когда лояльность магазина становится выгодной

---

## 5. СВОДНАЯ ТАБЛИЦА БАТЧЕЙ

| # | Тема батча | Раздел сайта | Аудитория |
|---|-----------|-------------|-----------|
| 1 | AI & LLM Costs | Finance/Tech | разработчики, AI-стартапы |
| 2 | Creator Economy — Video | Finance | YouTubers, стримеры |
| 3 | Creator Economy — E-comm | Finance | Etsy/Amazon продавцы |
| 4 | Gig Economy Platforms | Finance | водители Uber/DoorDash |
| 5 | FIRE Movement | Finance | финансовая независимость |
| 6 | Real Estate Advanced | Finance | инвесторы |
| 7 | Legal & Court | Finance/Legal | все пользователи |
| 8 | Brewing & Fermentation | Everyday | домашние пивовары |
| 9 | 3D Printing & Maker | Everyday | makers, хобби |
| 10 | DIY Crafts & Fabric | Everyday | рукодельницы |
| 11 | Agriculture & Farming | Science | фермеры, огородники |
| 12 | Emergency Preparedness | Everyday | все семьи |
| 13 | Gaming — Tabletop | Everyday | настольщики |
| 14 | Gaming — Video Games | Everyday | геймеры |
| 15 | Sports Betting & DFS | Finance | беттеры |
| 16 | Mental Health Digital | Health | все |
| 17 | Sustainability Net Zero | Science | экологически осознанные |
| 18 | Specialty Nutrition | Health | диетологи, пациенты |
| 19 | Automotive Specialty | Science | автомобилисты |
| 20 | Music Production Business | Finance | музыканты |
| 21 | Photography Business | Finance | фотографы |
| 22 | Wedding & Events | Finance | невесты, ивент-планеры |
| 23 | Parenting Finance | Finance | родители |
| 24 | Remote Work & Productivity | Finance | удалёнщики |
| 25 | Travel & Points Hacking | Finance | путешественники |
| 26 | Pet Specialty | Health | аквариумисты, экзоты |
| 27 | Fashion & Beauty Business | Finance | fashion creators |
| 28 | SaaS & Startup Metrics | Finance | основатели, VCs |
| 29 | Chronic Health Conditions | Health | пациенты, врачи |
| 30 | Crypto & DeFi Advanced | Finance | DeFi-пользователи |
| 31 | Home Renovation ROI | Finance | домовладельцы |
| 32 | International Expat Finance | Finance | экспаты, номады |
| 33 | Personal Growth & Habits | Everyday | саморазвитие |
| 34 | Miscellaneous High-Value | Mixed | широкая аудитория |

**ИТОГО: 34 батча × 15 = 510 калькуляторов**

---

## 6. ПРИОРИТЕТ ЗАПУСКА (по потенциалу трафика)

### Первая волна (батчи 1-5): Максимальный потенциал
- Батч 1: AI & LLM — уникальный контент, нет конкурентов
- Батч 5: FIRE Movement — большое сообщество, вечнозелёный
- Батч 2: Creator Economy Video — миллионы creators
- Батч 4: Gig Economy — десятки миллионов гиг-воркеров в США
- Батч 28: SaaS Metrics — высокая ценность на клик

### Вторая волна (батчи 6-15): Нишевые, но объёмные
### Третья волна (батчи 16-25): Долгосрочное накопление трафика
### Четвёртая волна (батчи 26-34): Добивание длинного хвоста

---

## 7. ТЕХНИЧЕСКИЙ ШАБЛОН ДЛЯ CLAUDE HAIKU

Для каждого батча передавать Haiku следующий промпт:

```
Ты создаёшь 15 калькуляторов для сайта fullcalculator.com.
Сайт уже содержит 5413 калькуляторов, твои должны быть уникальными.

Для каждого калькулятора создай:
1. slug: уникальный URL-slug (kebab-case, только латиница)
2. title: точное название с ключевым словом
3. category: finance/health/everyday/science/math/conversion
4. description: 150-160 символов для мета-тега
5. inputs: массив входных параметров [{name, label, type, unit, placeholder}]
6. formula: описание расчёта (текстом + JavaScript)
7. example: конкретный пример с числами
8. faq: 3 вопроса-ответа для SEO

Список калькуляторов для этого батча:
[ВСТАВИТЬ СПИСОК ИЗ БАТЧА]

Формат вывода: JSON-массив.
```

---

*Документ создан: Март 2026*
*Версия: 1.0*
