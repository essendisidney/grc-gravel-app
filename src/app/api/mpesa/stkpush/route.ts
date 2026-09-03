import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { initiateStkPush } from '@/lib/mpesa/stkpush'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { phone, amount, accountReference, transactionDesc, referenceType, referenceId, categoryId } = body

    if (!phone || !amount) {
      return NextResponse.json({ error: 'Missing phone or amount' }, { status: 400 })
    }

    const { merchantRequestId, checkoutRequestId } = await initiateStkPush({
      phone, amount, accountReference, transactionDesc,
    })

    // Log transaction
    await supabase.from('mpesa_transactions').insert({
      merchant_request_id: merchantRequestId,
      checkout_request_id: checkoutRequestId,
      amount,
      phone_number: phone,
      account_reference: accountReference,
      reference_type: referenceType,
      reference_id: referenceId,
      status: 'pending',
    })

    // Pre-create race registration if applicable
    if (referenceType === 'race_registration' && referenceId && categoryId) {
      const cat = body.categories?.find((c: any) => c.id === categoryId)
      await supabase.from('race_registrations').upsert({
        race_event_id: referenceId,
        user_id: user.id,
        category_id: categoryId,
        fee_kes: amount,
        payment_status: 'pending',
        status: 'registered',
      }, { onConflict: 'race_event_id,user_id' })
    }

    return NextResponse.json({ checkoutRequestId, merchantRequestId })
  } catch (error: any) {
    console.error('STK Push error:', error)
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 })
  }
}
