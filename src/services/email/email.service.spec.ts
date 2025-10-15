import { test, expect, beforeEach } from 'vitest'
import { Instance } from './email.service'
import { DIContainer } from '@/di-containers'

let service: Instance

beforeEach(() => {
    service = DIContainer().EmailService()
})

test('Expect to fail on wrong email', async () => {
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