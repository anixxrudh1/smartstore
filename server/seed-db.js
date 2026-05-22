import seedDemo from './utils/seed.js'

seedDemo().then((res) => {
  console.log('Seed result:', res)
  process.exit(0)
}).catch((err) => {
  console.error('Seed failed', err)
  process.exit(1)
})
