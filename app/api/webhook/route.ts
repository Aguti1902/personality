import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
export const dynamic = 'force-dynamic'
import { sendEmail, emailTemplates } from '@/lib/email-service'
import { createOrUpdateUser } from '@/lib/auth'
import { db } from '@/lib/database-postgres'
import { getEmailTranslation } from '@/lib/email-translations'
import { getStripeConfig } from '@/lib/stripe-config'

// Función helper para enviar emails
async function sendEmailToUser(type: string, data: any) {
  try {
    console.log(`📧 Intentando enviar email ${type} a ${data.email}`)
    
    // Determinar qué template usar
    let emailData: any

    switch (type) {
      case 'paymentSuccess':
        if (!data.iq) {
          console.error('❌ iq requerido para paymentSuccess')
          return
        }
        
        // Crear o actualizar usuario y generar contraseña
        try {
          console.log('🔄 Creando/actualizando usuario:', {
            email: data.email,
            userName: data.userName,
            iq: data.iq
          })
          
          const { user, password } = await createOrUpdateUser({
            email: data.email,
            userName: data.userName || 'Usuario',
            iq: data.iq,
            subscriptionStatus: 'trial',
            trialEndDate: data.trialEndDate,
          })
          
          console.log(`👤 Usuario creado/actualizado: ${user.email}`)
          console.log(`🔑 Contraseña generada: ${password}`)
          
          console.log(`📧 Enviando email a: ${data.email}`)
          
          // Enviar email con credenciales de acceso
          const lang = data.lang || 'es'
          const t = (key: any) => getEmailTranslation(lang, key)
          const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://personalityinsight.com'}/${lang}/cuenta`
          emailData = {
            to: data.email,
            subject: t('welcomeSubject'),
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${t('welcome')} Personality Insight</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 40px 20px;">
                      <table role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #113240 0%, #07C59A 100%); padding: 40px 30px; text-align: center;">
                            <img src="https://www.personalityinsight.com/images/MINDMETRIC/Logo_blanco.png" alt="Personality Insight" style="height: 40px; width: auto; margin: 0 auto; display: block;" />
                          </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                          <td style="padding: 40px 30px; text-align: center;">
                            <h2 style="color: #113240; margin: 0 0 20px 0; font-size: 28px; font-weight: 600;">
                              ${t('welcome')} Personality Insight!
                            </h2>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                              ${t('hello')} ${data.userName || t('user')},
                            </p>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                              ${t('congratulations')}
                            </p>
                            
                            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: left;">
                              <h3 style="color: #113240; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                                🎯 ${t('yourIQResult')}: ${data.iq}
                              </h3>
                              <p style="color: #4a5568; font-size: 14px; margin: 0; line-height: 1.6;">
                                ${t('completedTest')}
                              </p>
                            </div>
                            
                            <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: left;">
                              <h3 style="color: #c53030; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                                🔑 ${t('loginCredentials')}
                              </h3>
                              <p style="color: #4a5568; font-size: 14px; margin: 0 0 10px 0; line-height: 1.6;">
                                <strong>Email:</strong> ${data.email}
                              </p>
                              <p style="color: #4a5568; font-size: 14px; margin: 0; line-height: 1.6;">
                                <strong>${t('password')}:</strong> ${password}
                              </p>
                              <p style="color: #e53e3e; font-size: 12px; margin: 10px 0 0 0; line-height: 1.6;">
                                ⚠️ ${t('securityWarning')}
                              </p>
                            </div>
                            
                            <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #113240 0%, #07C59A 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0;">
                              ${t('accessDashboard')}
                            </a>
                            
                            <p style="color: #718096; font-size: 14px; margin: 30px 0 0 0; line-height: 1.6;">
                              ${t('dashboardInfo')}
                            </p>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 12px; margin: 0 0 10px 0;">
                              © ${new Date().getFullYear()} Personality Insight. ${t('allRightsReserved')}
                            </p>
                            <p style="color: #718096; font-size: 12px; margin: 0;">
                              support@personalityinsight.com
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `
          }
        } catch (userError) {
          console.error('❌ Error creando usuario:', userError)
          // Fallback al email original si falla la creación de usuario
          emailData = emailTemplates.paymentSuccess(data.email, data.userName || 'Usuario', data.iq, data.lang || 'es')
        }
        break

      case 'trialStarted':
        if (!data.trialEndDate) {
          console.error('❌ trialEndDate requerido para trialStarted')
          return
        }
        emailData = emailTemplates.trialStarted(data.email, data.userName || 'Usuario', data.trialEndDate, data.lang || 'es')
        break

      case 'trialEndingTomorrow':
        emailData = emailTemplates.trialEndingTomorrow(data.email, data.userName || 'Usuario', data.lang || 'es')
        break

      case 'subscriptionActivated':
        emailData = emailTemplates.subscriptionActivated(data.email, data.userName || 'Usuario', data.lang || 'es')
        break

      case 'monthlyPaymentSuccess':
        if (!data.amount) {
          console.error('❌ amount requerido para monthlyPaymentSuccess')
          return
        }
        emailData = emailTemplates.monthlyPaymentSuccess(data.email, data.userName || 'Usuario', data.amount, data.lang || 'es')
        break

      case 'paymentFailed':
        if (!data.attempt) {
          console.error('❌ attempt requerido para paymentFailed')
          return
        }
        emailData = emailTemplates.paymentFailed(data.email, data.userName || 'Usuario', data.attempt, data.lang || 'es')
        break

      case 'subscriptionCancelled':
        if (!data.accessUntil) {
          console.error('❌ accessUntil requerido para subscriptionCancelled')
          return
        }
        emailData = emailTemplates.subscriptionCancelled(data.email, data.userName || 'Usuario', data.accessUntil, data.lang || 'es')
        break

      default:
        console.error(`❌ Tipo de email no válido: ${type}`)
        return
    }

    // Enviar email
    console.log(`📤 Enviando email ${type} a ${data.email}`)
    const result = await sendEmail(emailData)
    
    if (result.success) {
      console.log(`✅ Email ${type} enviado correctamente a ${data.email}`)
    } else {
      console.error(`❌ Error enviando email ${type}:`, result.error)
    }
  } catch (error) {
    console.error(`❌ Error enviando email ${type}:`, error)
  }
}

// Endpoint para webhooks de Stripe
export async function POST(request: NextRequest) {
  // Obtener configuración de Stripe según el modo actual
  const stripeConfig = await getStripeConfig()
  
  if (!stripeConfig.secretKey) {
    console.error('❌ Stripe no configurado')
    return NextResponse.json({ error: 'Stripe no configurado' }, { status: 500 })
  }

  const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: '2023-10-16',
  })

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('❌ Sin firma de Stripe')
    return NextResponse.json({ error: 'Sin firma' }, { status: 400 })
  }

  try {
    // Verificar webhook signature
    const webhookSecret = stripeConfig.webhookSecret
    
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET no configurado')
      // En desarrollo, podemos permitir webhooks sin verificar (no recomendado en producción)
      console.warn('⚠️ Procesando webhook sin verificación (solo desarrollo)')
    }

    let event: Stripe.Event

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      // Solo para desarrollo - parsear sin verificar
      event = JSON.parse(body)
    }

    console.log('📨 Webhook recibido:', event.type, 'ID:', event.id)

    // Registrar webhook en logs
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://personalityinsight.com'}/api/webhook-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.type,
          eventId: event.id,
          timestamp: new Date().toISOString(),
          data: event.data.object
        })
      })
    } catch (logError) {
      console.error('❌ Error registrando webhook:', logError)
    }

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('✅ PaymentIntent exitoso:', {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          customer: paymentIntent.customer,
          email: paymentIntent.metadata.email,
          userIQ: paymentIntent.metadata.userIQ,
        })
        
        // Enviar email de confirmación de pago
        if (paymentIntent.metadata.email && paymentIntent.metadata.userIQ) {
          await sendEmailToUser('paymentSuccess', {
            email: paymentIntent.metadata.email,
            userName: paymentIntent.metadata.userName || 'Usuario',
            iq: parseInt(paymentIntent.metadata.userIQ),
            lang: paymentIntent.metadata.lang || 'es'
          })
        }
        
        // IMPORTANTE: Guardar el test result inmediatamente después del pago
        // No esperar a que se cree la suscripción
        if (paymentIntent.metadata.email && paymentIntent.metadata.userIQ) {
          try {
            const userEmail = paymentIntent.metadata.email
            const userIQ = parseInt(paymentIntent.metadata.userIQ)
            
            console.log('💾 [PAYMENT_INTENT] Guardando resultado del test para:', userEmail)
            
            // Buscar usuario por email
            const user = await db.getUserByEmail(userEmail)
            if (user) {
              // Crear el resultado del test básico
              const testResult = {
                id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: user.id,
                iq: userIQ,
                correctAnswers: 0, // Se actualizará cuando llegue la suscripción con datos completos
                timeElapsed: 0,
                answers: [],
                categoryScores: {},
                completedAt: new Date().toISOString(),
              }

              // Guardar en la base de datos
              await db.createTestResult(testResult)
              
              // Actualizar IQ del usuario
              await db.updateUser(user.id, {
                iq: userIQ,
              })

              console.log(`✅ [PAYMENT_INTENT] Resultado del test guardado: IQ ${userIQ}`)
            } else {
              console.log('⚠️ [PAYMENT_INTENT] Usuario no encontrado:', userEmail)
            }
          } catch (testError) {
            console.error('❌ [PAYMENT_INTENT] Error guardando resultado del test:', testError)
          }
        }
        
        break

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('✅ Checkout completado:', {
          id: session.id,
          customer: session.customer,
          email: session.customer_email,
          amount: session.amount_total,
        })
        break

      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object as Stripe.Subscription
        console.log('✅ Suscripción creada:', {
          id: subscriptionCreated.id,
          customer: subscriptionCreated.customer,
          status: subscriptionCreated.status,
          trial_end: subscriptionCreated.trial_end,
          current_period_end: subscriptionCreated.current_period_end,
        })
        
        // Obtener email del customer
        let customerEmail: string | undefined = subscriptionCreated.metadata?.email
        if (!customerEmail && typeof subscriptionCreated.customer === 'string') {
          try {
            const customer = await stripe.customers.retrieve(subscriptionCreated.customer)
            if (customer && !customer.deleted && customer.email) {
              customerEmail = customer.email
            }
          } catch (error) {
            console.error('Error obteniendo customer:', error)
          }
        } else if (!customerEmail && typeof subscriptionCreated.customer === 'object' && !subscriptionCreated.customer.deleted && subscriptionCreated.customer.email) {
          customerEmail = subscriptionCreated.customer.email
        }
        
        // No enviar email de bienvenida al trial aquí
        // El email principal con credenciales se envía en payment_intent.succeeded
        
        // Guardar resultado del test en el historial del usuario
        if (customerEmail) {
          try {
            console.log('💾 Guardando resultado del test para:', customerEmail)
            
            // Obtener datos del test desde los metadata de la suscripción
            let testAnswers = []
            let testTimeElapsed = 0
            let testCorrectAnswers = 0
            let testCategoryScores = {}
            let userIQ = 0
            
            const subMetadata = subscriptionCreated.metadata
            try {
              testAnswers = subMetadata.testAnswers ? JSON.parse(subMetadata.testAnswers) : []
              testTimeElapsed = parseInt(subMetadata.testTimeElapsed || '0')
              testCorrectAnswers = parseInt(subMetadata.testCorrectAnswers || '0')
              testCategoryScores = subMetadata.testCategoryScores ? JSON.parse(subMetadata.testCategoryScores) : {}
              userIQ = parseInt(subMetadata.userIQ || '0')
            } catch (parseError) {
              console.error('❌ Error parseando datos del test:', parseError)
            }

            // Buscar usuario por email
            const user = await db.getUserByEmail(customerEmail)
            if (user && userIQ > 0) {
              console.log('📊 [SUBSCRIPTION] Datos del test:', {
                answers: testAnswers.length,
                correctAnswers: testCorrectAnswers,
                timeElapsed: testTimeElapsed,
                categoryScores: Object.keys(testCategoryScores).length
              })
              
              // Si tenemos datos completos del test, crear/actualizar el resultado
              if (testAnswers.length > 0 || testCorrectAnswers > 0) {
                // Verificar si ya existe un test result reciente (creado en payment_intent.succeeded)
                const existingTests = await db.getTestResultsByUserId(user.id)
                const recentTest = existingTests.find(test => {
                  const testTime = new Date(test.completedAt).getTime()
                  const now = Date.now()
                  return (now - testTime) < 60000 // Menos de 1 minuto
                })

                if (recentTest && recentTest.correctAnswers === 0) {
                  console.log('🔄 [SUBSCRIPTION] Actualizando test existente con datos completos')
                  // Aquí deberíamos actualizar, pero db.updateTestResult no existe
                  // Entonces solo registramos
                  console.log('✅ [SUBSCRIPTION] Test ya guardado previamente, con IQ:', userIQ)
                } else {
                  // Crear nuevo resultado con datos completos
                  const testResult = {
                    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    userId: user.id,
                    iq: userIQ,
                    correctAnswers: testCorrectAnswers,
                    timeElapsed: testTimeElapsed,
                    answers: testAnswers,
                    categoryScores: testCategoryScores,
                    completedAt: new Date().toISOString(),
                  }

                  // Guardar en la base de datos
                  await db.createTestResult(testResult)
                  
                  console.log(`✅ [SUBSCRIPTION] Resultado del test guardado con datos completos: IQ ${userIQ}, ${testCorrectAnswers} correctas`)
                }
              } else {
                console.log('⚠️ [SUBSCRIPTION] No hay datos completos del test, se usa el guardado previamente')
              }
              
              // Actualizar IQ del usuario siempre
              await db.updateUser(user.id, {
                iq: userIQ,
              })
            } else {
              console.log('⚠️ Usuario no encontrado o IQ no válido:', { customerEmail, userIQ })
            }
          } catch (testError) {
            console.error('❌ Error guardando resultado del test:', testError)
          }
        }
        
        break

      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription
        console.log('🔄 Suscripción actualizada:', {
          id: subscriptionUpdated.id,
          customer: subscriptionUpdated.customer,
          status: subscriptionUpdated.status,
          cancel_at_period_end: subscriptionUpdated.cancel_at_period_end,
        })
        
        // Si la suscripción se marcó para cancelar al final del periodo
        if (subscriptionUpdated.cancel_at_period_end) {
          console.log('📧 Suscripción marcada para cancelar - enviando email de confirmación')
          
          // Obtener email del customer
          let updatedCustomerEmail: string | undefined = subscriptionUpdated.metadata?.email
          if (!updatedCustomerEmail && typeof subscriptionUpdated.customer === 'string') {
            try {
              const customer = await stripe.customers.retrieve(subscriptionUpdated.customer)
              if (customer && !customer.deleted && customer.email) {
                updatedCustomerEmail = customer.email
              }
            } catch (error) {
              console.error('Error obteniendo customer:', error)
            }
          } else if (!updatedCustomerEmail && typeof subscriptionUpdated.customer === 'object' && !subscriptionUpdated.customer.deleted && subscriptionUpdated.customer.email) {
            updatedCustomerEmail = subscriptionUpdated.customer.email
          }
          
          // Enviar email de confirmación de cancelación programada
          if (updatedCustomerEmail) {
            const accessUntil = subscriptionUpdated.current_period_end
              ? new Date(subscriptionUpdated.current_period_end * 1000).toLocaleDateString('es-ES')
              : new Date().toLocaleDateString('es-ES')
            
            await sendEmailToUser('subscriptionCancelled', {
              email: updatedCustomerEmail,
              userName: subscriptionUpdated.metadata?.userName || 'Usuario',
              accessUntil,
              lang: subscriptionUpdated.metadata?.lang || 'es'
            })
          }
        }
        
        break

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object as Stripe.Subscription
        console.log('❌ Suscripción cancelada:', {
          id: subscriptionDeleted.id,
          customer: subscriptionDeleted.customer,
          status: subscriptionDeleted.status,
        })
        
        // Obtener email del customer
        let deletedCustomerEmail: string | undefined = subscriptionDeleted.metadata?.email
        if (!deletedCustomerEmail && typeof subscriptionDeleted.customer === 'string') {
          try {
            const customer = await stripe.customers.retrieve(subscriptionDeleted.customer)
            if (customer && !customer.deleted && customer.email) {
              deletedCustomerEmail = customer.email
            }
          } catch (error) {
            console.error('Error obteniendo customer:', error)
          }
        } else if (!deletedCustomerEmail && typeof subscriptionDeleted.customer === 'object' && !subscriptionDeleted.customer.deleted && subscriptionDeleted.customer.email) {
          deletedCustomerEmail = subscriptionDeleted.customer.email
        }
        
        // Enviar email de confirmación de cancelación
        if (deletedCustomerEmail) {
          const accessUntil = subscriptionDeleted.current_period_end
            ? new Date(subscriptionDeleted.current_period_end * 1000).toLocaleDateString('es-ES')
            : new Date().toLocaleDateString('es-ES')
          
          await sendEmailToUser('subscriptionCancelled', {
            email: deletedCustomerEmail,
            userName: subscriptionDeleted.metadata?.userName || 'Usuario',
            accessUntil,
            lang: subscriptionDeleted.metadata?.lang || 'es'
          })
        }
        
        break

      // Eliminado: customer.subscription.trial_will_end
      // Este webhook se dispara inmediatamente después de crear la suscripción
      // En su lugar, usaremos un sistema programado para enviar el email 1 día antes

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        console.log('✅ Pago de factura exitoso:', {
          id: invoice.id,
          customer: invoice.customer,
          subscription: invoice.subscription,
          amount: invoice.amount_paid,
        })
        
        // Enviar email de confirmación de pago mensual
        if (invoice.customer_email) {
          const amount = (invoice.amount_paid / 100).toFixed(2)
          
          // Solo enviar email si es un pago de suscripción (no el pago inicial)
          if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
            await sendEmailToUser('monthlyPaymentSuccess', {
              email: invoice.customer_email,
              userName: invoice.metadata?.userName || 'Usuario',
              amount: parseFloat(amount),
              lang: invoice.metadata?.lang || 'es'
            })
          } else if (invoice.subscription && invoice.billing_reason === 'subscription_create') {
            // Primer pago de suscripción - enviar email de activación
            await sendEmailToUser('subscriptionActivated', {
              email: invoice.customer_email,
              userName: invoice.metadata?.userName || 'Usuario',
              lang: invoice.metadata?.lang || 'es'
            })
          }
        }
        
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice
        console.log('❌ Pago de factura fallido:', {
          id: failedInvoice.id,
          customer: failedInvoice.customer,
          subscription: failedInvoice.subscription,
          amount: failedInvoice.amount_due,
        })
        
        // Notificar al usuario del pago fallido
        if (failedInvoice.customer_email) {
          const attempt = failedInvoice.attempt_count || 1
          
          await sendEmailToUser('paymentFailed', {
            email: failedInvoice.customer_email,
            userName: failedInvoice.metadata?.userName || 'Usuario',
            attempt,
            lang: failedInvoice.metadata?.lang || 'es'
          })
        }
        
        break

      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('❌ Error en webhook:', error.message)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

