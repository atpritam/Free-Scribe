export interface TranscriptionResult {
  text: string;
  start: number;
  end: number;
}

export interface AudioFile extends File {
  name: string;
  size: number;
  type: string;
}

export interface AudioStream extends Blob {
  type: string;
  size: number;
}

export interface HeaderProps {
  resetToHomePage: () => void;
}

export interface HomePageProps {
  setFile: (file: AudioFile | null) => void;
  setAudioStream: (stream: AudioStream | null) => void;
}

export interface FileDisplayProps {
  file: AudioFile | null;
  audioStream?: AudioStream | null;
  handleAudioReset: () => void;
  handleFormSubmission: () => void;
}

export interface TranscribingProps {
  downloading?: boolean;
}

export interface TranscriptionProps {
  text: string | null;
}

export interface TranslationProps {
  text: string | null;
  translatedText: React.MutableRefObject<string>;
  language: React.MutableRefObject<string>;
}

export interface InformationProps {
  text: string | null;
}

export type FooterProps = Record<string, never>;

export interface WorkerMessage {
  type: string;
  [key: string]: unknown;
}

export interface TranscriptionWorkerMessage extends WorkerMessage {
  type: 'LOADING' | 'RESULT' | 'RESULT_PARTIAL' | 'INFERENCE_DONE';
  status?: string;
  results?: TranscriptionResult[];
  result?: TranscriptionResult;
  isDone?: boolean;
  completedUntilTimestamp?: number;
}

export interface TranslationWorkerMessage extends WorkerMessage {
  status: 'initiate' | 'progress' | 'update' | 'complete' | 'error';
  output?: string | unknown[];
  message?: string;
}

export interface Language {
  language: string;
  name: string;
}

export interface MobileLanguage extends Language {
  language: string;
  name: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}
