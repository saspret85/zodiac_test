import Redis from 'ioredis'

const redis = new Redis(
    process.env.REDIS_URL ||
    'redis://localhost:6380'
)

redis.on('connect', () => {
  console.log('Connected to taskflow-redis')
})

redis.on('error', (err) => {
  console.error('Redis Connection Error:', err)
})

export { redis }
