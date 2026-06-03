import React from 'react'
import PageHero from '../../../../shared/components/PageHero'
import ContactForm from './ContactForm'

const ContactUs = () => {
  return (
    <>
       <PageHero
      badge="Reach Out to Us"
      heading="Contact"
      highlight="Us"
      description="We're here to help! Reach out to us for any queries or support."
      bgImage="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=85&fit=crop"
      />
      <ContactForm />
    </>
  )
}

export default ContactUs
