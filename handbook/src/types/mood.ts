export type MoodId = 'happy' | 'neutral' | 'calm' | 'low' | 'sad'

export interface Mood {
  id: MoodId
  name: string
  emoji: string
  color?: string
}

export interface MoodRecord {
  id: string
  date: string          // YYYY-MM-DD
  mood: MoodId
  intensity: number     // 1-10
  description: string
  tags: string[]
  image?: string
  cardProjectId?: string
  createdAt: string
}
