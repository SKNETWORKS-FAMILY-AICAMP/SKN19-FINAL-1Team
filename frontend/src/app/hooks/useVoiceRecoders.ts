import { useState, useRef, useEffect, useCallback } from 'react';
import { encodeWAV } from './../../utils/audio'

const SAMPLE_RATE = 16000;
const VAD_THRESHOLD = 0.025;
const SILENCE_DURATION = 300;
const MAX_RECORDING_DURATION = 10000;

type WsStatus = 'Connected' | 'Disconnected' | 'Error';

// RAG 응답 타입 정의
export interface RAGCard {
  id?: string;
  title?: string;
  content?: string;
  keywords?: string[];
  [key: string]: unknown;
}

export interface RAGResponse {
  currentSituation: RAGCard[];
  nextStep: RAGCard[];
  guidanceScript: string;
  routing?: Record<string, unknown>;
  meta?: {
    model: string;
    doc_count: number;
    context_chars: number;
  };
  docs?: Array<Record<string, unknown>>;
}

// ⭐ [v25] AI 고객 응답 타입 (교육 모드 TTS용)
export interface CustomerResponseData {
  text: string;
  turn_number: number;
  audio_url?: string;
}

export interface WebSocketMessage {
  type: 'rag' | 'session' | 'stt' | 'connected' | 'customer_response';
  data: RAGResponse | string | CustomerResponseData;
  text?: string;  // STT 결과 텍스트
  ws_session_id?: string;  // connected 메시지용
}

interface UseVoiceRecorderOptions {
  onRagResult?: (data: RAGResponse) => void;
  onSessionId?: (sessionId: string) => void;
  onSttResult?: (text: string) => void;  // ⭐ [v24] STT 결과 콜백
  onCustomerResponse?: (data: CustomerResponseData) => void;  // ⭐ [v25] AI 고객 응답 콜백 (TTS)
  onConnected?: (wsSessionId: string) => void;  // ⭐ [v25] WebSocket 연결 완료 콜백
  wsEndpoint?: string;  // ⭐ [v25] WebSocket 엔드포인트 (교육: ws/edu, 실전: ws/call)
}

