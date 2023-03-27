import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'


function Overlay() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
      <a href="https://www.linkedin.com/in/hernan-lavrencic-65b33452/" style={{ position: 'absolute', bottom: 40, left: 90, fontSize: '13px' }}>
        <img src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg" width="20" alt="linkedIn logo"  />
        hlavrencic
      </a>
      <div style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px' }}>Welcome —</div>
      <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>March 2023</div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Overlay />
  </>
)
