export interface SubtitleSegment {
  phrase: string;
  startOffsetSec: number;
  endOffsetSec: number;
}

export type VisualType = 'human_realistic' | 'cinematic_story' | 'hybrid';

export type CameraMovement =
  | 'slow_zoom_in'
  | 'slow_zoom_out'
  | 'pan_left'
  | 'pan_right'
  | 'cinematic_tilt'
  | 'handheld_subtle';

export type ColorGrading =
  | 'warm_golden'
  | 'cinematic_teal_orange'
  | 'moody_dramatic'
  | 'vibrant_nature'
  | 'noir_contrast';

export interface VideoScene {
  sceneNumber: number;
  title: string;
  durationSec: number;
  voiceover: string;
  visualType: VisualType;
  visualDescription: string;
  cameraMovement: CameraMovement;
  lightingStyle: string;
  soundEffectCue: string;
  colorGrading: ColorGrading;
  subtitleSegments: SubtitleSegment[];
  customImageUrl?: string;
  audioUrl?: string; // Real synthesized Vietnamese MP3 file URL
  audioDurationSec?: number;
  audioStatus?: 'ready' | 'generating' | 'error' | 'pending';
}

export interface VoiceProfile {
  gender: 'male' | 'female';
  voiceName: string;
  styleDescription: string;
  pitch: number;
  rate: number;
  reason: string;
}

export interface BgmStyle {
  genre: string;
  bpm: number;
  mood: string;
  duckingPercent: number;
}

export interface AudioFilterConfig {
  highpassHissFilter: boolean;
  notchHumFilter: boolean;
  compressorAntiClipping: boolean;
  gainNormalization: number;
  antiHowlingLimiter: boolean;
  smoothCadence: boolean;
}

export interface VideoProject {
  id: string;
  title: string;
  hook: string;
  topic: string;
  duration: number; // 30, 60, or 180
  aspectRatio: '9:16' | '16:9';
  voiceProfile: VoiceProfile;
  bgmStyle: BgmStyle;
  audioFilterConfig: AudioFilterConfig;
  totalEstimatedSec: number;
  scenes: VideoScene[];
  masterAudioUrl?: string;
  allAudiosReady?: boolean;
}

export interface AudioQualityReport {
  isClean: boolean;
  hissRemovedDb: number;
  humDetected: boolean;
  clippingRisk: 'none' | 'low' | 'moderate' | 'high';
  peakLevelDb: number;
  dialogueContinuityScore: number;
  statusText: string;
  realAudioFilesCount?: number;
  totalSpokenSeconds?: number;
}
