/**
 * 문자열을 DataView에 바이트 단위로 기록하는 헬퍼 함수
 */
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Float32 포맷의 오디오 데이터를 16-bit PCM 포맷으로 변환하여 DataView에 기록합니다.
 */
export function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array): void {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    // 16비트 정수 범위(-32768 ~ 32767)로 변환
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true); // true = Little Endian
  }
}

/**
 * WAV 파일 헤더를 작성합니다.
 */
export function writeWavHeader(view: DataView, sampleRate: number, dataLength: number): void {
  // 1. RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true); // file length
  writeString(view, 8, 'WAVE');

  // 2. fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true);  // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * BlockAlign)
  view.setUint16(32, 2, true);  // BlockAlign (NumChannels * BitsPerSample/8)
  view.setUint16(34, 16, true); // BitsPerSample

  // 3. data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true); // Subchunk2Size
}

/**
 * 오디오 샘플을 받아 WAV 포맷(헤더 포함)의 ArrayBuffer로 인코딩합니다.
 */
export function encodeWAV(samples: Float32Array, sampleRate: number = 16000): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeWavHeader(view, sampleRate, samples.length * 2);
  floatTo16BitPCM(view, 44, samples);

  return buffer;
}
