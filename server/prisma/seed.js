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

  // 2. UŻYTKOWNIK-ORGANIZATOR
  console.log('👤 Tworzenie użytkownika-organizatora...');
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
  console.log(`✅ Organizator: organizator@test.pl (hasło: test123)\n`);

  // 3. POBIERZ KATEGORIE Z BAZY
  const allCategories = await prisma.category.findMany();
  const getCategoryId = (name) => allCategories.find(c => c.name === name)?.id || allCategories[0].id;

  // 4. PRZYKŁADOWE WYDARZENIA (PRZYSZŁE DATY - grudzień 2025 - marzec 2026)
  console.log('🎉 Tworzenie wydarzeń...');
  
  const events = [
    // MUZYKA
    {
      title: 'Koncert Symfoniczny - Beethoven',
      description: 'Wieczór z muzyką Ludwiga van Beethovena w wykonaniu Filharmonii Narodowej.',
      date: new Date('2025-12-20T19:00:00'),
      location: 'Filharmonia Narodowa, Warszawa',
      latitude: 52.2319,
      longitude: 21.0067,
      categoryId: getCategoryId('Muzyka'),
      organizerId: organizer.id
    },
    {
      title: 'Jazz Night - Trio Acoustic',
      description: 'Kameralny wieczór jazzowy z najlepszymi muzykami.',
      date: new Date('2025-12-28T20:30:00'),
      location: 'Blue Note Jazz Club, Kraków',
      latitude: 50.0614,
      longitude: 19.9366,
      categoryId: getCategoryId('Muzyka'),
      organizerId: organizer.id
    },
    {
      title: 'Noworoczny Koncert Wiedeński',
      description: 'Tradycyjny koncert noworoczny z walcami Straussa.',
      date: new Date('2026-01-01T18:00:00'),
      location: 'Teatr Wielki, Warszawa',
      latitude: 52.2417,
      longitude: 21.0122,
      categoryId: getCategoryId('Muzyka'),
      organizerId: organizer.id
    },
    
    // TEATR
    {
      title: 'Hamlet - William Shakespeare',
      description: 'Klasyczna sztuka w nowoczesnej inscenizacji. Reżyseria: Jan Klata.',
      date: new Date('2025-12-15T18:00:00'),
      location: 'Teatr Narodowy, Warszawa',
      latitude: 52.2412,
      longitude: 21.0139,
      categoryId: getCategoryId('Teatr'),
      organizerId: organizer.id
    },
    {
      title: 'Improwizacje Teatralne',
      description: 'Wieczór pełen śmiechu! Aktorzy tworzą spektakl na żywo na podstawie propozycji widzów.',
      date: new Date('2026-01-10T19:30:00'),
      location: 'Teatr Bagatela, Kraków',
      latitude: 50.0628,
      longitude: 19.9352,
      categoryId: getCategoryId('Teatr'),
      organizerId: organizer.id
    },
    {
      title: 'Dziady - Adam Mickiewicz',
      description: 'Monumentalna inscenizacja narodowego arcydzieła.',
      date: new Date('2026-01-25T17:00:00'),
      location: 'Teatr Polski, Wrocław',
      latitude: 51.1103,
      longitude: 17.0316,
      categoryId: getCategoryId('Teatr'),
      organizerId: organizer.id
    },
    
    // KINO
    {
      title: 'Maraton Filmów Sci-Fi',
      description: '12 godzin najlepszych filmów science-fiction. Popcorn i napoje w cenie!',
      date: new Date('2025-12-21T12:00:00'),
      location: 'Kino Muranów, Warszawa',
      latitude: 52.2497,
      longitude: 20.9986,
      categoryId: getCategoryId('Kino'),
      organizerId: organizer.id
    },
    {
      title: 'Pokaz Przedpremierowy - Nowy Film Polski',
      description: 'Bądź pierwszym widzem najnowszej polskiej produkcji!',
      date: new Date('2026-01-15T20:00:00'),
      location: 'Multikino Złote Tarasy, Warszawa',
      latitude: 52.2298,
      longitude: 21.0023,
      categoryId: getCategoryId('Kino'),
      organizerId: organizer.id
    },
    {
      title: 'Noc Oscarowa',
      description: 'Oglądaj galę rozdania Oscarów na wielkim ekranie!',
      date: new Date('2026-03-02T01:00:00'),
      location: 'Cinema City, Kraków',
      latitude: 50.0513,
      longitude: 19.9445,
      categoryId: getCategoryId('Kino'),
      organizerId: organizer.id
    },
    
    // WYSTAWY
    {
      title: 'Wystawa: Polscy Impresjoniści',
      description: 'Unikalna kolekcja dzieł polskich malarzy impresjonistycznych.',
      date: new Date('2025-12-10T10:00:00'),
      location: 'Muzeum Narodowe, Kraków',
      latitude: 50.0599,
      longitude: 19.9232,
      categoryId: getCategoryId('Wystawy'),
      organizerId: organizer.id
    },
    {
      title: 'Interaktywna Wystawa: Kosmos',
      description: 'Podróż przez Układ Słoneczny z wykorzystaniem VR i hologramów.',
      date: new Date('2026-01-20T09:00:00'),
      location: 'Centrum Nauki Kopernik, Warszawa',
      latitude: 52.2417,
      longitude: 21.0286,
      categoryId: getCategoryId('Wystawy'),
      organizerId: organizer.id
    },
    {
      title: 'Sztuka Współczesna XXI wieku',
      description: 'Przegląd najważniejszych dzieł sztuki ostatnich 25 lat.',
      date: new Date('2026-02-05T11:00:00'),
      location: 'Muzeum Sztuki Nowoczesnej, Warszawa',
      latitude: 52.2328,
      longitude: 21.0055,
      categoryId: getCategoryId('Wystawy'),
      organizerId: organizer.id
    },
    
    // STAND-UP
    {
      title: 'Stand-up: Wielka Trasa Komediowa',
      description: 'Najlepsi polscy komicy w jednym show!',
      date: new Date('2025-12-18T20:00:00'),
      location: 'Klub Komediowy, Warszawa',
      latitude: 52.2287,
      longitude: 21.0034,
      categoryId: getCategoryId('Stand-up'),
      organizerId: organizer.id
    },
    {
      title: 'Open Mic Night',
      description: 'Wieczór dla początkujących komików. Wstęp wolny!',
      date: new Date('2026-01-08T19:00:00'),
      location: 'Pub Pod Papugami, Wrocław',
      latitude: 51.1099,
      longitude: 17.0326,
      categoryId: getCategoryId('Stand-up'),
      organizerId: organizer.id
    },
    {
      title: 'Stand-up po angielsku',
      description: 'International comedy night - English speaking comedians.',
      date: new Date('2026-02-14T21:00:00'),
      location: 'Klub Hybrydy, Warszawa',
      latitude: 52.2343,
      longitude: 21.0173,
      categoryId: getCategoryId('Stand-up'),
      organizerId: organizer.id
    },
    
    // EDUKACJA
    {
      title: 'Warsztaty: Programowanie dla Początkujących',
      description: 'Naucz się podstaw Pythona w jeden dzień! Laptop zapewniony.',
      date: new Date('2026-01-18T10:00:00'),
      location: 'Google Campus, Warszawa',
      latitude: 52.2326,
      longitude: 21.0103,
      categoryId: getCategoryId('Edukacja'),
      organizerId: organizer.id
    },
    {
      title: 'Wykład: Sztuczna Inteligencja w Medycynie',
      description: 'Profesor Jan Nowak opowie o przyszłości AI w diagnostyce.',
      date: new Date('2026-02-20T17:00:00'),
      location: 'Uniwersytet Jagielloński, Kraków',
      latitude: 50.0616,
      longitude: 19.9330,
      categoryId: getCategoryId('Edukacja'),
      organizerId: organizer.id
    },
    {
      title: 'Kurs fotografii dla początkujących',
      description: 'Weekendowy kurs podstaw fotografii cyfrowej.',
      date: new Date('2026-01-25T09:00:00'),
      location: 'Dom Kultury Śródmieście, Warszawa',
      latitude: 52.2297,
      longitude: 21.0122,
      categoryId: getCategoryId('Edukacja'),
      organizerId: organizer.id
    },
    
    // DLA DZIECI
    {
      title: 'Bajkowe Popołudnie - Kraina Lodu',
      description: 'Spotkanie z Elsą i Anną! Zabawy, konkursy i słodki poczęstunek.',
      date: new Date('2025-12-22T14:00:00'),
      location: 'Centrum Handlowe Arkadia, Warszawa',
      latitude: 52.2566,
      longitude: 20.9846,
      categoryId: getCategoryId('Dla dzieci'),
      organizerId: organizer.id
    },
    {
      title: 'Warsztaty Robotyki dla Dzieci',
      description: 'Zbuduj swojego pierwszego robota! Dla dzieci 8-12 lat.',
      date: new Date('2026-01-12T11:00:00'),
      location: 'Centrum Nauki Kopernik, Warszawa',
      latitude: 52.2417,
      longitude: 21.0286,
      categoryId: getCategoryId('Dla dzieci'),
      organizerId: organizer.id
    },
    {
      title: 'Mikołajki w Teatrze',
      description: 'Świąteczny spektakl dla całej rodziny!',
      date: new Date('2025-12-14T12:00:00'),
      location: 'Teatr Lalka, Warszawa',
      latitude: 52.2523,
      longitude: 20.9876,
      categoryId: getCategoryId('Dla dzieci'),
      organizerId: organizer.id
    },
    
    // FESTIWALE
    {
      title: 'Festiwal Światła',
      description: 'Niesamowite iluminacje i projekcje na budynkach starego miasta.',
      date: new Date('2025-12-31T18:00:00'),
      location: 'Rynek Główny, Kraków',
      latitude: 50.0619,
      longitude: 19.9372,
      categoryId: getCategoryId('Festiwale'),
      organizerId: organizer.id
    },
    {
      title: 'Festiwal Food Trucków',
      description: 'Smaki z całego świata w jednym miejscu! Ponad 50 food trucków.',
      date: new Date('2026-02-28T12:00:00'),
      location: 'Plac Defilad, Warszawa',
      latitude: 52.2320,
      longitude: 21.0067,
      categoryId: getCategoryId('Festiwale'),
      organizerId: organizer.id
    },
    {
      title: 'Wielka Orkiestra Świątecznej Pomocy',
      description: 'Koncert finałowy WOŚP!',
      date: new Date('2026-01-26T16:00:00'),
      location: 'Stadion Narodowy, Warszawa',
      latitude: 52.2396,
      longitude: 21.0453,
      categoryId: getCategoryId('Festiwale'),
      organizerId: organizer.id
    }
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event
    });
    console.log(`  ✓ ${event.title}`);
  }

  console.log(`\n✅ Utworzono ${events.length} wydarzeń!`);
  console.log('\n🎉 Baza danych została wypełniona!');
  console.log('\n📧 Możesz zalogować się jako organizator:');
  console.log('   Email: organizator@test.pl');
  console.log('   Hasło: test123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
