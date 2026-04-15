import { PuzzleWord } from "./puzzle-words";

export const BOLT_COLORS = {
  pink:   { bg: "#ff8fab", border: "#ff6b8a", label: "Розовый" },
  blue:   { bg: "#74b9ff", border: "#0984e3", label: "Синий" },
  green:  { bg: "#55efc4", border: "#00b894", label: "Зелёный" },
  yellow: { bg: "#ffeaa7", border: "#fdcb6e", label: "Жёлтый" },
  purple: { bg: "#a29bfe", border: "#6c5ce7", label: "Фиолетовый" },
  red:    { bg: "#ff7675", border: "#d63031", label: "Красный" },
} as const;

export type BoltColor = keyof typeof BOLT_COLORS;

export interface Bolt {
  id: string;
  color: BoltColor;
  word: PuzzleWord;
  position: { x: number; y: number; z: number };
  blockedBy: string[];
}

export interface SlotState {
  color: BoltColor;
  capacity: number;
  bolts: string[];
}

export function isBoltBlocked(bolt: Bolt, remainingBolts: Bolt[]): boolean {
  return bolt.blockedBy.some((blockerId) =>
    remainingBolts.some((b) => b.id === blockerId)
  );
}

export function canAddToSlot(slot: SlotState, boltColor: BoltColor): boolean {
  return slot.color === boltColor && slot.bolts.length < slot.capacity;
}

export function isLevelComplete(slots: SlotState[]): boolean {
  return slots.every((slot) => slot.bolts.length === slot.capacity);
}

export function createSlots(colors: BoltColor[], capacity: number): SlotState[] {
  return colors.map((color) => ({ color, capacity, bolts: [] }));
}

export function addBoltToSlot(slots: SlotState[], boltId: string, boltColor: BoltColor): SlotState[] {
  return slots.map((slot) => {
    if (slot.color === boltColor && slot.bolts.length < slot.capacity) {
      return { ...slot, bolts: [...slot.bolts, boltId] };
    }
    return slot;
  });
}

export function getAvailableBolts(bolts: Bolt[]): Bolt[] {
  return bolts.filter((b) => !isBoltBlocked(b, bolts));
}

export function calculateStars(livesRemaining: number, totalLives: number): number {
  if (livesRemaining === totalLives) return 3;
  if (livesRemaining >= totalLives - 1) return 2;
  return 1;
}
