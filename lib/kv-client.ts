'use server'
import { createClient } from '@vercel/kv'

const getClient = async () => {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) {
    throw new Error('Missing required environment variables for kv store')
  }
  return createClient({
    url,
    token,
  })
}

export const increment = async () => {
  try {
    const kv = await getClient()
    await kv.incr('spaceballs')
  } catch (error) {
    console.error(error)
  }
}

export const getCount = async (): Promise<number> => {
  try {
    const kv = await getClient()
    const count = await kv.get('spaceballs')
    return count ? parseInt(String(count)) : 0
  } catch (error) {
    console.error(error)
    return 0
  }
}

export const reset = async () => {
  try {
    const kv = await getClient()
    await kv.set('spaceballs', '0')
  } catch (error) {
    console.error(error)
  }
}
