export function isDemo() {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

export function getPaceBand(difficulty?: string, avgSpeed?: number) {
  if (avgSpeed) {
    if (avgSpeed < 22) return { id: 'easy', name: 'Easy', range: `${avgSpeed} km/h` }
    if (avgSpeed < 26) return { id: 'club', name: 'Club', range: `${avgSpeed} km/h` }
    if (avgSpeed < 30) return { id: 'tempo', name: 'Tempo', range: `${avgSpeed} km/h` }
    return { id: 'hammer', name: 'Hammer', range: `${avgSpeed}+ km/h` }
  }
  switch (difficulty) {
    case 'easy':
      return { id: 'easy', name: 'Easy', range: '18–22 km/h' }
    case 'moderate':
      return { id: 'club', name: 'Club', range: '22–26 km/h' }
    case 'hard':
      return { id: 'tempo', name: 'Tempo', range: '26–30 km/h' }
    case 'elite':
      return { id: 'hammer', name: 'Hammer', range: '30+ km/h' }
    default:
      return { id: 'open', name: 'Open', range: 'Club pace' }
  }
}

export function getClubhouseLabel(clubhouse?: string) {
  switch (clubhouse) {
    case 'tena':
      return 'Tena'
    case 'utawala':
      return 'Utawala'
    default:
      return 'On the road'
  }
}

export function kenyanGreeting(hour = new Date().getHours()) {
  if (hour < 11) return 'Habari za asubuhi'
  if (hour < 16) return 'Habari za mchana'
  return 'Habari za jioni'
}
