import React, { useState, useEffect } from 'react'
import PageHero from '../../../../shared/components/PageHero'
import TalentedPlayersCards from './TalentedPlayersCards'
import { getPublicPlayers } from '../../../../shared/services/publicApi'

const TalentedPlayers = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicPlayers()
      .then((data) => setPlayers(Array.isArray(data) ? data : []))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
        <PageHero
            badge="Rising Stars"
            heading="Talented"
            highlight="Players"
            description="Meet the Players we proudly support and Celebrate their achievements"
            bgImage="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=85&fit=crop"
            />
            {loading ? (
              <div className="min-h-[40vh] flex items-center justify-center text-slate-500 font-medium">Loading…</div>
            ) : (
            <TalentedPlayersCards players={players} />
            )}
    </>
  )
}

export default TalentedPlayers
