import { defineStore } from 'pinia'
import storage from 'store'
import { fastAuth } from '@/api/auth'
import { getAccountById } from '@/api/user'

export default defineStore('account', {
  state: () =>
    new Proxy(
      {
        account: (storage.get('account') ?? {}) as AccountInterface,
        project: (storage.get('project') ?? {}) as ProjectInterface
      },
      {
        get(state, prop) {
          return state[prop as never]
        },
        set(state, prop, value) {
          state[prop as never] = value as never
          if (value.id) storage.set(prop.toString(), value)
          else storage.remove(prop.toString())
          return true
        }
      }
    ),
  actions: {
    // 登录
    Login(data: { userId: string }) {
      return fastAuth(data).then(({ code, message }: HTTPResponseInterface) => {
        if (code !== 0) throw Error(message)
        return this.GetAccount(data.userId)
      })
    },

    GetAccount(accountId: string) {
      return getAccountById(accountId).then(
        ({ code, data, message }: HTTPResponseInterface<AccountInterface>) => {
          if (code !== 0) throw Error(message)
          this.account = data
        }
      )
    },

    SetProject(project: ProjectInterface) {
      this.project = project
      return Promise.resolve()
    },

    // 清除本地信息
    Clear() {
      this.account = {} as AccountInterface
      this.project = {} as ProjectInterface
      return Promise.resolve()
    }
  }
})
