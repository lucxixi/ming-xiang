import { describe, expect, it } from 'vitest';
import { activeCaptionAt, parseSrt } from './subtitles';

const sample = `1
00:00:02,400 --> 00:00:05,900
第一句

2
00:00:06,200 --> 00:00:08,000
第二句
换行`;

describe('subtitle utilities', () => {
  it('parses SRT timestamps and multiline captions', () => {
    expect(parseSrt(sample)).toEqual([
      { start: 2.4, end: 5.9, text: '第一句' },
      { start: 6.2, end: 8, text: '第二句 换行' },
    ]);
  });

  it('selects the caption for the current audio time', () => {
    const cues = parseSrt(sample);
    expect(activeCaptionAt(cues, 0)).toBe('第一句');
    expect(activeCaptionAt(cues, 4)).toBe('第一句');
    expect(activeCaptionAt(cues, 6)).toBe('');
    expect(activeCaptionAt(cues, 7)).toBe('第二句 换行');
  });
});

