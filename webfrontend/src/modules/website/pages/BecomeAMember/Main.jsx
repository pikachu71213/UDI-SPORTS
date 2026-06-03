import React from 'react'
import MembershipForm from './Membershipdetail'
import PageHero from '../../../../shared/components/PageHero'

const Main = () => {
  return (
    <>
     <PageHero
      badge="Join SPORTFORCE"
      heading="Become a"
      highlight="Member"
      description="Choose your membership type and fill in your details to get started with SportForce."
      bgImage="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=85&fit=crop"
      />
  <MembershipForm />
    </>
  )
}

export default Main
