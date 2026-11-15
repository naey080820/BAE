// Web Audio API로 효과음을 직접 만들어서 별도 음원 파일이 필요 없습니다.
let ctx = null
let muted = false

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

// 브라우저 정책상 사용자가 한 번 클릭해야 소리가 납니다.
export function unlockAudio() {
  const c = getCtx()
  if (c.state === 'suspended') c.resume()
}

export function setMuted(value) {
  muted = value
}

function beep({ freq, duration, type = 'sine', volume = 0.15, slideTo }) {
  if (muted || !ctx || ctx.state !== 'running') return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration)
  gain.gain.setValueAtTime(volume, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + duration)
}

// 한 글자가 나올 때: 짧은 타자기 소리
export const playType = () =>
  beep({ freq: 1400 + Math.random() * 400, duration: 0.03, type: 'square', volume: 0.04 })

// 탭을 바꿀 때: 위로 미끄러지는 소리
export const playSwitch = () =>
  beep({ freq: 500, slideTo: 900, duration: 0.15, type: 'triangle', volume: 0.2 })

// 버튼을 누를 때: 맑은 소리
export const playClick = () =>
  beep({ freq: 880, slideTo: 1320, duration: 0.2, type: 'sine', volume: 0.2 })
