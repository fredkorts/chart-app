# Graafiku Rakendus

## Rakenduse Ülevaade

See projekt on React + TypeScript põhine ülesannete haldamise dashboard, mis võimaldab kasutajatel hõlpsalt planeerida, visualiseerida ja hallata oma tööd kvartalipõhisel ajajoonel. Rakendus pakub selget, interaktiivset graafikut, kus ülesanded on kuvatud horisontaalsete ribadena, muutes lihtsaks näha ajakavasid, kattuvusi ja tähtaegu ühe pilguga.

## Põhifunktsioonid

**Uute Ülesannete Lisamine** – Kasutajad saavad luua ülesandeid nimega, algus- ja lõppkuupäevaga. Sisendi valideerimine tagab õige vormingu (PP.KK.AAAA) ja loogilised kuupäevavahemikud.

**Interaktiivne Ajajoon** – Ülesanded kuvatakse reageerival ajajoonel unikaalsete värvidega kiireks äratundmiseks. Kasutajad saavad vaadata kvartalite kaupa, kus mitut perioodi hõlmavad ülesanded kuvatakse osaliste ribadena.

**Kvartali Navigeerimine** – Lihtsad noolnupud võimaldavad lülituda eelmiste ja järgmiste kvartalite vahel, uuendades graafikut ja nähtavaid ülesandeid vastavalt.

**Ülesannete Detailid** – Ülesandele klõpsates avaneb vaade detailse informatsiooniga.

**Reageeriv Disain** – Optimeeritud nii lauaarvuti kui mobiili jaoks. Väiksematel ekraanidel virnastatakse vormiväljad vertikaalselt ja ajajoon kerib horisontaalselt hõlpsa juurdepääsu jaoks.

## Kasutajakogemus

Rakendus on disainitud tunduma nagu:

- Visuaalne kalender projektide jaoks
- Lihtne ülesannete jälgija
- Ajajoonevahend ajastamise ja planeerimise jaoks

## Eelised

**Kiire Ülevaade** – Näe, mis toimub sel kvartalil ühe pilguga.

**Lihtne Planeerimine** – Tuvasta saadaolevad ajaslotid uue töö jaoks.

**Visuaalne Selgus** – Märka koheselt kattuvaid või pikendatud ülesandeid.

**Kerge Haldamine** – Lisa ja jälgi ülesandeid sekunditega.

## Näited Kasutusaladest

**Projektijuhid** saavad määratleda verstaposti kvartali kohta, vaadata läbi edenemist koosolekutel ja valmistuda eelseisvaks etappideks.

**Vabakutselised** saavad jälgida mitut kliendiprojekti, eristada neid värvide järgi ja hinnata kättesaadavust enne uue töö võtmist.

## Seadistamine Kohalikus Masinas

### Eeltingimused

Enne alustamist veendu, et sul on installitud:

- **Node.js** (versioon 18 või uuem)
- **npm** (tuleb Node.js-ga kaasa)
- **Git** (repositooriumi kloonimiseks)

### Installeerimisjuhised

1. **Klooni repositoorium:**

   ```bash
   git clone https://github.com/fredkorts/chart-app.git
   cd chart-app
   ```

2. **Installi sõltuvused:**

   ```bash
   npm install
   ```

3. **Käivita arenduskeskkond:**

   ```bash
   npm run dev
   ```

4. **Ava brauser:**
   - Navigeeri aadressile `http://localhost:5173`
   - Rakendus laadib automaatselt ja on valmis kasutamiseks

### Saadaolevad Skriptid

- `npm run dev` - Käivitab arendusserveri (Vite)
- `npm run build` - Ehitab produkstiooni versiooni
- `npm run preview` - Eelvaatleb ehitatud versiooni
- `npm run test` - Käivitab üksustestid
- `npm run test:watch` - Käivitab testid jälgimisrežiimis
- `npm run lint` - Kontrollib koodi kvaliteeti ESLint-ga

### Projekti Struktuur

```
src/
├── components/          # Taaskasutatavad UI komponendid
│   ├── common/         # Üldised komponendid (ErrorDisplay, LoadingSpinner)
│   └── ui/             # UI komponendid (Button, Input, Modal, jne)
├── features/           # Funktsionaalsuspõhised moodulid
│   ├── gantt/         # Ganti diagrammi komponendid ja loogika
│   └── tasks/         # Ülesannete haldamise funktsioonid
├── hooks/             # Kohandatud React hookid
├── types/             # TypeScript tüübidefinitsioonid
├── utils/             # Abitööud ja konstandid
└── test/              # Testi seadistused ja abivahendid
```

## Ükustestide Käivitamine

Rakendus kasutab **Vitest** testimisraamistikku koos **React Testing Library**-ga.

### Testide Käivitamine

1. **Kõigi testide käivitamine:**

   ```bash
   npm run test
   ```

2. **Testide käivitamine jälgimisrežiimis:**

   ```bash
   npm run test:watch
   ```

   See jälgib failimuudatusi ja käivitab testid automaatselt uuesti.

3. **Testide käivitamine katvuse raportiga:**
   ```bash
   npm run test -- --coverage
   ```

### Testimise Seadistus

- **Testimisraamistik:** Vitest
- **Renderdamise testimine:** React Testing Library
- **Assertsioonid:** Vitest sisseehitatud assertion library
- **Mokimine:** Vitest sisseehitatud mokimise võimalused

### Testifailide Asukoht

Testifailid asuvad komponentide kõrval `__tests__` kaustades või faili lõpus `*.test.tsx`/`*.test.ts` formaadis:

```
src/
├── components/ui/__tests__/
│   ├── Button.test.tsx
│   ├── Input.test.tsx
│   └── Modal.test.tsx
├── features/tasks/hooks/__tests__/
│   └── useTasks.test.ts
└── utils/__tests__/
    └── dateUtils.test.ts
```

### Testide Kirjutamine

Uute testide lisamiseks:

1. Loo `*.test.tsx` või `*.test.ts` fail komponendi kõrvale
2. Kasuta React Testing Library-t komponendite testimiseks
3. Kasuta Vitest assertion meetodeid (`expect`, `toBe`, `toContain`, jne)

## Tehnoloogiad

- **Frontend:** React 18, TypeScript
- **UI Teek:** Ant Design
- **Stiilimine:** CSS Modules
- **Ehitamine:** Vite
- **Testimine:** Vitest, React Testing Library
- **Kood Kvaliteet:** ESLint, TypeScript

## Arendus

### Koodi Stiil

Projekt järgib:

- TypeScript range tüüpimist
- ESLint soovitusi
- Funktsionaalne React (hooks)
- Komponendipõhine arhitektuur

### Panustamine

1. Fork-i repositoorium
2. Loo uus branch (`git checkout -b feature/uus-funktsioon`)
3. Tee muudatused ja lisa testid
4. Käivita testid (`npm run test`)
5. Commit-i muudatused (`git commit -m 'Lisa uus funktsioon'`)
6. Push-i branch-i (`git push origin feature/uus-funktsioon`)
7. Loo Pull Request

## Litsents

See projekt on litsentseeritud MIT litsentsi all.
