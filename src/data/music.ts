export interface MusicFavorite {
  artist: string;
  title: string;
  href?: string;
  spotifyUri?: string;
  coverImage?: string;
  note: string;
}

const musicFavorites: readonly MusicFavorite[] = [
  {
    artist: 'Turnstile',
    title: 'HOLIDAY',
    href: 'https://open.spotify.com/intl-fr/track/1dB0NylVkpjdOe8DiekIs7?si=13d0f77246c4484d',
    spotifyUri: 'spotify:track:1dB0NylVkpjdOe8DiekIs7',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c11ba539d58741bbd1332c92',
    note: 'Baltimore HC',
  },
  {
    artist: 'Ceremony',
    title: 'Exit Fears',
    href: 'https://open.spotify.com/intl-fr/track/3gsy43lN8QlBDeaVERlMJH?si=8e63b791cc664225',
    spotifyUri: 'spotify:track:3gsy43lN8QlBDeaVERlMJH',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02bdb8491e62b83a8a3af45dd5',
    note: 'Rock oui',
  },
  {
    artist: 'Home Front',
    title: 'New Madness',
    href: 'https://open.spotify.com/intl-fr/track/69NNHA1ZPbfIBtz2GrzvM2?si=01e0d737e8344225',
    spotifyUri: 'spotify:track:69NNHA1ZPbfIBtz2GrzvM2',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f4ab85ba93f25a8b52cf3150',
    note: 'Tu as  manqué le spectacle ?',
  },
  {
    artist: 'Parquet Courts',
    title: 'Borrowed Time',
    href: 'https://open.spotify.com/intl-fr/track/6PE6tyl9QnfdNoms0O0czF?si=d1c4566e27d64898',
    spotifyUri: 'spotify:track:6PE6tyl9QnfdNoms0O0czF',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d2fdc976daad6154e3628191',
    note: 'Toujours bon',
  },
  {
    artist: 'STIFF RICHARDS',
    title: 'Bad Disease',
    href: 'https://open.spotify.com/intl-fr/track/6WZwZmqGDBlrekjJC1cBN2?si=1d59c0bc99ec4eb7',
    spotifyUri: 'spotify:track:6WZwZmqGDBlrekjJC1cBN2',
    coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e023dddc0b5d9aecc07ccfd1ebd',
    note: 'Australie garage',
  },
  {
    artist: 'Amanaz',
    title: 'I Am Very Far',
    href: 'https://open.spotify.com/intl-fr/track/30nE3zvUyw9O3uUKHzJk2m?si=6b81c6f695da49a3',
    spotifyUri: 'spotify:track:30nE3zvUyw9O3uUKHzJk2m',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e021a3e9f74688b6c8f7fe97751',
    note: 'Zambie mon ami',
  },
  {
    artist: 'Bruce Springsteen',
    title: 'Atlantic City',
    href: 'https://open.spotify.com/intl-fr/track/1Vp8U39YNsDfd6yVuaUq12?si=3cf7f0915da743d5',
    spotifyUri: 'spotify:track:1Vp8U39YNsDfd6yVuaUq12',
    coverImage: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e021e7af3a709aeac0c796ab542',
    note: 'Le Boss',
  },
  {
    artist: 'Solids',
    title: 'Laisser Faire',
    href: 'https://open.spotify.com/intl-fr/track/6KdOhiBtsTjdp61CNbkmdW?si=ee593fa171374488',
    spotifyUri: 'spotify:track:6KdOhiBtsTjdp61CNbkmdW',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028aac72bf50aabba064e7cc27',
    note: 'Montréal représente',
  },
  {
    artist: 'High Vis',
    title: 'Walking Wires',
    href: 'https://open.spotify.com/intl-fr/track/0vf5m8HAO3EGlBd6fNTsor?si=fb64e84e13d143b4',
    spotifyUri: 'spotify:track:0vf5m8HAO3EGlBd6fNTsor',
    coverImage: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02011ae9a36b2781c9b25682f4',
    note: 'Coup de cœur ❤️',
  },
];

export function getMusicFavorites(): readonly MusicFavorite[] {
  return musicFavorites;
}
