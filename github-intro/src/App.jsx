import { useState } from 'react'

const tabs = {
  'GitHub란?': 'GitHub는 코드를 저장하고 공유하는 세계 최대의 개발자 플랫폼입니다. Git 기반으로 버전을 관리합니다.',
  주요기능: '저장소(Repository), 브랜치, Pull Request, Issues, Actions로 협업과 자동화를 쉽게 할 수 있습니다.',
  시작하기: '계정을 만들고 새 저장소를 생성한 뒤, 코드를 push 해보세요. 오픈소스에도 참여할 수 있습니다.',
}

export default function App() {
  const [active, setActive] = useState('GitHub란?')

  return (
    <main className="card">
      <h1>🐙 GitHub 소개</h1>
      <nav className="tabs">
        {Object.keys(tabs).map((name) => (
          <button
            key={name}
            className={name === active ? 'tab active' : 'tab'}
            onClick={() => setActive(name)}
          >
            {name}
          </button>
        ))}
      </nav>
      <p className="content">{tabs[active]}</p>
      <a href="https://github.com" target="_blank" rel="noreferrer">
        <button className="cta">GitHub 방문하기</button>
      </a>
    </main>
  )
}
