export interface CaptionCue {
  start: number;
  end: number;
  text: string;
}

function parseTimestamp(value: string) {
  const [hours, minutes, seconds] = value.replace(',', '.').split(':');
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

export function parseSrt(source: string): CaptionCue[] {
  return source
    .trim()
    .split(/\r?\n\r?\n/)
    .map(block => {
      const lines = block.split(/\r?\n/);
      const timingIndex = lines.findIndex(line => line.includes('-->'));
      if (timingIndex === -1) return null;

      const [start, end] = lines[timingIndex].split('-->').map(value => value.trim());
      return {
        start: parseTimestamp(start),
        end: parseTimestamp(end),
        text: lines.slice(timingIndex + 1).join(' ').trim(),
      };
    })
    .filter((cue): cue is CaptionCue => Boolean(cue?.text));
}

export function activeCaptionAt(cues: CaptionCue[], elapsed: number) {
  if (cues.length === 0) return '';
  if (elapsed < cues[0].start) return cues[0].text;
  return cues.find(cue => elapsed >= cue.start && elapsed <= cue.end)?.text ?? '';
}
