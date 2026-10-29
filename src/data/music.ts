export interface MusicFavorite {
  artist: string;
  title: string;
  previewUrl: string;
  coverImage: string;
  note: string;
}

const musicFavorites: readonly MusicFavorite[] = [
  {
    artist: 'Turnstile',
    title: 'HOLIDAY',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5f/a0/56/5fa056f8-454e-7c73-b25a-1509177e8a2e/mzaf_568747952700730231.plus.aac.p.m4a',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c11ba539d58741bbd1332c92',
    note: 'Baltimore HC',
  },
  {
    artist: 'Ceremony',
    title: 'Exit Fears',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3c/39/05/3c390561-5eff-9d68-819f-4fbe098b5a2b/mzaf_6258690900655255848.plus.aac.p.m4a',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02bdb8491e62b83a8a3af45dd5',
    note: 'Rock oui',
  },
  {
    artist: 'Home Front',
    title: 'New Madness',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/be/ff/38/beff38dd-2aee-6d2e-87bd-cc58f9546131/mzaf_4898310674970682409.plus.aac.p.m4a',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f4ab85ba93f25a8b52cf3150',
    note: 'Tu as  manqué le spectacle ?',
  },
  {
    artist: 'Parquet Courts',
    title: 'Borrowed Time',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/22/4e/cb/224ecb16-c3d8-4b4e-dbf7-06849c88ae90/mzaf_5501409278386705086.plus.aac.p.m4a',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d2fdc976daad6154e3628191',
    note: 'Toujours bon',
  },
  {
    artist: 'STIFF RICHARDS',
    title: 'Bad Disease',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/df/ce/ff/dfceffc9-f31e-b73c-2ac6-bf723520d2b0/mzaf_1530029196777479733.plus.aac.p.m4a',
    coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e023dddc0b5d9aecc07ccfd1ebd',
    note: 'Australie garage',
  },
  {
    artist: 'Amanaz',
    title: 'I Am Very Far',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/78/64/f4/7864f4e5-4449-9fa7-c076-23475d0a1791/mzaf_605144889373672542.plus.aac.p.m4a',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e021a3e9f74688b6c8f7fe97751',
    note: 'Zambie mon ami',
  },
  {
    artist: 'Bruce Springsteen',
    title: 'Atlantic City',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2f/78/ac/2f78ac29-cfc8-dadd-f372-eb0633ee9e76/mzaf_11255967961861789634.plus.aac.p.m4a',
    coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e021e7af3a709aeac0c796ab542',
    note: 'Le Boss',
  },
  {
    artist: 'Solids',
    title: 'Laisser Faire',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/5e/a9/15/5ea91542-abd4-291c-e123-7b00910b14b1/mzaf_1558722175612297127.plus.aac.p.m4a',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028aac72bf50aabba064e7cc27',
    note: 'Montréal représente',
  },
  {
    artist: 'High Vis',
    title: 'Walking Wires',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/de/6b/75/de6b754d-6447-4caf-98fb-f9e223070698/mzaf_12141578456258022533.plus.aac.p.m4a',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02011ae9a36b2781c9b25682f4',
    note: 'Coup de cœur ❤️',
  },
];

export function getMusicFavorites(): readonly MusicFavorite[] {
  return musicFavorites;
}
