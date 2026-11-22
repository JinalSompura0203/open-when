import { useState } from 'react'
import settings from '../../settings.js'
import '../styles/passcode.css'

/** A gentle lock screen. Not real security: the passcode is in the page code. */
export default function PasscodeGate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (value === settings.passcode) {
      onUnlock()
    } else {
      setValue('')
      setWrong(true)
    }
  }

  return (
    <form className="auth" onSubmit={submit}>
      <h1>{settings.siteTitle}</h1>
      <p>Enter the passcode</p>
      <input
        type="password"
        value={value}
        placeholder={wrong ? 'Try again' : ''}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <button className="btn" type="submit">Open</button>
    </form>
  )
}
