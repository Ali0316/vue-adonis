import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const CsvsController = () => import('#controllers/csvs_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('/auth/login', [AuthController, 'login'])
    router.post('/auth/register', [AuthController, 'register'])
    router.post('auth/logout', [AuthController, 'logout']).use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api')

router
  .group(() => {
    router.post('/csv/upload', [CsvsController, 'create'])
    router.get('/csv/download', [CsvsController, 'download'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
