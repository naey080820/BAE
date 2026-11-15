import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { playClick, playSwitch, playType, setMuted, unlockAudio } from './sound.js'

const tabs = {
  'GitHub란?': 'GitHub는 코드를 저장하고 공유하는 세계 최대의 개발자 플랫폼입니다. Git 기반으로 버전을 관리합니다.',
  주요기능: '저장소(Repository), 브랜치, Pull Request, Issues, Actions로 협업과 자동화를 쉽게 할 수 있습니다.',
  시작하기: '계정을 만들고 새 저장소를 생성한 뒤, 코드를 push 해보세요. 오픈소스에도 참여할 수 있습니다.',
}

// 글자를 한 글자씩 흘러나오게 보여주는 컴포넌트
function Typewriter({ text, speed = 40, sound = true }) {
  const chars = Array.from(text)
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    const id = setInterval(() => {
      setCount((n) => {
        if (n >= chars.length) {
          clearInterval(id)
          return n
        }
        if (sound && chars[n] !== ' ') playType()
        return n + 1
      })
    }, speed)
    return () => clearInterval(id)
  }, [text])

  // 단어 단위로 묶어서 단어 중간에서 줄이 바뀌지 않게 합니다.
  const words = []
  chars.slice(0, count).forEach((ch, i) => {
    if (ch === ' ' || words.length === 0) words.push([])
    words[words.length - 1].push(
      <span key={i} className="char" aria-hidden="true">
        {ch}
      </span>
    )
  })

  return (
    <span aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="word">
          {w}
        </span>
      ))}
      {count < chars.length && <span className="caret" aria-hidden="true" />}
    </span>
  )
}

export default function App() {
  const names = Object.keys(tabs)
  const [active, setActive] = useState(names[0])
  const [direction, setDirection] = useState(1)
  const [muted, setMutedState] = useState(false)
  const tabRefs = useRef({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  // 활성 탭 아래 밑줄이 미끄러지듯 이동하도록 위치 계산
  useLayoutEffect(() => {
    const el = tabRefs.current[active]
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
  }, [active])

  // 첫 클릭/키 입력 때 오디오를 켭니다.
  useEffect(() => {
    const unlock = () => unlockAudio()
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  const selectTab = (name) => {
    if (name === active) return
    unlockAudio()
    setDirection(names.indexOf(name) > names.indexOf(active) ? 1 : -1)
    setActive(name)
    playSwitch()
  }

  const toggleMute = () => {
    unlockAudio()
    setMuted(!muted)
    setMutedState(!muted)
  }

  return (
    <main className="card">
      <button className="mute" onClick={toggleMute} aria-label={muted ? '소리 켜기' : '소리 끄기'}>
        {muted ? '🔇' : '🔊'}
      </button>
      <h1>
        🐙 <Typewriter text="GitHub 소개" speed={90} sound={false} />
      </h1>
      <nav className="tabs">
        {names.map((name) => (
          <button
            key={name}
            ref={(el) => (tabRefs.current[name] = el)}
            className={name === active ? 'tab active' : 'tab'}
            onClick={() => selectTab(name)}
          >
            {name}
          </button>
        ))}
        <span className="indicator" style={{ left: indicator.left, width: indicator.width }} />
      </nav>
      <p key={active} className={direction > 0 ? 'content enter-right' : 'content enter-left'}>
        <Typewriter text={tabs[active]} />
      </p>
      <a href="https://github.com" target="_blank" rel="noreferrer" onClick={playClick}>
        <button className="cta">GitHub 방문하기</button>
      </a>
    </main>
  )
}
