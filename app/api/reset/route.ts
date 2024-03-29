import { NextRequest, NextResponse } from 'next/server'
import { getCount, reset } from '@/lib/kv-client'

export async function POST(request: NextRequest) {
  let resJson: { count?: number; error?: any; status?: number } = {}
  try {
    await reset()
    resJson = { count: await getCount() }
  } catch (error) {
    console.log(error)
    resJson = { error: error, status: 500 }
  }
  return NextResponse.json(resJson, {
    status: resJson.status || 200,
  })
}
