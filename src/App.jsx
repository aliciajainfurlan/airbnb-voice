import { useState, useEffect, useRef } from 'react'
import IdleScreen from './screens/IdleScreen.jsx'
import ResultsScreen from './screens/ResultsScreen.jsx'
import BookingScreen from './screens/BookingScreen.jsx'
import ConfirmedScreen from './screens/ConfirmedScreen.jsx'
import FloatingMicButton from './components/FloatingMicButton.jsx'

export default function App() {
  const [screen, setScreen] = useState('idle')
  const [messages, setMessages] = useState([])
  const [listings, setListings] = useState([])
  const [selectedListing, setSelectedListing] = useState(null)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [confirmationDetails, setConfirmationDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [floatingMicListening, setFloatingMicListening] = useState(false)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef('')
  const silenceTimerRef = useRef(null)
  const transcriptSentRef = useRef(false)
  const messagesRef = useRef([])

  // Keep messagesRef in sync with messages state
  useEffect(() => {
    messagesRef.current = messages
    console.log(`🔄 Messages ref updated: ${messages.length} messages in state`)
  }, [messages])

  // Auto-dismiss error after 3.5s
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 3500)
      return () => clearTimeout(timeout)
    }
  }, [error])

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const timeEl = document.getElementById('time')
      if (timeEl) timeEl.textContent = `${hours}:${minutes}`
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Initialize global speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      finalTranscriptRef.current = ''
      transcriptSentRef.current = false
      setFloatingMicListening(true)
    }

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

      if (finalFull) {
        finalTranscriptRef.current = finalFull.trim()
      }

      // Reset silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }

      silenceTimerRef.current = setTimeout(() => {
        if (finalTranscriptRef.current && !transcriptSentRef.current) {
          submitVoiceTranscript(finalTranscriptRef.current)
        }
      }, 2500)

      // Check for "go" trigger word
      if (finalFull && !transcriptSentRef.current) {
        const lowerFinal = finalTranscriptRef.current.toLowerCase()
        if (lowerFinal.endsWith(' go') || lowerFinal === 'go') {
          const withoutGo = finalTranscriptRef.current
            .toLowerCase()
            .replace(/\s+go\s*$/i, '')
            .trim()
          if (withoutGo) {
            submitVoiceTranscript(withoutGo)
          }
        }
      }
    }

    recognition.onend = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }

      // Fallback: send transcript if nothing was sent yet
      if (finalTranscriptRef.current && !transcriptSentRef.current) {
        submitVoiceTranscript(finalTranscriptRef.current)
      }

      setFloatingMicListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      setFloatingMicListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      recognition.stop()
    }
  }, [])

  // Submit voice transcript through the API
  const submitVoiceTranscript = async (transcript) => {
    if (!transcript || transcriptSentRef.current) return

    transcriptSentRef.current = true

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }

    setFloatingMicListening(false)
    await handleUserMessage(transcript)
  }

  const callAPI = async (userMessage) => {
    try {
      setIsLoading(true)
      setError(null)

      // Use ref to get the CURRENT messages state (not stale closure)
      const currentMessages = messagesRef.current
      console.log(`📤 Current messages from ref: ${currentMessages.length}`)

      // Construct updated messages for API call
      const updatedMessages = [
        ...currentMessages,
        { role: 'user', content: userMessage }
      ]

      console.log(`📨 Messages being sent: ${updatedMessages.length}`, updatedMessages)

      // Update state with functional form to prevent stale closures
      setMessages(prev => [...prev, { role: 'user', content: userMessage }])

      // Extract the current session city to lock in location consistency
      const sessionCity = extractSessionCity()
      if (sessionCity) {
        console.log(`📍 Pinning city: ${sessionCity}`)
      }

      // Send FULL conversation history with every request
      // This allows AI to understand context, extract search params,
      // and handle follow-ups like "show me something cheaper"
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages, // FULL history, not just current message
          city: sessionCity, // Lock in the session city to prevent location drift
          context: {
            screen: screen,
            listings: listings.length > 0 ? listings : null,
            booking: bookingDetails || null
          },
          system: undefined
        })
      })

      if (!response.ok) throw new Error('API call failed')
      const data = await response.json()
      const aiResponse = data.content

      // Store assistant response using functional update to prevent stale closures
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])

      return aiResponse
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
      throw err
    }
  }

  const handleUserMessage = async (message) => {
    const response = await callAPI(message)
    processAIResponse(response)
  }

  const processAIResponse = (response) => {
    console.log('AI Response received:', response)

    try {
      // Strip markdown code blocks if present
      let jsonString = response.trim()
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      const parsed = JSON.parse(jsonString)
      console.log('Parsed JSON:', parsed)

      // Speak the response immediately
      if (parsed.spoken) {
        speak(parsed.spoken)
      }

      // Handle action-based responses
      const action = parsed.action

      if (action === 'search' || (parsed.listings && Array.isArray(parsed.listings) && parsed.listings.length > 0)) {
        console.log('✓ Search results found:', parsed.listings)
        setListings(parsed.listings)
        setScreen('results')
      } else if (action === 'select' || parsed.booking) {
        console.log('✓ Booking selected:', parsed.booking)
        setBookingDetails(parsed.booking)
        setScreen('booking')
      } else if (action === 'confirm' || parsed.confirmed) {
        console.log('✓ Booking confirmed:', parsed.ref)
        setConfirmationDetails({
          ref: parsed.ref,
          ...bookingDetails
        })
        setScreen('confirmed')
      } else if (action === 'update') {
        console.log('✓ Booking updated:', parsed.booking)
        setBookingDetails(parsed.booking)
      } else if (action === 'navigate') {
        console.log('✓ Navigating to:', parsed.screen)
        if (parsed.screen === 'results' && listings.length > 0) {
          setScreen('results')
        } else if (parsed.screen === 'idle') {
          setScreen('idle')
        } else if (parsed.screen === 'booking' && bookingDetails) {
          setScreen('booking')
        }
      } else if (action === 'details') {
        console.log('✓ Showing details')
        // Stay on current screen, AI speaks the details
      } else if (action === 'message') {
        console.log('Message response:', parsed.spoken)
        // Already spoken above
      } else if (parsed.message) {
        speak(parsed.message)
      }
    } catch (error) {
      console.error('Failed to parse JSON response:', error)
      console.log('Raw response:', response)
      speak(response)
    }

    setIsLoading(false)
  }

  const speak = async (text) => {
    if (!text) return

    setIsSpeaking(true)

    try {
      // Try ElevenLabs first
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)

        audio.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }

        audio.onerror = () => {
          console.error('Audio playback error, falling back to browser TTS')
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
          speakWithBrowserTTS(text)
        }

        // Add 300ms delay before playing for smoother transition
        setTimeout(() => {
          audio.play().catch((err) => {
            console.error('Audio play error:', err)
            setIsSpeaking(false)
            speakWithBrowserTTS(text)
          })
        }, 300)
      } else {
        // Fallback to browser TTS if API call fails
        console.warn('ElevenLabs API unavailable, using browser TTS')
        speakWithBrowserTTS(text)
      }
    } catch (error) {
      console.error('ElevenLabs error, falling back to browser TTS:', error)
      speakWithBrowserTTS(text)
    }
  }

  // Fallback: Browser built-in speech synthesis
  const speakWithBrowserTTS = (text) => {
    if (!window.speechSynthesis) {
      setIsSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()

    const selectBestVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length === 0) return null

      const preferredVoices = voices.filter(
        (voice) =>
          voice.localService &&
          (voice.name.includes('Natural') ||
            voice.name.includes('Google') ||
            voice.lang === 'en-US')
      )

      if (preferredVoices.length > 0) return preferredVoices[0]

      const enUSVoices = voices.filter((voice) => voice.lang.startsWith('en-US'))
      if (enUSVoices.length > 0) return enUSVoices[0]

      return voices[0]
    }

    const utterance = new SpeechSynthesisUtterance(text)
    const bestVoice = selectBestVoice()

    if (bestVoice) {
      utterance.voice = bestVoice
    }

    utterance.rate = 1.2
    utterance.pitch = 1.0
    utterance.volume = 1.0
    utterance.lang = 'en-US'

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 300)
  }

  const handleSelectListing = async (index) => {
    const listing = listings[index]
    const message = `I want to book ${listing.name}`
    await handleUserMessage(message)
  }

  const handleConfirmBooking = async () => {
    const message = 'Confirm this booking'
    await handleUserMessage(message)
  }

  // Extract search parameters from conversation history
  const getSearchContext = () => {
    // Find the first user message (usually the original search)
    const firstUserMessage = messages.find(msg => msg.role === 'user')
    if (firstUserMessage) {
      return firstUserMessage.content
    }
    return null
  }

  // Extract the most recently mentioned city from conversation history
  const extractSessionCity = () => {
    // Use ref to get current messages (not stale closure)
    const currentMessages = messagesRef.current
    // Scan messages from most recent to oldest to find the latest city
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      const msg = currentMessages[i]
      if (msg.role === 'assistant') {
        try {
          // Parse JSON response to extract location
          let jsonString = msg.content.trim()
          if (jsonString.startsWith('```json')) {
            jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '')
          } else if (jsonString.startsWith('```')) {
            jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '')
          }
          const parsed = JSON.parse(jsonString)

          // Extract city from listings if present
          if (parsed.listings && parsed.listings.length > 0) {
            const location = parsed.listings[0].location
            // Extract city from "Neighborhood, City" format
            if (location && location.includes(',')) {
              const city = location.split(',').pop().trim()
              console.log(`🏙️ Session city extracted: ${city}`)
              return city
            }
          }
        } catch (e) {
          // Continue to next message if parsing fails
        }
      }
    }
    return null
  }

  // Only reset on explicit "New search" action
  const handleNewSearch = () => {
    setScreen('idle')
    setMessages([]) // ONLY place where messages are cleared
    setListings([])
    setSelectedListing(null)
    setBookingDetails(null)
  }

  // Back to results keeps full conversation history
  const handleBackToResults = () => {
    setScreen('results')
    setBookingDetails(null)
    // NOTE: messages array is NOT cleared — full context retained
  }

  // Book another trip — full reset like new search
  const handleBookAnother = () => {
    setScreen('idle')
    setMessages([])
    setListings([])
    setSelectedListing(null)
    setBookingDetails(null)
    setConfirmationDetails(null)
  }

  // Handle floating mic button click
  const handleFloatingMicClick = () => {
    console.log('🎤 Floating mic button clicked', { floatingMicListening })

    if (floatingMicListening) {
      // Stop listening
      console.log('Stopping speech recognition')
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    } else {
      // Start listening
      console.log('Starting speech recognition')
      finalTranscriptRef.current = ''
      transcriptSentRef.current = false
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    }
  }

  return (
    <div className="app-container">
      <div className="phone-frame">
        <div className="status-bar">
          <span className="time" id="time">9:41</span>
          <div className="status-icons">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        <div className="screen-content">
          {screen === 'idle' && (
            <IdleScreen
              messages={messages}
              onMessage={handleUserMessage}
              isLoading={isLoading}
            />
          )}
          {screen === 'results' && (
            <ResultsScreen
              messages={messages}
              listings={listings}
              onSelectListing={handleSelectListing}
              onNewSearch={handleNewSearch}
              onSeeMore={() => handleUserMessage('Show me different options — different neighborhoods or price points')}
              isLoading={isLoading}
              isSpeaking={isSpeaking}
            />
          )}
          {screen === 'booking' && bookingDetails && (
            <BookingScreen
              messages={messages}
              booking={bookingDetails}
              onConfirm={handleConfirmBooking}
              onBack={handleBackToResults}
              isLoading={isLoading}
              isSpeaking={isSpeaking}
            />
          )}
          {screen === 'confirmed' && confirmationDetails && (
            <ConfirmedScreen
              messages={messages}
              confirmation={confirmationDetails}
              isSpeaking={isSpeaking}
              onBookAnother={handleBookAnother}
            />
          )}
        </div>

        {error && (
          <div className="toast">
            {error}
          </div>
        )}

        {/* Floating mic button visible on all screens except idle */}
        {screen !== 'idle' && (
          <FloatingMicButton
            isListening={floatingMicListening}
            onClick={handleFloatingMicClick}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  )
}
