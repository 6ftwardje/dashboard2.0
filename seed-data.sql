-- Seed Data voor Cryptoriez Dashboard
-- Run deze SQL in je Supabase SQL Editor na het aanmaken van de schema

-- Insert sample chapters
INSERT INTO chapters (title, description, order_index, video_url, content) VALUES
(
  'Welkom bij Cryptoriez',
  'Een introductie tot cryptocurrency trading en de basisbeginselen',
  1,
  NULL, -- Placeholder voor Vimeo video
  '# Welkom bij Cryptoriez! 🚀

Dit is je eerste stap in de wereld van cryptocurrency trading. In dit hoofdstuk leer je:

## Wat je gaat leren
- **De basis van cryptocurrency** - Wat zijn cryptocurrencies en hoe werken ze?
- **Trading fundamentals** - De belangrijkste concepten die elke trader moet kennen
- **Risicomanagement** - Hoe je je kapitaal beschermt
- **Psychologie van trading** - De mentale aspecten van succesvolle trading

## Belangrijke punten
1. **Start klein** - Begin met bedragen die je kunt missen
2. **Leer continu** - De crypto markt evolueert snel
3. **Blijf gedisciplineerd** - Emoties zijn je grootste vijand
4. **Diversifieer** - Zet niet alles op één paard

## Volgende stappen
Na dit hoofdstuk ga je dieper in op technische analyse en verschillende trading strategieën.

*Succes met je trading journey!* 📈'
),
(
  'Technische Analyse Basis',
  'Leer de fundamenten van chart reading en technische indicatoren',
  2,
  NULL,
  '# Technische Analyse Basis 📊

Technische analyse is een van de belangrijkste tools voor cryptocurrency traders. In dit hoofdstuk leer je:

## Wat is technische analyse?
Technische analyse is de studie van prijsbewegingen en volume om toekomstige marktrichtingen te voorspellen.

## Belangrijke concepten

### 1. Support en Resistance
- **Support**: Prijsniveau waar koopdruk ontstaat
- **Resistance**: Prijsniveau waar verkoopdruk ontstaat

### 2. Trendlijnen
- **Uptrend**: Hogere highs en hogere lows
- **Downtrend**: Lagere highs en lagere lows
- **Sideways**: Consolidatie tussen support en resistance

### 3. Volume
Volume bevestigt de kracht van prijsbewegingen:
- **Hoge volume** = Sterke beweging
- **Lage volume** = Zwakke beweging

## Basis indicatoren

### Moving Averages
- **SMA (Simple Moving Average)**: Gemiddelde prijs over periode
- **EMA (Exponential Moving Average)**: Meer gewicht aan recente prijzen

### RSI (Relative Strength Index)
- Waarden tussen 0-100
- **>70**: Overbought (mogelijke verkoop)
- **<30**: Oversold (mogelijke koop)

## Praktische tips
1. **Combineer indicatoren** - Gebruik meerdere tools
2. **Timeframes** - Analyseer verschillende tijdframes
3. **Backtest** - Test je strategieën op historische data
4. **Blijf objectief** - Laat emoties je analyse niet beïnvloeden

*In het volgende hoofdstuk gaan we dieper in op candlestick patronen!* 🕯️'
),
(
  'Candlestick Patronen',
  'Meer dan 20 belangrijke candlestick patronen die elke trader moet kennen',
  3,
  NULL,
  '# Candlestick Patronen 🕯️

Candlestick patronen zijn visuele representaties van prijsbewegingen en kunnen waardevolle signalen geven.

## Basis candlestick structuur
Elke candlestick heeft vier belangrijke punten:
- **Open**: Opening prijs
- **High**: Hoogste prijs
- **Low**: Laagste prijs  
- **Close**: Sluiting prijs

## Belangrijke patronen

### Bullish Patronen (Koop signalen)

#### 1. Hammer
- Kleine body aan de bovenkant
- Lange onderste schaduw
- **Betekenis**: Mogelijke trend reversal naar boven

#### 2. Bullish Engulfing
- Groene candle die volledig de vorige rode candle omsluit
- **Betekenis**: Sterke koopdruk

#### 3. Morning Star
- Rode candle, kleine candle, groene candle
- **Betekenis**: Trend reversal van bearish naar bullish

### Bearish Patronen (Verkoop signalen)

#### 1. Shooting Star
- Kleine body aan de onderkant
- Lange bovenste schaduw
- **Betekenis**: Mogelijke trend reversal naar beneden

#### 2. Bearish Engulfing
- Rode candle die volledig de vorige groene candle omsluit
- **Betekenis**: Sterke verkoopdruk

#### 3. Evening Star
- Groene candle, kleine candle, rode candle
- **Betekenis**: Trend reversal van bullish naar bearish

## Praktische toepassing
1. **Confirmeer met volume** - Patronen zijn betrouwbaarder met hoge volume
2. **Kijk naar context** - Patronen werken beter in bepaalde marktcondities
3. **Combineer met andere tools** - Gebruik samen met support/resistance
4. **Practice** - Oefen het herkennen van patronen op demo accounts

*Volgende hoofdstuk: Risk Management en Position Sizing* ⚖️'
),
(
  'Risk Management',
  'Bescherm je kapitaal met professionele risk management technieken',
  4,
  NULL,
  '# Risk Management ⚖️

Risk management is cruciaal voor langetermijn succes in trading. Zonder goede risk management ga je vroeg of laat failliet.

## De gouden regels

### 1. Risk per Trade
- **Maximaal 1-2%** van je account per trade
- Bij een €10.000 account: max €100-200 risico per trade

### 2. Stop Loss
- **Altijd** een stop loss plaatsen
- Stop loss = je maximale risico per trade
- **No exceptions!**

### 3. Position Sizing
```
Position Size = (Account Size × Risk %) / (Entry Price - Stop Loss)
```

**Voorbeeld:**
- Account: €10.000
- Risk: 1%
- Entry: €50.000
- Stop Loss: €48.000
- Position Size = (€10.000 × 0.01) / (€50.000 - €48.000) = €50

## Risk/Reward Ratio
- **Minimum 1:2** risk/reward ratio
- Bij €100 risico, target minimaal €200 winst
- Dit betekent dat je slechts 33% van je trades hoeft te winnen

## Portfolio Management
### Diversificatie
- **Maximaal 5-10%** in één cryptocurrency
- Spreid over verschillende sectoren
- Houd altijd cash reserves

### Correlation
- Vermijd sterk gecorreleerde assets
- Bitcoin en altcoins bewegen vaak samen
- Diversifieer over verschillende markten

## Emotionele discipline
1. **Stick to your plan** - Wijzig nooit je risk parameters tijdens een trade
2. **Accepteer verliezen** - Verliezen zijn onderdeel van trading
3. **Geen revenge trading** - Handel niet uit emotie na een verlies
4. **Take profits** - Greed is de grootste vijand

## Tools voor risk management
- **Position size calculator**
- **Portfolio tracker**
- **Stop loss alerts**
- **Risk monitoring dashboard**

*Volgende hoofdstuk: Trading Psychologie* 🧠'
),
(
  'Trading Psychologie',
  'Overwin je emoties en ontwikkel de mindset van een succesvolle trader',
  5,
  NULL,
  '# Trading Psychologie 🧠

Trading is 80% psychologie en 20% techniek. Je mindset bepaalt je succes meer dan welke strategie dan ook.

## De grootste psychologische valkuilen

### 1. Fear (Angst)
- **Fear of Missing Out (FOMO)**: Kopen op het hoogste punt
- **Fear of Loss**: Te vroeg verkopen bij winst
- **Fear of Being Wrong**: Niet handelen uit angst voor verlies

### 2. Greed (Hebzucht)
- **Overtrading**: Te veel trades plaatsen
- **Holding too long**: Niet verkopen bij targets
- **Leverage abuse**: Te veel leverage gebruiken

### 3. Hope (Hoop)
- **Hoping for recovery**: Verliezende posities niet sluiten
- **Hoping for more**: Winst niet nemen bij targets
- **Hoping for luck**: Vertrouwen op geluk in plaats van strategie

## De juiste mindset ontwikkelen

### 1. Accepteer verliezen
- Verliezen zijn **normaal** en **noodzakelijk**
- Focus op **risk management** in plaats van winst
- Elke trade is een **experiment**, niet een persoonlijke aanval

### 2. Discipline boven alles
- **Stick to your plan** - Altijd
- **No exceptions** - Ook niet bij "zekere" trades
- **Consistency** - Kleine consistente winsten > grote inconsistente winsten

### 3. Patience (Geduld)
- Wacht op **kwaliteit setups**
- Niet elke beweging hoeft gehandeld te worden
- **Less is more** - Beter 5 goede trades dan 20 slechte

## Emotionele controle technieken

### 1. Journaling
- Schrijf elke trade op
- Analyseer je emoties
- Identificeer patronen

### 2. Meditation
- Dagelijkse meditatie
- Mindfulness tijdens trading
- Stress reductie

### 3. Physical Health
- Regelmatige beweging
- Goede slaap
- Gezonde voeding

## De trader's mindset checklist
- [ ] Ik accepteer verliezen als onderdeel van het proces
- [ ] Ik handel alleen volgens mijn plan
- [ ] Ik neem verantwoordelijkheid voor mijn acties
- [ ] Ik focus op proces, niet op uitkomsten
- [ ] Ik blijf geduldig en wacht op kwaliteit setups
- [ ] Ik beheer mijn risico altijd correct
- [ ] Ik leer van elke trade, win of verlies

## Wanneer niet te handelen
- Na een grote verlies
- Bij emotionele stress
- Tijdens belangrijke levensgebeurtenissen
- Bij vermoeidheid
- Onder invloed van alcohol/drugs

*Volgende hoofdstuk: Advanced Trading Strategies* 🎯'
);

