import { test, expect, beforeEach } from 'vitest'
import { Instance } from './email.service'
import { DIContainer } from '@/di-containers'

let service: Instance

beforeEach(() => {
    service = DIContainer()._EmailService()
})

test('Fail on wrong emails', async () => {
    const result = await service.sendEmail({
        content: 'hello',
        from: 'sup',
        subject: 'sup',
        to: 'sup'
    })
    expect(result.success).toBe(false)
    if (result.success) {
        return
    }
    expect(result.error.cause).toBe(null)
    expect(result.error.side).toBe('client')
    expect(result.error.code).toBe('validation')
})

test('Work on valid emails', async () => {
    const result = await service.sendEmail({
        content: 'hello',
        from: 'sup@sup.com',
        subject: 'sup',
        to: 'sup@sup.com'
    })
    expect(result.success).toBe(true)
})