export default function BookingScreen({ booking, onConfirm, onBack, isLoading, isSpeaking }) {
  return (
    <div className="booking-screen">
      <div className="booking-header">
        <button className="back-btn" onClick={onBack}>← Back to results</button>
        <h2>Confirm booking</h2>
        <p className="subtitle">{booking.name} · {booking.location}</p>
      </div>

      <div className="booking-summary">
        <div className="summary-row">
          <span>Property</span>
          <span className="summary-value">{booking.name}</span>
        </div>
        <div className="summary-row">
          <span>Location</span>
          <span className="summary-value">{booking.location}</span>
        </div>
        <div className="summary-row">
          <span>Check-in</span>
          <span className="summary-value">{booking.checkin}</span>
        </div>
        <div className="summary-row">
          <span>Check-out</span>
          <span className="summary-value">{booking.checkout}</span>
        </div>
        <div className="summary-row">
          <span>Guests</span>
          <span className="summary-value">{booking.guests}</span>
        </div>
        <div className="summary-row">
          <span>Price per night</span>
          <span className="summary-value">${booking.price}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span className="summary-value total-price">${booking.total}</span>
        </div>
      </div>

      <div className="booking-actions">
        <button
          className="confirm-btn"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Confirm booking'}
        </button>
        <button
          className="change-btn"
          onClick={onBack}
          disabled={isLoading}
        >
          Change something
        </button>
      </div>
    </div>
  )
}
