import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/udiisa'

async function main() {
  await mongoose.connect(uri)
  const emails = [
    'info@udisports.in',
    'gaurav@ccoffice.in',
    'arya7sanjeev@gmail.com',
    'cloudsec.aryan@gmail.com',
    'udiinternationalsports@gmail.com',
  ]
  const plainPassword = 'Admin@123'
  const hash = await bcrypt.hash(plainPassword, 10)

  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase()
    let admin = await Admin.findOne({ email })
    if (admin) {
      if (!admin.name) admin.name = 'Admin'
      // Keep existing password if already set for this account.
      if (!admin.password) admin.password = hash
      await admin.save()
      console.log('Admin exists:', email)
    } else {
      admin = await Admin.create({ email, password: hash, name: 'Admin' })
      console.log('Admin created:', email, '/', plainPassword)
    }
  }
  process.exit(0)
}

main().catch((e) => {
  console.error('Seed admin failed:', e)
  process.exit(1)
})
