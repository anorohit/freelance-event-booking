import { app, registerPlugins } from './app'
import { connectDB } from './config/db'


// Start server
async function start() {
  try {

    await registerPlugins()
    

    await connectDB()
    

    const port = parseInt(process.env.PORT || '3001')
    await app.listen({ port, host: '0.0.0.0' })
    
    console.log(`🚀 Server is running on port ${port}`)
  } catch (err) {
    console.error('❌ Server startup failed:', err)
    process.exit(1)
  }
}


process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...')
  await app.close()
  process.exit(0)
})


start()