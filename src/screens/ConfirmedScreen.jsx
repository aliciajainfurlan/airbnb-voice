import { useState } from 'react'

export default function ConfirmedScreen({ confirmation, isSpeaking, onBookAnother }) {
  const [calendarAdded, setCalendarAdded] = useState(false)

  const handleAddCalendar = () => {
    setCalendarAdded(true)
  }

  return (
    <div className="confirmed-screen">
      <button className="back-btn" onClick={onBookAnother}>← Book another trip</button>

      <div className="checkmark-circle">✓</div>

      <h2 className="confirmed-title">You're booked!</h2>
      <p className="confirmed-subtitle">Accommodation confirmed. Details sent to your work email.</p>

      <div className="booking-ref-block">
        <p className="ref-label">BOOKING REFERENCE</p>
        <p className="ref-code">{confirmation.ref}</p>
      </div>

      <div className="trip-details-card">
        <div className="detail-row">
          <span className="detail-label">{confirmation.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-value">{confirmation.location}</span>
        </div>
        <div className="detail-row">
          <span>{confirmation.checkin} → {confirmation.checkout}</span>
        </div>
        <div className="detail-row total">
          <span className="detail-label">Total paid</span>
          <span className="detail-value total-price">${confirmation.total}</span>
        </div>
      </div>

      <button
        className={`calendar-btn ${calendarAdded ? 'added' : ''}`}
        onClick={handleAddCalendar}
        disabled={calendarAdded}
      >
        {calendarAdded ? '✓ Added to calendar' : '+ Add to calendar'}
      </button>

      <p className="confirmation-note">Confirmation sent to your work email</p>
    </div>
  )
}
