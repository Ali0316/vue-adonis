import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      // console.log(email, password)

      const user = await User.verifyCredentials(email, password)
      if (!user) {
        return response.unauthorized({ error: 'Invalid credentials' })
      }
      const token = await User.accessTokens.create(user)
      return token
    } catch (error) {
      return response.internalServerError({ error: 'Something went wrong' })
    }
  }

  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      // console.log(payload)

      const user = await User.create(payload)
      if (!user) {
        return response.badRequest({ error: 'Something went wrong' })
      }

      return response.created({ message: 'User created successfully' })
    } catch (error) {
      console.log(error)
      return response.internalServerError(error)
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      // console.log('user', user)
      const token = auth.user?.currentAccessToken.identifier
      // console.log('token', token)
      if (!token) {
        return response.badRequest({ message: 'Token not found' })
      }
      await User.accessTokens.delete(user, token)
      response.ok('User logged out successfully.')
    } catch (error) {
      console.log(error)
      return response.internalServerError(error)
    }
  }
}
