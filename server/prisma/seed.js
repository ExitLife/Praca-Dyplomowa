const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Rozpoczynam wypełnianie bazy danych...\n');

  // 1. KATEGORIE
  const categories = [
    { name: 'Muzyka' },
    { name: 'Teatr' },
    { name: 'Kino' },
    { name: 'Wystawy' },
    { name: 'Festiwale' },
    { name: 'Stand-up' },
    { name: 'Edukacja' },
    { name: 'Dla dzieci' }
  ];

  console.log('📁 Tworzenie kategorii...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
  }
  console.log('✅ Kategorie utworzone!\n');

  // 2. UŻYTKOWNICY
  console.log('👤 Tworzenie użytkowników...');
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  const organizer = await prisma.user.upsert({
    where: { email: 'organizator@test.pl' },
    update: {},
    create: {
      email: 'organizator@test.pl',
      password: hashedPassword,
      role: 'organizer'
    }
  });
  console.log('  ✓ organizator@test.pl (hasło: test123)');

  const organizer2 = await prisma.user.upsert({
    where: { email: 'events@kulturalnie.pl' },
    update: {},
    create: {
      email: 'events@kulturalnie.pl',
      password: hashedPassword,
      role: 'organizer'
    }
  });
  console.log('  ✓ events@kulturalnie.pl (hasło: test123)');

  await prisma.user.upsert({
    where: { email: 'jan@test.pl' },
    update: {},
    create: {
      email: 'jan@test.pl',
      password: hashedPassword,
      role: 'user'
    }
  });
  console.log('  ✓ jan@test.pl (hasło: test123)\n');

  // 3. POBIERZ KATEGORIE Z BAZY
  const allCategories = await prisma.category.findMany();
  const getCategoryId = (name) => allCategories.find(c => c.name === name)?.id || allCategories[0].id;

  // 4. WYDARZENIA (LUTY - WRZESIEŃ 2026)
  console.log('🎉 Tworzenie wydarzeń...\n');
  
  const events = [

    // ==================== LUTY 2026 ====================
    {
      title: 'Walentynkowy Koncert Fortepianowy',
      description: 'Romantyczny wieczór z muzyką Chopina i Liszta w kameralnej atmosferze.',
      date: new Date('2026-02-14T19:00:00'),
      location: 'Filharmonia Narodowa, Warszawa',
      latitude: 52.2319, longitude: 21.0067,
      categoryId: getCategoryId('Muzyka'), organizerId: organizer.id
    },
    {
      title: 'Stand-up Walentynkowy: Miłość i inne katastrofy',
      description: 'Komicy opowiedzą o związkach, randkach i miłosnych wpadkach.',
      date: new Date('2026-02-14T20:30:00'),
      location: 'Klub Komediowy, Kraków',
      latitude: 50.0614, longitude: 19.9366,
      categoryId: getCategoryId('Stand-up'), organizerId: organizer.id
    },
    {
      title: 'Karnawałowy Bal Maskowy',
      description: 'Ostatni weekend karnawału! Muzyka na żywo, maski obowiązkowe.',
      date: new Date('2026-02-15T20:00:00'),
      location: 'Pałac Kultury i Nauki, Warszawa',
      latitude: 52.2319, longitude: 21.0067,
      categoryId: getCategoryId('Muzyka'), organizerId: organizer2.id
    },
    {
      title: 'Wystawa: Street Art w Polsce',
      description: 'Przegląd najciekawszych murali i instalacji ulicznych z polskich miast.',
      date: new Date('2026-02-18T10:00:00'),
      location: 'Muzeum Sztuki Nowoczesnej, Warszawa',
      latitude: 52.2328, longitude: 21.0055,
      categoryId: getCategoryId('Wystawy'), organizerId: organizer.id
    },
    {
      title: 'Warsztaty Ceramiki dla Początkujących',
      description: 'Stwórz swój pierwszy kubek na kole garncarskim. Materiały w cenie.',
      date: new Date('2026-02-21T11:00:00'),
      location: 'Pracownia ArtHouse, Wrocław',
      latitude: 51.1103, longitude: 17.0316,
      categoryId: getCategoryId('Edukacja'), organizerId: organizer2.id
    },
    {
      title: 'Zimowy Festiwal Filmowy',
      description: 'Trzy dni z najlepszymi filmami niezależnymi z całego świata.',
      date: new Date('2026-02-22T14:00:00'),
      location: 'Kino Muranów, Warszawa',
      latitude: 52.2497, longitude: 20.9986,
      categoryId: getCategoryId('Kino'), organizerId: organizer.id
    },
    {
      title: 'Bajkowa Niedziela: Piotruś Pan',
      description: 'Interaktywny spektakl dla dzieci 4-10 lat. Każdy może zostać Piotrusiem!',
      date: new Date('2026-02-22T11:00:00'),
      location: 'Teatr Lalka, Warszawa',
      latitude: 52.2523, longitude: 20.9876,
      categoryId: getCategoryId('Dla dzieci'), organizerId: organizer.id
    },
    {
      title: 'Festiwal Czekolady',
      description: 'Degustacje, warsztaty czekoladowe i pokazy mistrzów cukiernictwa.',
      date: new Date('2026-02-28T10:00:00'),
      location: 'Hala Koszyki, Warszawa',
      latitude: 52.2225, longitude: 21.0148,
      categoryId: getCategoryId('Festiwale'), organizerId: organizer2.id
    },

    // ==================== MARZEC 2026 ====================
    {
      title: 'Noc Oscarowa na Wielkim Ekranie',
      description: 'Oglądaj galę Oscarów na żywo! Popcorn i szampan w cenie biletu.',
      date: new Date('2026-03-02T01:00:00'),
      location: 'Cinema City Sadyba, Warszawa',
      latitude: 52.2298, longitude: 21.0023,
      categoryId: getCategoryId('Kino'), organizerId: organizer.id
    },
    {
      title: 'Dzień Kobiet - Koncert Muzyki Soul',
      description: 'Wieczór pełen ciepłej muzyki soul i R&B na Dzień Kobiet.',
      date: new Date('2026-03-08T19:00:00'),
      location: 'Stodoła, Warszawa',
      latitude: 52.2155, longitude: 21.0099,
      categoryId: getCategoryId('Muzyka'), organizerId: organizer.id
    },
    {
      title: 'Makbet - Shakespeare na nowo',
      description: 'Mroczna, współczesna adaptacja klasyki w reżyserii Krystiana Lupy.',
      date: new Date('2026-03-10T18:00:00'),
      location: 'Teatr Stary, Kraków',
      latitude: 50.0623, longitude: 19.9351,
      categoryId: getCategoryId('Teatr'), organizerId: organizer.id
    },
    {
      title: 'Hackathon: Aplikacje dla Miast',
      description: '48-godzinny maraton programowania. Stwórz appkę rozwiązującą problemy miejskie.',
      date: new Date('2026-03-14T09:00:00'),
      location: 'Campus Warsaw, Warszawa',
      latitude: 52.2326, longitude: 21.0103,
      categoryId: getCategoryId('Edukacja'), organizerId: organizer2.id
    },
    {
      title: 'Stand-up Mic Drop Tour',
      description: 'Ogólnopolska trasa komediowa z udziałem 5 topowych komików.',
      date: new Date('2026-03-15T20:00:00'),
      location: 'Klub Hybrydy, Warszawa',
      latitude: 52.2343, longitude: 21.0173,
      categoryId: getCategoryId('Stand-up'), organizerId: organizer.id
    },
    {
      title: 'Wiosenny Kiermasz Rękodzieła',
      description: 'Handmade biżuteria, ceramika, ubrania i dekoracje od lokalnych twórców.',
      date: new Date('2026-03-21T10:00:00'),
      location: 'Rynek Główny, Kraków',
      latitude: 50.0619, longitude: 19.9372,
      categoryId: getCategoryId('Festiwale'), organizerId: organizer2.id
    },
    {
      title: 'Warsztaty Malowania dla Dzieci',
      description: 'Wielkanocne malowanie pisanek i obrazków. Dla dzieci 5-12 lat.',
      date: new Date('2026-03-22T10:00:00'),
      location: 'Centrum Nauki Kopernik, Warszawa',
      latitude: 52.2417, longitude: 21.0286,
      categoryId: getCategoryId('Dla dzieci'), organizerId: organizer.id
    },
    {
      title: 'Wystawa Fotografii Podróżniczej',
      description: 'Najlepsze zdjęcia z wypraw na krańce świata. 150 fotografii z 40 krajów.',
      date: new Date('2026-03-25T10:00:00'),
      location: 'Galeria Zachęta, Warszawa',
      latitude: 52.2406, longitude: 21.0098,
      categoryId: getCategoryId('Wystawy'), organizerId: organizer.id
    },
    {
      title: 'Maraton Filmów Anime',
      description: '10 godzin najlepszego anime na wielkim ekranie. Studio Ghibli, Makoto Shinkai i więcej.',
      date: new Date('2026-03-28T12:00:00'),
      location: 'Kino Atlantic, Warszawa',
      latitude: 52.2303, longitude: 21.0168,
      categoryId: getCategoryId('Kino'), organizerId: organizer2.id
    },

    // ==================== KWIECIEŃ 2026 ====================
    {
      title: 'Wielkanocny Koncert Chóralny',
      description: 'Tradycyjne pieśni wielkanocne w wykonaniu Chóru Politechniki Warszawskiej.',
      date: new Date('2026-04-04T17:00:00'),
      location: 'Kościół Św. Anny, Warszawa',
      latitude: 52.2443, longitude: 21.0138,
      categoryId: getCategoryId('Muzyka'), organizerId: organizer.id
    },
    {
      title: 'Festiwal Teatrów Ulicznych',
      description: 'Trzy dni aktorstwa w plenerze. Akrobacje, pantomima, żywe rzeźby.',
      date: new Date('2026-04-10T14:00:00'),
      location: 'Rynek, Wrocław',
      latitude: 51.1103, longitude: 17.0316,
      categoryId: getCategoryId('Teatr'), organizerId: organizer2.id
    },
    {
      title: 'Stand-up: Nowe Twarze',
      description: 'Debiutanci sceny komediowej prezentują swoje najlepsze materiały.',
      date: new Date('2026-04-17T20:00:00'),
      location: 'Klub Łódź Kaliska, Łódź',
      latitude: 51.7592, longitude: 19.4560,
      categoryId: getCategoryId('Stand-up'), organizerId: organizer2.id
    },
    {
      title: 'Przegląd Komedii Romantycznych',
      description: 'Cały weekend z najlepszymi komediami romantycznymi na wielkim ekranie.',
      date: new Date('2026-04-18T15:00:00'),
      location: 'Kino Nowe Horyzonty, Wrocław',
      latitude: 51.1099, longitude: 17.0326,
      categoryId: getCategoryId('Kino'), organizerId: organizer.id
    },
    {
      title: 'Wystawa LEGO: Cuda Architektury',
      description: 'Repliki słynnych budowli z milionów klocków LEGO. Hit dla całej rodziny!',
      date: new Date('2026-04-12T09:00:00'),
      location: 'Centrum Handlowe Arkadia, Warszawa',
      latitude: 52.2566, longitude: 20.9846,
      categoryId: getCategoryId('Dla dzieci'), organizerId: organizer.id
    },
    {
      title: 'Dzień Ziemi - Eko-warsztaty',
      description: 'Warsztaty zero waste, sadzenie drzew i pokaz ekologicznych rozwiązań.',
      date: new Date('2026-04-22T10:00:00'),
      location: 'Park Łazienkowski, Warszawa',
      latitude: 52.2146, longitude: 21.0350,
      categoryId: getCategoryId('Edukacja'), organizerId: organizer.id
    },
    {
      title: 'Festiwal Piwa Rzemieślniczego',
      description: 'Ponad 100 browarów rzemieślniczych z całej Polski. Degustacje i warsztaty.',
      date: new Date('2026-04-25T14:00:00'),
      location: 'Stary Browar, Poznań',
      latitude: 52.4015, longitude: 16.9250,
      categoryId: getCategoryId('Festiwale'), organizerId: organizer2.id
    },
    {
      title: 'Wystawa: Frida Kahlo - Życie i Sztuka',
      description: 'Interaktywna wystawa z reprodukcjami, fotografiami i instalacjami VR.',
      date: new Date('2026-04-28T10:00:00'),
      location: 'Muzeum Narodowe, Kraków',
      latitude: 50.0599, longitude: 19.9232,
      categoryId: getCategoryId('Wystawy'), organizerId: organizer.id
    },

    // ==================== MAJ 2026 ====================
    {
      title: 'Juwenalia Warszawskie',
      description: 'Największy studencki festiwal muzyczny w stolicy! 3 sceny, 30 artystów.',
      date: new Date('2026-05-08T15:00:00'),
      location: 'Kampus Główny UW, Warszawa',
      latitude: 52.2396, longitude: 21.0181,
      categoryId: getCategoryId('Festiwale'), organizerId: organizer.id
    },
    {
      title: 'Komiksowy Weekend',
      description: 'Spotkania z rysownikami, warsztaty rysunku i giełda komiksów.',
      date: new Date('2026-05-09T10:00:00'),
      location: 'Centrum Kultury Zamek, Poznań',
      latitude: 52.4085, longitude: 16.9342,
      categoryId: getCategoryId('Dla dzieci'), organizerId: organizer2.id
    },
    {
      title: 'Wieczór Improwizacji Teatralnej',
      description: 'Aktorzy Teatru Ósmego Dnia tworzą spektakl z propozycji widowni.',
      date: new Date('2026-05-15T19:30:00'),
      location: 'Teatr Ósmego Dnia, Poznań',
      latitude: 52.4064, longitude: 16.9252,
      categoryId: getCategoryId('Teatr'), organizerId: organizer.id
    },
    {
      title: 'Noc Muzeów',
      description: 'Darmowe wejścia do galerii i muzeów w całej Warszawie od zmierzchu do świtu.',
      date: new Date('2026-05-16T18:00:00'),
      location: 'Muzeum Narodowe, Warszawa',
      latitude: 52.2318, longitude: 21.0241,
      categoryId: getCategoryId('Wystawy'), organizerId: organizer2.id
    },
    {
      title: 'Stand-up na Dachu',
      description: 'Komedia pod gwiazdami na dachu wieżowca. Widok na panoramę Warszawy.',
      date: new Date('2026-05-22T21:00:00'),
      location: 'Taras widokowy, Warszawa',
      latitude: 52.2319, longitude: 21.0067,
      categoryId: getCategoryId('Stand-up'), organizerId: organizer2.id
    },
    {
      title: 'Koncert: Dawid Podsiadło',
      description: 'Wielki koncert na Stadionie Narodowym! Nowy album na żywo.',
      date: new Date('2026-05-23T19:00:00'),
      location: 'Stadion Narodowy, Warszawa',
      latitude: 52.2396, longitude: 21.0453,
      categoryId: getCategoryId('Muzyka'), organizerId: organizer.id
    },
    {
      title: 'Piknik Naukowy PAN',
      description: 'Eksperymenty na żywo, pokazy laboratoryjne i spotkania z naukowcami.',
      date: new Date('2026-05-30T10:00:00'),
      location: 'Centrum Nauki Kopernik, Warszawa',
      latitude: 52.2417, longitude: 21.0286,
      categoryId: getCategoryId('Edukacja'), organizerId: organizer.id
    },
    {
      title: 'Festiwal Smaków Azjatyckich',
      description: 'Kuchnia japońska, tajska, wietnamska i koreańska. Warsztaty sushi w cenie.',
      date: new Date('2026-05-31T11:00:00'),
      location: 'Hala Gwardii, Warszawa',
      latitude: 52.2365, longitude: 20.9981,
      categoryId: getCategoryId('Festiwale'), organizerId: organizer.id
    },

    // ==================== CZERWIEC 2026 ====================
    {
      title: 'Dzień Dziecka w Łazienkach',
      description: 'Dmuchańce, malowanie buziek, pokaz iluzji i darmowe lody!',
      date: new Date('2026-06-01T10:00:00'),
      location: 'Park Łazienkowski, Warszawa',
      latitude: 52.2146, longitude: 21.0350,
      categoryId: getCategoryId('Dla dzieci'), organizerId: organizer.id
    },
    {
      title: 'Festiwal Kina Letniego',
      description: 'Cały czerwiec filmy pod chmurką! Co piątek inny klasyk.',
      date: new Date('2026-06-05T21:00:00'),
      location: 'Ogród Saski, Warszawa',
      latitude: 52.2406, longitude: 21.0098,
      categoryId: getCategoryId('Kino'), organizerId: organizer2.id
    },
    {
      title: 'Koncert Letni: Indie & Alternative',
      description: 'Open air z najlepszymi polskimi zespołami indie. Blanket friendly!',
      date: new Date('2026-06-06T17:00:00'),
      location: 'Park Fontann, Warszawa',
      latitude: 52.2465, longitude: 21.0122,
      categoryId: getCategoryId('Muzyka'), organizerId: organizer.id
    },
    {
      title: 'Wrocław Non Stop: Festiwal Teatru',
      description: 'Pięć dni najlepszego teatru z Polski i Europy. 30 spektakli.',
      date: new Date('2026-06-12T16:00:00'),
      location: 'Teatr Polski, Wrocław',
      latitude: 51.1103, longitude: 17.0316,
      categoryId: getCategoryId('Teatr'), organizerId: organizer.id
    },
    {
      title: 'Warsztaty Kaligrafii Japońskiej',
      description: 'Naucz się pisać japońskie znaki pędzlem. Prowadzenie: mistrz Tanaka.',
      date: new Date('2026-06-14T12:00:00'),
      location: 'Centrum Kultury Japońskiej, Warszawa',
      latitude: 52.2285, longitude: 21.0027,
      categoryId: getCategoryId('Edukacja'), organizerId: organizer2.id
    },
    {
      title: 'Wystawa: Banksy i Przyjaciele',
      description: 'Oryginalne prace Banksy\'ego i innych artystów street art. Pierwsza taka wystawa w Polsce!',
      date: new Date('2026-06-20T10:00:00'),
      location: 'Galeria Zachęta, Warszawa',
      latitude: 52.2406, longitude: 21.0098,
      categoryId: getCategoryId('Wystawy'), organizerId: organizer.id
    },
    {
      title: 'Open Air Stand-up: Letnia Scena',
      description: 'Najlepsi polscy komicy na plaży nad Wisłą. Leżaki zapewnione.',
      date: new Date('2026-06-27T20:00:00'),
      location: 'Plaża Poniatówka, Warszawa',
      latitude: 52.2282, longitude: 21.0383,
      categoryId: getCategoryId('Stand-up'), organizerId: organizer.id
    },
    {
      title: 'Festiwal Kolorów Holi',
      description: 'Indyjski festiwal barw nad Wisłą. Proszki kolorowe, muzyka i taniec!',
      date: new Date('2026-06-28T14:00:00'),
      location: 'Bulwary Wiślane, Kraków',
      latitude: 50.0475, longitude: 19.9445,
      categoryId: getCategoryId('Festiwale'), organizerId: organizer2.id
    },

    // ==================== LIPIEC 2026 ====================
    {
      title: 'Open\'er Festival',
      description: 'Jeden z największych festiwali muzycznych w Europie. 4 dni, 100+ artystów.',
      date: new Date('2026-07-01T15:00:00'),
      location: 'Lotnisko Gdynia-Kosakowo, Gdynia',
      latitude: 54.5189, longitude: 18.5068,
      categoryId: getCategoryId('Festiwale'), organizerId: organizer.id
    },
    {
      title: 'Jazz nad Wisłą',
      description: 'Cykl darmowych koncertów jazzowych co niedzielę nad rzeką.',
      date: new Date('2026-07-05T18:00:00'),
      location: 'Bulwary Wiślane, Warszawa',
      latitude: 52.2350, longitude: 21.0383,
      categoryId: getCategoryId('Muzyka'), organizerId: organizer2.id
    },
    {
      title: 'Letnie Kino Plenerowe: Tarantino',
      description: 'Cały weekend z filmami Quentina Tarantino pod gwiazdami.',
      date: new Date('2026-07-10T21:00:00'),
      location: 'Park Jordana, Kraków',
      latitude: 50.0571, longitude: 19.9148,
      categoryId: getCategoryId('Kino'), organizerId: organizer.id
    },
    {
      title: 'Teatr Shakespeare\'a w Parku',
      description: 'Sen nocy letniej w plenerowej inscenizacji. Wstęp wolny!',
      date: new Date('2026-07-12T19:00:00'),
      location: 'Park Skaryszewski, Warszawa',
      latitude: 52.2357, longitude: 21.0633,
      categoryId: getCategoryId('Teatr'), organizerId: organizer.id
    },
    {
      title: 'Obóz Naukowy Junior',
      description: 'Tygodniowe warsztaty robotyki, programowania i eksperymentów. Wiek: 10-15 lat.',
      date: new Date('2026-07-13T09:00:00'),
      location: 'Centrum Nauki Kopernik, Warszawa',
      latitude: 52.2417, longitude: 21.0286,
      categoryId: getCategoryId('Dla dzieci'), organizerId: organizer.id
    },
    {
      title: 'Wystawa: Kosmos - Nowe Odkrycia',
      description: 'Najnowsze zdjęcia z teleskopu Jamesa Webba i modele planet w skali.',
      date: new Date('2026-07-18T10:00:00'),
      location: 'Planetarium Śląskie, Chorzów',
      latitude: 50.2949, longitude: 18.9903,
      categoryId: getCategoryId('Wystawy'), organizerId: organizer2.id
    },
    {
      title: 'Warsztaty Surfingu i Kitesurfingu',
      description: 'Całodniowe warsztaty na Półwyspie Helskim. Sprzęt w cenie.',
      date: new Date('2026-07-20T09:00:00'),
      location: 'Plaża Chałupy, Hel',
      latitude: 54.7511, longitude: 18.8006,
      categoryId: getCategoryId('Edukacja'), organizerId: organizer2.id
    },
    {
      title: 'Stand-up nad Morzem',
      description: 'Komedia z widokiem na Bałtyk. Trasa nadmorska - Sopot.',
      date: new Date('2026-07-25T20:30:00'),
      location: 'Molo, Sopot',
      latitude: 54.4435, longitude: 18.5608,
      categoryId: getCategoryId('Stand-up'), organizerId: organizer.id
    },

    // ==================== SIERPIEŃ 2026 ====================
    {
      title: 'Pol\'and\'Rock Festival',
      description: 'Legendarny festiwal muzyczny (dawny Woodstock). Wstęp wolny!',
      date: new Date('2026-08-06T12:00:00'),
      location: 'Lotnisko Makowice-Płoty',
      latitude: 53.7666, longitude: 15.5166,
      categoryId: getCategoryId('Festiwale'), organizerId: organizer.id
    },
    {
      title: 'Koncert Symfoniczny pod Gwiazdami',
      description: 'Orkiestra Filharmonii Krakowskiej gra Vivaldiego w plenerze.',
      date: new Date('2026-08-08T20:00:00'),
      location: 'Wawel, Kraków',
      latitude: 50.0540, longitude: 19.9354,
      categoryId: getCategoryId('Muzyka'), organizerId: organizer.id
    },
    {
      title: 'Przegląd Filmów Dokumentalnych',
      description: 'Tydzień z najlepszymi dokumentami roku. Spotkania z reżyserami.',
      date: new Date('2026-08-10T16:00:00'),
      location: 'Kino Muranów, Warszawa',
      latitude: 52.2497, longitude: 20.9986,
      categoryId: getCategoryId('Kino'), organizerId: organizer2.id
    },
    {
      title: 'Teatr Tańca: Pina Bausch Tribute',
      description: 'Hołd dla wielkiej choreografki w wykonaniu Polskiego Teatru Tańca.',
      date: new Date('2026-08-15T19:00:00'),
      location: 'Teatr Wielki, Poznań',
      latitude: 52.4064, longitude: 16.9342,
      categoryId: getCategoryId('Teatr'), organizerId: organizer.id
    },
    {
      title: 'Festiwal Balonowy',
      description: 'Pokazy balonów na ogrzane powietrze, loty widokowe i piknik rodzinny.',
      date: new Date('2026-08-16T06:00:00'),
      location: 'Pole startowe, Nałęczów',
      latitude: 51.2858, longitude: 22.2128,
      categoryId: getCategoryId('Dla dzieci'), organizerId: organizer2.id
    },
    {
      title: 'Letnia Szkoła Programowania',
      description: 'Dwutygodniowy bootcamp: React, Node.js, bazy danych. Dla studentów.',
      date: new Date('2026-08-17T09:00:00'),
      location: 'Hub:raum Kraków',
      latitude: 50.0614, longitude: 19.9366,
      categoryId: getCategoryId('Edukacja'), organizerId: organizer2.id
    },
    {
      title: 'Wystawa: Przyszłość jest Teraz',
      description: 'Technologie jutra: druk 3D, AI art, hologramy i roboty humanoidalne.',
      date: new Date('2026-08-20T10:00:00'),
      location: 'Centrum Nauki Kopernik, Warszawa',
      latitude: 52.2417, longitude: 21.0286,
      categoryId: getCategoryId('Wystawy'), organizerId: organizer.id
    },
    {
      title: 'Stand-up Roast Battle',
      description: 'Komicy roastują się nawzajem na scenie. Kto wygra bitę na żarty?',
      date: new Date('2026-08-22T20:30:00'),
      location: 'Klub Palladium, Warszawa',
      latitude: 52.2287, longitude: 21.0034,
      categoryId: getCategoryId('Stand-up'), organizerId: organizer.id
    },

    // ==================== WRZESIEŃ 2026 ====================
    {
      title: 'Jesienny Jazz Festival',
      description: 'Trzydniowy festiwal jazzowy z artystami z całego świata.',
      date: new Date('2026-09-04T18:00:00'),
      location: 'Filharmonia, Wrocław',
      latitude: 51.1103, longitude: 17.0316,
      categoryId: getCategoryId('Muzyka'), organizerId: organizer.id
    },
    {
      title: 'Stand-up: Powrót do Szkoły',
      description: 'Komicy wspominają szkolne lata. Wieczór pełen nostalgii i śmiechu.',
      date: new Date('2026-09-05T20:00:00'),
      location: 'Pub Pod Papugami, Wrocław',
      latitude: 51.1099, longitude: 17.0326,
      categoryId: getCategoryId('Stand-up'), organizerId: organizer2.id
    },
    {
      title: 'Back to School: Warsztaty Kreatywności',
      description: 'Warsztaty rysunku, pisania kreatywnego i fotografii dla młodzieży.',
      date: new Date('2026-09-06T10:00:00'),
      location: 'Pałac Młodzieży, Warszawa',
      latitude: 52.2326, longitude: 21.0103,
      categoryId: getCategoryId('Dla dzieci'), organizerId: organizer.id
    },
    {
      title: 'Boska Komedia: Festiwal Teatralny',
      description: 'Międzynarodowy festiwal teatralny. 20 spektakli z 10 krajów.',
      date: new Date('2026-09-10T17:00:00'),
      location: 'Teatr Słowackiego, Kraków',
      latitude: 50.0642, longitude: 19.9418,
      categoryId: getCategoryId('Teatr'), organizerId: organizer2.id
    },
    {
      title: 'Europejski Dzień Dziedzictwa',
      description: 'Darmowe zwiedzanie zabytków normalnie niedostępnych dla publiczności.',
      date: new Date('2026-09-12T10:00:00'),
      location: 'Zamek Królewski, Warszawa',
      latitude: 52.2481, longitude: 21.0147,
      categoryId: getCategoryId('Wystawy'), organizerId: organizer.id
    },
    {
      title: 'Festiwal Filmowy w Gdyni',
      description: 'Najważniejszy przegląd polskiego kina. Premierowe pokazy i spotkania z twórcami.',
      date: new Date('2026-09-14T12:00:00'),
      location: 'Teatr Muzyczny, Gdynia',
      latitude: 54.5189, longitude: 18.5368,
      categoryId: getCategoryId('Kino'), organizerId: organizer.id
    },
    {
      title: 'Konferencja: AI w Edukacji',
      description: 'Jak sztuczna inteligencja zmienia nauczanie? Prelegenci z Google, Microsoft i OpenAI.',
      date: new Date('2026-09-18T09:00:00'),
      location: 'Politechnika Warszawska',
      latitude: 52.2205, longitude: 21.0106,
      categoryId: getCategoryId('Edukacja'), organizerId: organizer.id
    },
    {
      title: 'Festiwal Wina i Sera',
      description: 'Degustacje win z całej Europy, warsztaty sommelierskie i targi sera.',
      date: new Date('2026-09-19T12:00:00'),
      location: 'Zamek Książ, Wałbrzych',
      latitude: 50.8422, longitude: 16.2892,
      categoryId: getCategoryId('Festiwale'), organizerId: organizer2.id
    },
    {
      title: 'Wieczór Muzyki Elektronicznej',
      description: 'Trzech topowych DJ-ów na jednej scenie. Visuale i lasery.',
      date: new Date('2026-09-26T22:00:00'),
      location: 'Progresja, Warszawa',
      latitude: 52.2223, longitude: 20.9753,
      categoryId: getCategoryId('Muzyka'), organizerId: organizer.id
    },
    {
      title: 'Jesienna Noc Teatrów',
      description: 'Darmowe spektakle we wszystkich teatrach miasta do północy!',
      date: new Date('2026-09-27T18:00:00'),
      location: 'Teatr Nowy, Łódź',
      latitude: 51.7592, longitude: 19.4560,
      categoryId: getCategoryId('Teatr'), organizerId: organizer.id
    }
  ];

  for (const event of events) {
    const existing = await prisma.event.findFirst({ where: { title: event.title } });
    if (!existing) {
      await prisma.event.create({ data: event });
      console.log(`  ✓ ${event.title}`);
    } else {
      console.log(`  ⏭ ${event.title} (już istnieje)`);
    }
  }

  console.log(`\n✅ Gotowe! Łącznie wydarzeń w bazie: ${await prisma.event.count()}`);
  console.log('\n📧 Konta testowe:');
  console.log('   Organizator:   organizator@test.pl / test123');
  console.log('   Organizator 2: events@kulturalnie.pl / test123');
  console.log('   Użytkownik:    jan@test.pl / test123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });