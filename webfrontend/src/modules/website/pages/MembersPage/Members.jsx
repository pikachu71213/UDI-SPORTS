import React from 'react'
import PageHero from '../../../../shared/components/PageHero'
import MembersData from './MembersData'

const Members = () => {
  return (
    <div>
    <PageHero
      badge="OUR Members"
      heading="MEMBER"
      highlight="DIRECTORY"
      description="Distinguished patrons, ambassadors, dignitaries, and corporate bodies who champion India's grassroots sports revolution."
      bgImage="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=85&fit=crop"
      />
      <MembersData />
    </div>
  )
}

export default Members
