import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const callback = body?.Body?.stkCallback
    if (!callback) return NextResponse.json({ ResultCode: 0, ResultDesc: 'OK' })

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback

    if (ResultCode === 0) {
      const items: any[] = CallbackMetadata?.Item || []
      const get = (name: string) => items.find((i: any) => i.Name === name)?.Value

      const receipt = get('MpesaReceiptNumber')
      const amount = get('Amount')
      const phone = String(get('PhoneNumber') || '')

      // Update transaction
      const { data: txn } = await supabase
        .from('mpesa_transactions')
        .update({ status: 'success', mpesa_receipt_number: receipt, result_code: ResultCode, result_desc: ResultDesc, transaction_date: new Date().toISOString() })
        .eq('checkout_request_id', CheckoutRequestID)
        .select()
        .single()

      if (txn) {
        // Update linked reference
        if (txn.reference_type === 'race_registration') {
          await supabase
            .from('race_registrations')
            .update({ payment_status: 'paid', paid_at: new Date().toISOString(), mpesa_transaction_id: receipt })
            .eq('race_event_id', txn.reference_id)
        }

        if (txn.reference_type === 'repair_booking') {
          await supabase
            .from('repair_bookings')
            .update({ payment_status: 'paid', mpesa_transaction_id: receipt })
            .eq('id', txn.reference_id)
        }

        // Notify user
        if (txn.reference_type) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('phone', phone.replace(/^254/, '0'))
            .maybeSingle()

          if (profile) {
            await supabase.from('notifications').insert({
              user_id: profile.id,
              title: 'Payment confirmed ✓',
              body: `KES ${amount} received — ${txn.account_reference}`,
              type: 'general',
            })
          }
        }
      }
    } else {
      await supabase
        .from('mpesa_transactions')
        .update({ status: 'failed', result_code: ResultCode, result_desc: ResultDesc })
        .eq('checkout_request_id', CheckoutRequestID)
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'OK' })
  }
}
