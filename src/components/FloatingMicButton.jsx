export default function FloatingMicButton({ isListening, onClick, disabled }) {
  return (
    <button
      className={`floating-mic-btn ${isListening ? 'listening' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title="Click to speak"
      aria-label="Voice command button"
    >
      {isListening ? (
        <div className="mic-waveform">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      ) : (
        <span className="mic-icon">🎤</span>
      )}
    </button>
  )
}
