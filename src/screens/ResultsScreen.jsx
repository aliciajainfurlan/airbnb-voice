import { useState, useEffect } from 'react'
import { getHotelImage } from '../utils/hotelImages'

export default function ResultsScreen({ listings, onSelectListing, onNewSearch, onSeeMore, isLoading, isSpeaking }) {
  const [seeMoreCount, setSeeMoreCount] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [failedImages, setFailedImages] = useState(new Set())

  // Debug: Log when listings are received
  useEffect(() => {
    console.log('ResultsScreen received listings:', listings)
    console.log('Number of listings:', listings ? listings.length : 0)
    setFailedImages(new Set()) // Reset failed images when listings change
  }, [listings])

  const handleImageError = (index) => {
    setFailedImages(prev => new Set([...prev, index]))
  }

  const handleSeeMore = () => {
    if (seeMoreCount >= 1) return
    setSeeMoreCount(seeMoreCount + 1)
    onSeeMore()
  }

  const handleSelectListing = (index) => {
    setSelectedIndex(index)
    onSelectListing(index)
  }

  return (
    <div className="results-screen">
      <div className="results-header">
        <button className="back-btn" onClick={onNewSearch}>← New search</button>
        <h2>Found {listings.length} options for you</h2>
        <p className="subtitle">All include fast WiFi & dedicated workspace</p>
        <p className="disclaimer">Results powered by Airbnb inventory</p>
      </div>

      {isSpeaking && (
        <div className="speaking-indicator">
          <div className="waveform-small">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <span>Reading results aloud...</span>
        </div>
      )}

      <div className="listings-container">
        {listings.map((listing, i) => {
          const imageUrl = getHotelImage(listing.name, i)
          const imageLoaded = !failedImages.has(i)
          console.log(`Card ${i + 1}: ${listing.name} → ${imageUrl}`)

          return (
            <div
              key={i}
              className={`listing-card ${selectedIndex === i ? 'selected' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="card-image">
                {imageLoaded ? (
                  <img
                    src={imageUrl}
                    alt={listing.name}
                    onError={(e) => {
                      handleImageError(i)
                      e.target.style.display = 'none'
                      e.target.parentElement.style.background = 'rgba(255,255,255,0.05)'
                      e.target.parentElement.style.minHeight = '140px'
                    }}
                    style={{
                      height: '140px',
                      width: '100%',
                      objectFit: 'cover',
                      borderRadius: '16px 16px 0 0'
                    }}
                  />
                ) : (
                  <div className="image-placeholder"></div>
                )}
              </div>

              <div className="card-header">
                <div className="listing-number">{i + 1}</div>
                <div className="listing-info">
                  <h3>{listing.name}</h3>
                  <p className="location">{listing.location}</p>
                </div>
                <div className="price">${listing.price}<span>/night</span></div>
              </div>

            <div className="tags">
              <span className="tag tag-wifi">⚡ Fast WiFi</span>
              <span className="tag tag-workspace">💼 Workspace</span>
              <span className="tag tag-cancel">{listing.cancel}</span>
              <span className="tag tag-rating">★ {listing.rating}</span>
              {listing.extras && <span className="tag tag-extras">{listing.extras}</span>}
            </div>

            <button
              className="select-btn"
              onClick={() => handleSelectListing(i)}
              disabled={isLoading}
            >
              Select this option
            </button>
          </div>
          )
        })}
      </div>

      <button
        className="see-more-btn"
        onClick={handleSeeMore}
        disabled={isLoading || seeMoreCount >= 2}
      >
        {isLoading ? 'Finding alternatives...' : seeMoreCount >= 2 ? 'Adjust your dates or budget to see more options.' : '+ See more options'}
      </button>
    </div>
  )
}
