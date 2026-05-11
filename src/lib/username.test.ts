import { describe, expect, it } from 'vitest';
import { USERNAME_MAX, USERNAME_MIN, usernameSchema } from './username';

describe('usernameSchema', () => {
  it('accepts simple alphanumeric usernames', () => {
    expect(usernameSchema.parse('alice')).toBe('alice');
    expect(usernameSchema.parse('Bob42')).toBe('Bob42');
  });

  it('accepts hyphens and underscores after the first char', () => {
    expect(usernameSchema.parse('a-b_c')).toBe('a-b_c');
    expect(usernameSchema.parse('9_player')).toBe('9_player');
  });

  it('trims surrounding whitespace', () => {
    expect(usernameSchema.parse('  alice  ')).toBe('alice');
  });

  it(`rejects usernames shorter than ${USERNAME_MIN}`, () => {
    expect(() => usernameSchema.parse('ab')).toThrow();
  });

  it(`rejects usernames longer than ${USERNAME_MAX}`, () => {
    expect(() => usernameSchema.parse('a'.repeat(USERNAME_MAX + 1))).toThrow();
  });

  it('rejects usernames starting with a special char', () => {
    expect(() => usernameSchema.parse('-alice')).toThrow();
    expect(() => usernameSchema.parse('_alice')).toThrow();
  });

  it('rejects forbidden characters', () => {
    expect(() => usernameSchema.parse('alice!')).toThrow();
    expect(() => usernameSchema.parse('al ice')).toThrow();
    expect(() => usernameSchema.parse('al.ice')).toThrow();
    expect(() => usernameSchema.parse('al@ice')).toThrow();
  });
});
