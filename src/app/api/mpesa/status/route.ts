import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const checkoutRequestId = searchParams.get('checkoutRequestId')

  if (!checkoutRequestId) {
    return NextResponse.json({ error: 'Missing checkoutRequestId' }, { status: 400 })
  }

  const supabase = createClient()
  const { data } = await supabase
    .from('mpesa_transactions')
    .select('status, result_desc, mpesa_receipt_number')
    .eq('checkout_request_id', checkoutRequestId)
    .single()

  return NextResponse.json({
    status: data?.status || 'pending',
    receipt: data?.mpesa_receipt_number,
    message: data?.result_desc,
  })
}