export const useVoiceRecorder = (options?: UseVoiceRecorderOptions) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [wsStatus, setWsStatus] = useState<WsStatus>('Disconnected');
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Refs
  const websocket = useRef<WebSocket | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const processor = useRef<ScriptProcessorNode | null>(null);
  const inputSource = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioBufferRef = useRef<Float32Array[]>([]);
  const isSpeakingRef = useRef<boolean>(false);
  const silenceStartRef = useRef<number | null>(null);
  const recordingStartRef = useRef<number | null>(null);
  const optionsRef = useRef(options);

  // options 업데이트
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // 오디오 데이터 전송 함수
  const sendAudioData = useCallback(() => {
    if (audioBufferRef.current.length === 0) return;

    const totalLength = audioBufferRef.current.reduce((acc, buf) => acc + buf.length, 0);
    const result = new Float32Array(totalLength);
    let offset = 0;
    for (const buf of audioBufferRef.current) {
      result.set(buf, offset);
      offset += buf.length;
    }

    const wavBuffer = encodeWAV(result, SAMPLE_RATE);

    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(wavBuffer);
      console.log('[WebSocket] 오디오 데이터 전송:', wavBuffer.byteLength, 'bytes');
    }

    audioBufferRef.current = [];
    recordingStartRef.current = Date.now();
  }, []);

  // 오디오 처리 콜백
  const processAudio = useCallback((e: AudioProcessingEvent) => {
    const inputData = e.inputBuffer.getChannelData(0);

    let sum = 0;
    for (let i = 0; i < inputData.length; i++) {
      sum += inputData[i] * inputData[i];
    }
    const rms = Math.sqrt(sum / inputData.length);

    if (rms > VAD_THRESHOLD) {
      if (!isSpeakingRef.current) {
        isSpeakingRef.current = true;
        recordingStartRef.current = Date.now();
      }
      silenceStartRef.current = null;
      audioBufferRef.current.push(new Float32Array(inputData));

      if (recordingStartRef.current && Date.now() - recordingStartRef.current > MAX_RECORDING_DURATION) {
        console.log("[VAD] 최대 녹음 시간 초과 → 데이터 전송");
        sendAudioData();
      }

    } else {
      if (isSpeakingRef.current) {
        audioBufferRef.current.push(new Float32Array(inputData));
        if (silenceStartRef.current === null) silenceStartRef.current = Date.now();

        if (Date.now() - silenceStartRef.current > SILENCE_DURATION) {
          console.log("[VAD] 침묵 감지 → 데이터 전송");
          sendAudioData();
          isSpeakingRef.current = false;
          silenceStartRef.current = null;
          recordingStartRef.current = null;
        }
      }
    }
  }, [sendAudioData]);

  // 녹음 중지 및 리소스 정리
  const stop = useCallback(() => {
    console.log('[WebSocket] 녹음 중지 및 리소스 정리');

    if (processor.current) {
      processor.current.disconnect();
      processor.current = null;
    }
    if (inputSource.current) {
      inputSource.current.disconnect();
      inputSource.current = null;
    }
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }

    if (isSpeakingRef.current) sendAudioData();

    if (websocket.current) {
      websocket.current.close();
      websocket.current = null;
    }

    audioBufferRef.current = [];
    isSpeakingRef.current = false;
    setIsRecording(false);
    setWsStatus('Disconnected');
    setSessionId(null);
  }, [sendAudioData]);

  // 녹음 시작
  const start = useCallback(async () => {
    try {
      console.log('[WebSocket] 연결 시작...');

      // ⭐ [v25] 웹소켓 연결 (교육: ws/edu, 실전: ws/call)
      const endpoint = optionsRef.current?.wsEndpoint || "wss://api.callact.click/api/v1/ws/call";      
      console.log('[WebSocket] 엔드포인트:', endpoint);
      websocket.current = new WebSocket(endpoint);

      websocket.current.onopen = () => {
        console.log('[WebSocket] 연결 성공');
        setWsStatus('Connected');
      };

      websocket.current.onclose = () => {
        console.log('[WebSocket] 연결 종료');
        setWsStatus('Disconnected');
      };

      websocket.current.onerror = (err) => {
        console.error("[WebSocket] 에러:", err);
        setWsStatus('Error');
      };

      // ⭐ 메시지 수신 핸들러 (RAG 결과 처리)
      websocket.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[WebSocket] 메시지 수신:', message);

          // 첫 번째 메시지: session_id (string) - ws/call 호환
          if (typeof message === 'string') {
            console.log('[WebSocket] 세션 ID:', message);
            setSessionId(message);
            optionsRef.current?.onSessionId?.(message);
            return;
          }

          // ⭐ [v25] WebSocket 연결 확인 (ws/edu에서 JSON으로 세션 ID 전송)
          if (message.type === 'connected' && message.ws_session_id) {
            console.log('[WebSocket] 연결 확인, 세션 ID:', message.ws_session_id);
            setSessionId(message.ws_session_id);
            optionsRef.current?.onSessionId?.(message.ws_session_id);
            optionsRef.current?.onConnected?.(message.ws_session_id);
            return;
          }

          // ⭐ [v24] STT 결과 메시지
          if (message.type === 'stt' && message.text) {
            console.log('[WebSocket] STT 결과 수신:', message.text);
            optionsRef.current?.onSttResult?.(message.text);
          }

          // RAG 결과 메시지
          if (message.type === 'rag' && message.data) {
            console.log('[WebSocket] RAG 결과 수신:', message.data);
            optionsRef.current?.onRagResult?.(message.data as RAGResponse);
          }

          // ⭐ [v25] AI 고객 응답 메시지 (교육 모드 TTS)
          if (message.type === 'customer_response' && message.data) {
            console.log('[WebSocket] AI 고객 응답 수신:', message.data);
            optionsRef.current?.onCustomerResponse?.(message.data as CustomerResponseData);
          }
        } catch (err) {
          console.error('[WebSocket] 메시지 파싱 에러:', err);
        }
      };

      // 마이크 연결
      console.log('[Audio] 마이크 연결 시작...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContext.current = new AudioContextClass({ sampleRate: SAMPLE_RATE });

      inputSource.current = audioContext.current.createMediaStreamSource(stream);
      processor.current = audioContext.current.createScriptProcessor(4096, 1, 1);
      processor.current.onaudioprocess = processAudio;

      inputSource.current.connect(processor.current);
      processor.current.connect(audioContext.current.destination);

      console.log('[Audio] 마이크 연결 완료');
      setIsRecording(true);
    } catch (err) {
      console.error("[WebSocket] 시작 실패:", err);
      stop();
    }
  }, [processAudio, stop]);

  // ⭐ [v25] JSON 메시지 전송 (init_simulation, text_message 등)
  const sendMessage = useCallback((data: Record<string, unknown>) => {
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify(data));
      console.log('[WebSocket] JSON 메시지 전송:', data);
    } else {
      console.warn('[WebSocket] 전송 실패 - 연결되지 않음');
    }
  }, []);

  // 컴포넌트 언마운트 시 강제 종료
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { start, stop, sendMessage, isRecording, wsStatus, sessionId };
};
