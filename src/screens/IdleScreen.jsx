import { useState, useRef, useEffect } from 'react'

const QUICK_CHIPS = [
  {
    icon: '🗽',
    label: 'New York City',
    subtitle: 'Midtown · under $250/night',
    message: 'I need to find a business hotel in New York City for 3 nights, midtown, under $250 per night'
  },
  {
    icon: '🌆',
    label: 'Chicago',
    subtitle: 'The Loop · ~$180/night',
    message: 'I need to find a business hotel in Chicago for 3 nights on Jan 20-23, the Loop neighborhood, around $180 per night'
  },
  {
    icon: '🌉',
    label: 'San Francisco',
    subtitle: 'Conference · workspace needed',
    message: 'I need to find a business hotel in San Francisco for 4 nights with fast WiFi and a dedicated workspace for a conference'
  }
]

export default function IdleScreen({ onMessage, isLoading }) {
  const [displayText, setDisplayText] = useState('Where are you headed and when?')
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)

  const recognitionRef = useRef(null)
  const inputRef = useRef(null)
  const finalTranscriptRef = useRef('')
  const silenceTimerRef = useRef(null)
  const transcriptSentRef = useRef(false)

  // Initialize speech recognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setVoiceSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    // START LISTENING
    recognition.onstart = () => {
      finalTranscriptRef.current = ''
      transcriptSentRef.current = false
      setDisplayText('')
      setIsListening(true)
    }

    // PROCESS RESULTS
    recognition.onresult = (event) => {
      let interim = ''
      let finalFull = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalFull += transcript + ' '
        } else {
          interim += transcript
        }
      }

      // Update final transcript
      if (finalFull) {
        finalTranscriptRef.current = finalFull.trim()
      }

      // Display text (show final + interim)
      const displayValue = finalTranscriptRef.current
        ? finalTranscriptRef.current + (interim ? ' ' + interim : '')
        : interim || 'Listening...'
      setDisplayText(displayValue)

      // Reset silence timer every time we get a result
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }

      // Set new silence timer: 1.5 seconds
      silenceTimerRef.current = setTimeout(() => {
        if (isListening && finalTranscriptRef.current && !transcriptSentRef.current) {
          submitTranscript(finalTranscriptRef.current)
        }
      }, 1500)

      // Check for "go" trigger word on final results
      if (finalFull && !transcriptSentRef.current) {
        const lowerFinal = finalTranscriptRef.current.toLowerCase()
        if (lowerFinal.endsWith(' go') || lowerFinal === 'go') {
          // Remove "go" from the end
          const withoutGo = finalTranscriptRef.current
            .toLowerCase()
            .replace(/\s+go\s*$/i, '')
            .trim()

          if (withoutGo) {
            // Send the transcript without "go"
            submitTranscript(withoutGo)
          }
        }
      }
    }

    // HANDLE ERRORS
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)

      // Only show error if it's a real error, not just "no-speech"
      if (event.error !== 'no-speech' && event.error !== 'network') {
        setDisplayText('Voice not supported — type below')
      }

      // Reset state
      setIsListening(false)
      finalTranscriptRef.current = ''
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }

    // END LISTENING
    recognition.onend = () => {
      // Clear silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }

      // Fallback: if nothing was sent but we have a transcript, send it now
      if (finalTranscriptRef.current && !transcriptSentRef.current) {
        submitTranscript(finalTranscriptRef.current)
      }

      // Reset state
      setIsListening(false)
      if (!transcriptSentRef.current) {
        setDisplayText('Where are you headed and when?')
      }
    }

    recognitionRef.current = recognition

    // Cleanup on unmount
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      recognition.stop()
    }
  }, [])

  // Submit transcript and send to parent
  const submitTranscript = (transcript) => {
    if (!transcript || transcriptSentRef.current) return

    transcriptSentRef.current = true

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }

    setIsListening(false)
    setDisplayText('')

    // Send to parent handler
    onMessage(transcript).then(() => {
      setDisplayText('Where are you headed and when?')
    }).catch(() => {
      setDisplayText('Where are you headed and when?')
    })
  }

  // Toggle listening on orb click
  const handleOrbClick = () => {
    if (!voiceSupported || isLoading) return

    if (isListening) {
      // Stop listening and send
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    } else {
      // Start listening
      finalTranscriptRef.current = ''
      transcriptSentRef.current = false
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    }
  }

  // Handle quick chip clicks
  const handleChipClick = (message) => {
    onMessage(message)
  }

  // Handle text input submission
  const handleTextSubmit = () => {
    const text = inputRef.current?.value.trim()
    if (!text || isLoading) return

    inputRef.current.value = ''
    onMessage(text)
  }

  return (
    <div className="idle-screen">
      <div className="header">
        <div className="logo">✈️ Airbnb Voice</div>
        <p className="subtitle">Business Travel</p>
      </div>

      <div className="orb-container">
        <div className="rings"></div>
        <div
          className={`orb ${isLoading ? 'processing' : isListening ? 'listening' : 'idle'}`}
          onClick={handleOrbClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleOrbClick()}
        >
          {isListening ? (
            <div className="waveform">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          ) : (
            <span className="mic-icon">🎤</span>
          )}
        </div>
        <p className="orb-label">
          {isLoading ? 'Searching...' : isListening ? 'Listening...' : 'Tap to speak'}
        </p>
      </div>

      <div className="transcript-bubble">
        {displayText || 'Where are you headed and when?'}
      </div>

      <div className="chips-container">
        {QUICK_CHIPS.map((chip, i) => (
          <button
            key={i}
            className="chip"
            onClick={() => handleChipClick(chip.message)}
            disabled={isLoading || isListening}
          >
            <div className="chip-icon">{chip.icon}</div>
            <div className="chip-text">
              <div className="chip-label">{chip.label}</div>
              <div className="chip-subtitle">{chip.subtitle}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your search..."
          onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
          disabled={isLoading || isListening}
          className="text-input"
        />
        <button
          onClick={handleTextSubmit}
          disabled={isLoading || isListening}
          className="text-send-btn"
        >
          Send
        </button>
      </div>
    </div>
  )
}