-- Insert sample resources
INSERT INTO resources (title, url, description, category) VALUES
(
  'TradingView',
  'https://tradingview.com',
  'De beste charting platform voor technische analyse',
  'trading'
),
(
  'CoinMarketCap',
  'https://coinmarketcap.com',
  'Marktdata en prijsinformatie voor alle cryptocurrencies',
  'analysis'
),
(
  'CoinGecko',
  'https://coingecko.com',
  'Alternatieve marktdata platform met extra metrics',
  'analysis'
),
(
  'Binance Academy',
  'https://academy.binance.com',
  'Gratis educatieve content over cryptocurrency en blockchain',
  'education'
),
(
  'Crypto.com University',
  'https://crypto.com/university',
  'Uitgebreide crypto educatie van beginner tot expert',
  'education'
),
(
  'CoinDesk',
  'https://coindesk.com',
  'Leading cryptocurrency news en market analysis',
  'news'
),
(
  'The Block',
  'https://theblock.co',
  'Professional crypto news en research',
  'news'
),
(
  'DeFiPulse',
  'https://defipulse.com',
  'DeFi protocol rankings en TVL data',
  'analysis'
),
(
  'Glassnode',
  'https://glassnode.com',
  'On-chain analytics en market intelligence',
  'analysis'
),
(
  'Fear & Greed Index',
  'https://alternative.me/crypto/fear-and-greed-index/',
  'Markt sentiment indicator gebaseerd op verschillende metrics',
  'analysis'
),
(
  'Crypto Twitter',
  'https://twitter.com',
  'Volg belangrijke crypto influencers en traders',
  'community'
),
(
  'Reddit r/CryptoCurrency',
  'https://reddit.com/r/CryptoCurrency',
  'Grootste crypto community op Reddit',
  'community'
),
(
  'Discord Crypto Communities',
  'https://discord.gg',
  'Join verschillende crypto Discord servers voor discussie',
  'community'
),
(
  'CryptoCompare',
  'https://cryptocompare.com',
  'Portfolio tracking en market data aggregator',
  'trading'
),
(
  'Blockfolio',
  'https://blockfolio.com',
  'Mobile portfolio tracker met price alerts',
  'trading'
),
(
  'Delta',
  'https://delta.app',
  'Advanced portfolio tracking met P&L analytics',
  'trading'
),
(
  'Crypto Tax Calculator',
  'https://cryptotaxcalculator.io',
  'Automatische berekening van crypto belastingen',
  'general'
),
(
  'Ledger Hardware Wallet',
  'https://ledger.com',
  'Hardware wallet voor veilige opslag van cryptocurrencies',
  'general'
),
(
  'Trezor Hardware Wallet',
  'https://trezor.io',
  'Alternatieve hardware wallet optie',
  'general'
),
(
  'MetaMask',
  'https://metamask.io',
  'Browser wallet voor Ethereum en EVM compatibele chains',
  'general'
);
