// Ses kontrolü
const isSoundEnabled = (): boolean => {
  const soundEnabled = localStorage.getItem('horseRacingSoundEnabled')
  return soundEnabled === null ? true : soundEnabled === 'true'
}

// Gallop sesi için global değişkenler
let gallopAudio: HTMLAudioElement | null = null

// Ses çalma fonksiyonu
const playSound = (frequencies: number[], duration: number, type: OscillatorType = 'sine') => {
  if (!isSoundEnabled()) return

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = type

    // Frekansları ayarla
    frequencies.forEach((freq, index) => {
      const time = audioContext.currentTime + index * 0.1
      oscillator.frequency.setValueAtTime(freq, time)
    })

    // Ses seviyesi
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (error) {
    console.log('Ses çalınamadı:', error)
  }
}

// Gallop sesini başlat (loop)
export const startGallopSound = () => {
  if (!isSoundEnabled() || gallopAudio) return

  try {
    gallopAudio = new Audio('/gallop.mp3')
    gallopAudio.volume = 0.3
    gallopAudio.loop = true

    gallopAudio.play().catch((error) => {
      console.log('Gallop sesi başlatılamadı:', error)
    })
  } catch (error) {
    console.log('Gallop sesi oluşturulamadı:', error)
  }
}

// Gallop sesini durdur
export const stopGallopSound = () => {
  if (gallopAudio) {
    gallopAudio.pause()
    gallopAudio.currentTime = 0
    gallopAudio = null
  }
}

// 1. Round başlangıç sesi - At yarışı başlama sinyali
export const playRoundStartSound = () => {
  playSound([150, 300, 450, 700, 1000], 2, 'triangle')
}

// 2. At bitiş sesi - At bitiş çizgisini geçtiğinde
export const playHorseFinishSound = () => {
  playSound([600, 800, 1000], 0.4, 'square')
}
