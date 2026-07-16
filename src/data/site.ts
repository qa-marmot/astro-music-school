import type { EditorialImage } from '../types';
import { courseImages } from './images';

export type ContentMode = 'demo' | 'production';
export type CourseId = 'piano' | 'guitar' | 'violin' | 'vocal';

export interface Course {
  id: CourseId;
  name: string;
  summary: string;
  description: string;
  ages: string;
  levels: string[];
  features: string[];
  photo: EditorialImage;
}

export interface PricingPlan {
  id: string;
  name: string;
  audience: string;
  frequency: string;
  duration: string;
  monthlyPriceExTax: number;
  features: string[];
  recommended?: boolean;
}

export interface Instructor {
  name: string;
  role: string;
  bio: string;
  photo?: EditorialImage;
}

export const audienceGuides = [
  {
    title: 'お子さまの初めての習いごとに',
    body: '楽器に触れる時間を楽しみながら、姿勢や音の聴き方を一つずつ身につけます。体験では、集中できる時間や先生との相性もご確認いただけます。',
  },
  {
    title: '大人になって、初めて楽器を手にする方に',
    body: '楽譜が読めなくても大丈夫です。好きな曲や生活のペースを伺い、無理なく続けられる練習の形を一緒に探します。',
  },
  {
    title: '再開や、具体的な目標がある方に',
    body: '以前の経験、弾きたい曲、発表の予定などをもとに、いま必要な基礎と表現を整理します。体験時に目標までの進め方をご相談ください。',
  },
] as const;

export const trialSteps = [
  { title: 'お申し込み', body: '楽器、ご希望の日時、経験などをフォームからお知らせください。' },
  { title: '日程のご相談', body: `内容を確認し、${'1〜2営業日以内'}に候補日時をご案内します。` },
  { title: '体験レッスン', body: '目標を伺ってから楽器に触れ、今後の進め方をご相談します。' },
] as const;

export interface ContactDetails {
  postalCode: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  closed: string;
  station: string;
  mapEmbedUrl?: string;
  mapUrl?: string;
}

export interface SiteContent {
  mode: ContentMode;
  name: string;
  siteUrl: string;
  formEndpoint?: string;
  trialPriceExTax: number;
  trialDuration: string;
  responseTime: string;
  courses: Course[];
  pricing: PricingPlan[];
  instructors: Instructor[];
  contact?: ContactDetails;
}

const mode = (import.meta.env.PUBLIC_CONTENT_MODE ?? 'demo') as ContentMode;

export const siteContent: SiteContent = {
  mode,
  name: import.meta.env.PUBLIC_SITE_NAME ?? 'Harmony Music School',
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT || undefined,
  trialPriceExTax: 3000,
  trialDuration: '45〜60分',
  responseTime: '1〜2営業日以内',
  courses: [
    {
      id: 'piano',
      name: 'ピアノ',
      summary: '基礎から演奏表現まで、一人ひとりのペースで学びます。',
      description: '楽譜の読み方や指の使い方から、弾きたい曲の表現まで。初めて鍵盤に触れる方にも、経験のある方にも合わせて進めます。',
      ages: '4歳〜大人',
      levels: ['初めて', '経験者', '本格的に学びたい方'],
      features: ['個別の目標に合わせた選曲', '基礎と表現を両立', '発表に向けた相談にも対応'],
      photo: courseImages.piano,
    },
    {
      id: 'guitar',
      name: 'ギター',
      summary: 'コード、弾き語り、ソロ演奏を、好きな音楽から始めます。',
      description: 'アコースティック・クラシックギターを中心に、構え方やコードから丁寧に指導します。目標の曲に必要な力を段階的に身につけます。',
      ages: '6歳〜大人',
      levels: ['初めて', '経験者', '弾き語り・ソロ'],
      features: ['コード・タブ譜に対応', '弾き語りとソロの両方に対応', '好きな曲を軸にしたレッスン'],
      photo: courseImages.guitar,
    },
    {
      id: 'violin',
      name: 'バイオリン',
      summary: '姿勢と弓の使い方を整え、豊かな音色を育てます。',
      description: '楽器の構え方、弓の動かし方、音程の取り方を一つずつ積み重ねます。大人になってから始める方も自分のペースで学べます。',
      ages: '5歳〜大人',
      levels: ['初めて', '経験者', 'アンサンブル'],
      features: ['姿勢と弓の基礎から指導', '音程・音色を丁寧に確認', 'アンサンブルの相談にも対応'],
      photo: courseImages.violin,
    },
    {
      id: 'vocal',
      name: '声楽',
      summary: '呼吸と発声を整え、自分らしい声で歌う力を養います。',
      description: '呼吸、姿勢、発声の基礎から、曲の言葉や感情を届ける表現まで。クラシックからポップスまで目標に合わせて取り組みます。',
      ages: '小学生〜大人',
      levels: ['初めて', '経験者', '舞台を目指す方'],
      features: ['呼吸・発声の基礎', '幅広いジャンルに対応', '言葉と音楽の表現を重視'],
      photo: courseImages.vocal,
    },
  ],
  pricing: [
    {
      id: 'light', name: 'ライトプラン', audience: '無理なく音楽を続けたい方へ',
      frequency: '月2回', duration: '45分', monthlyPriceExTax: 12000,
      features: ['月2回・45分', '教材費別途', '振替は月1回まで'],
    },
    {
      id: 'standard', name: 'スタンダードプラン', audience: '定期的に練習し、着実に上達したい方へ',
      frequency: '月3回', duration: '60分', monthlyPriceExTax: 18000,
      features: ['月3回・60分', '教材費別途', '振替は月2回まで'], recommended: true,
    },
    {
      id: 'premium', name: 'プレミアムプラン', audience: '演奏会など明確な目標がある方へ',
      frequency: '月4回〜', duration: '60〜90分', monthlyPriceExTax: 24000,
      features: ['月4回以上・60〜90分', '一部教材費を含む', '目標に合わせた追加相談'],
    },
  ],
  // Demo content deliberately contains no fictional teachers or contact details.
  instructors: [],
  contact: undefined,
};

export const isDemo = siteContent.mode !== 'production';

export function assertProductionContent(): void {
  if (isDemo) return;

  const failures: string[] = [];
  if (!/^https:\/\//.test(siteContent.siteUrl)) failures.push('PUBLIC_SITE_URL must use https');
  if (!siteContent.formEndpoint) failures.push('PUBLIC_FORM_ENDPOINT is required');
  if (!siteContent.contact) failures.push('verified contact details are required');
  if (siteContent.instructors.length === 0) failures.push('at least one verified instructor is required');

  if (failures.length > 0) {
    throw new Error(`Production content validation failed: ${failures.join(', ')}`);
  }
}
