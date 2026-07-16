import homeHero from '../assets/images/editorial/home-hero.jpg';
import homeGuidance from '../assets/images/editorial/home-guidance.jpg';
import lessonPiano from '../assets/images/editorial/lesson-piano.jpg';
import lessonGuitar from '../assets/images/editorial/lesson-guitar.jpg';
import lessonViolin from '../assets/images/editorial/lesson-violin.jpg';
import lessonVocal from '../assets/images/editorial/lesson-vocal.jpg';
import aboutGuidance from '../assets/images/editorial/about-guidance.jpg';
import accessRoom from '../assets/images/editorial/access-room.jpg';
import type { EditorialImage } from '../types';

const pexelsLicense = 'https://www.pexels.com/license/';

export const siteImages = {
  homeHero: {
    src: homeHero,
    alt: '講師が生徒のピアノ演奏をそばで見守る個人レッスンのイメージ',
    caption: '個人レッスンのイメージ（実際の教室・講師・生徒ではありません）',
    source: 'licensed-stock',
    sourcePage: 'https://www.pexels.com/photo/piano-teacher-watching-a-student-playing-a-piano-10222314/',
    photographer: 'cottonbro studio',
    licenseUrl: pexelsLicense,
    focalPoint: { desktop: '52% 52%', mobile: '58% 50%' },
  },
  homeGuidance: {
    src: homeGuidance,
    alt: 'ピアノの鍵盤で指の動きを確かめる講師と生徒の手元のイメージ',
    caption: '指導風景のイメージ（実際の教室・講師・生徒ではありません）',
    source: 'licensed-stock',
    sourcePage: 'https://www.pexels.com/photo/piano-teacher-playing-a-piano-10222306/',
    photographer: 'cottonbro studio',
    licenseUrl: pexelsLicense,
    focalPoint: { desktop: '50% 54%', mobile: '50% 52%' },
  },
  aboutGuidance: {
    src: aboutGuidance,
    alt: '譜面を見ながら講師と生徒が並んで話すレッスンのイメージ',
    caption: '指導体制のイメージ（実際の教室・講師・生徒ではありません）',
    source: 'licensed-stock',
    sourcePage: 'https://www.pexels.com/photo/back-view-of-people-having-a-piano-lessons-7521182/',
    photographer: 'Pavel Danilyuk',
    licenseUrl: pexelsLicense,
    focalPoint: { desktop: '50% 48%', mobile: '48% 48%' },
  },
  accessRoom: {
    src: accessRoom,
    alt: 'ピアノ、ギター、バイオリンが置かれた音楽室の環境イメージ',
    caption: '教室環境のイメージ（実際の教室ではありません）',
    source: 'licensed-stock',
    sourcePage: 'https://www.pexels.com/photo/cozy-music-room-with-piano-and-guitar-32218646/',
    photographer: 'Flávia Vicentini',
    licenseUrl: pexelsLicense,
    focalPoint: { desktop: '50% 68%', mobile: '50% 66%' },
  },
} satisfies Record<string, EditorialImage>;

export const courseImages = {
  piano: {
    src: lessonPiano,
    alt: 'ピアノの前で講師と生徒が演奏について話す個人レッスンのイメージ',
    caption: 'ピアノレッスンのイメージ',
    source: 'licensed-stock',
    sourcePage: 'https://www.pexels.com/photo/piano-teacher-sitting-with-the-young-boy-10222299/',
    photographer: 'cottonbro studio',
    licenseUrl: pexelsLicense,
    focalPoint: { desktop: '52% 50%', mobile: '52% 50%' },
  },
  guitar: {
    src: lessonGuitar,
    alt: '講師が生徒のアコースティックギターの押さえ方を確認するレッスンのイメージ',
    caption: 'ギターレッスンのイメージ',
    source: 'licensed-stock',
    sourcePage: 'https://www.pexels.com/photo/music-teacher-teaching-a-boy-to-play-a-guitar-8190779/',
    photographer: 'Yan Krukau',
    licenseUrl: pexelsLicense,
    focalPoint: { desktop: '58% 48%', mobile: '58% 48%' },
  },
  violin: {
    src: lessonViolin,
    alt: '講師が生徒のバイオリンの左手の位置を支えるレッスンのイメージ',
    caption: 'バイオリンレッスンのイメージ',
    source: 'licensed-stock',
    sourcePage: 'https://www.pexels.com/photo/woman-and-child-hands-holding-and-playing-violin-27439318/',
    photographer: 'Katya V',
    licenseUrl: pexelsLicense,
    focalPoint: { desktop: '48% 50%', mobile: '50% 52%' },
  },
  vocal: {
    src: lessonVocal,
    alt: '講師が譜面を見ながら生徒の発声を支える声楽レッスンのイメージ',
    caption: '声楽レッスンのイメージ',
    source: 'licensed-stock',
    sourcePage: 'https://www.pexels.com/photo/a-teacher-teaching-a-student-how-to-sing-7521312/',
    photographer: 'Pavel Danilyuk',
    licenseUrl: pexelsLicense,
    focalPoint: { desktop: '56% 48%', mobile: '58% 48%' },
  },
} satisfies Record<string, EditorialImage>;
