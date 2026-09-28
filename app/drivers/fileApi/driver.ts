import { Readable } from 'node:stream'
import { type DriveFile, type DriveDirectory } from 'flydrive'
import type {
  WriteOptions,
  DriverContract,
  ObjectMetaData,
  ObjectVisibility,
  SignedURLOptions,
} from 'flydrive/types'
import { type FileApiDriverOptions } from './type.ts'
// import { type ServiceConfigProvider } from '@adonisjs/drive/types'

interface LoginResponse {
  token: string
  [key: string]: any // Allows for extra properties in the response payload
}

function createAuthFetch(endpoint: string, username: string, password: string) {
  let cachedToken: string | null = null

  async function login(): Promise<string> {
    console.debug('Logging in to retrieve new JWT token...')
    const response = await fetch(`${endpoint}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: username,
        password,
      }),
    })

    if (!response.ok) {
      throw new Error(`Auto-login failed with status: ${response.status}`)
    }

    const data = (await response.json()) as LoginResponse
    cachedToken = data.token
    return cachedToken
  }

  // Return an extended fetch function matching the global fetch signature
  return async function authFetch(
    input: string | URL | Request,
    init: RequestInit = {}
  ): Promise<Response> {
    if (!cachedToken) {
      await login()
    }

    // Ensure headers are handled safely as a Headers object, array, or plain record
    const isFormDataBody = typeof FormData !== 'undefined' && init.body instanceof FormData
    init.headers = init.headers || {}

    if (init.headers instanceof Headers) {
      init.headers.set('Authorization', `Bearer ${cachedToken}`)
      if (init.headers.get('Content-Type') === 'multipart/form-data') {
        init.headers.delete('Content-Type')
      } else if (!isFormDataBody && !init.headers.has('Content-Type')) {
        init.headers.set('Content-Type', 'application/json')
      }
    } else if (Array.isArray(init.headers)) {
      const multipartIndex = init.headers.findIndex(
        ([key, value]) =>
          key.toLowerCase() === 'content-type' &&
          String(value).toLowerCase() === 'multipart/form-data'
      )
      init.headers.push(['Authorization', `Bearer ${cachedToken}`])
      if (multipartIndex >= 0) {
        init.headers.splice(multipartIndex, 1)
      } else if (
        !isFormDataBody &&
        !init.headers.some(([key]) => key.toLowerCase() === 'content-type')
      ) {
        init.headers.push(['Content-Type', 'application/json'])
      }
    } else {
      const headers = { ...init.headers }
      if (headers['Content-Type'] === 'multipart/form-data') {
        delete headers['Content-Type']
      }
      init.headers = {
        ...headers,
        Authorization: `Bearer ${cachedToken}`,
      }
      if (
        !isFormDataBody &&
        !Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')
      ) {
        init.headers['Content-Type'] = 'application/json'
      }
    }

    let response = await fetch(input, init)

    // console.log(response.status)
    if (response.status === 401) {
      console.debug('Token expired or invalid, re-authenticating...')
      await login()

      // Re-apply the fresh token to the headers
      if (init.headers instanceof Headers) {
        init.headers.set('Authorization', `Bearer ${cachedToken}`)
      } else if (Array.isArray(init.headers)) {
        init.headers.push(['Authorization', `Bearer ${cachedToken}`])
      } else {
        ;(init.headers as Record<string, string>)['Authorization'] = `Bearer ${cachedToken}`
      }

      response = await fetch(input, init)
    }

    return response
  }
}

export class FileApiDriver implements DriverContract {
  #fileBaseUrl
  #authFetch

  constructor(public options: FileApiDriverOptions) {
    this.#fileBaseUrl = `${this.options.endpoint}/files/${this.options.bucket}`
    this.#authFetch = createAuthFetch(
      this.options.endpoint,
      this.options.client_id,
      this.options.client_secret
    )
  }

  async exists(key: string): Promise<boolean> {
    try {
      const response = await this.#authFetch(`${this.#fileBaseUrl}/${key}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })

      return response.status === 200
    } catch (error) {
      console.error(error)
    }
    return false
  }

  async get(key: string): Promise<string> {
    try {
      const response = await this.#authFetch(`${this.#fileBaseUrl}/${key}/bytes`)
      const buf = await response.arrayBuffer()
      const text = Buffer.from(buf).toString('utf-8')

      return text
    } catch (error) {
      console.error(error)
    }
    return ''
  }

  async getStream(key: string): Promise<Readable> {
    try {
      const response = await this.#authFetch(`${this.#fileBaseUrl}/${key}/download`)
      if (!response.ok) {
        return Promise.reject()
      }

      const nodeStream = Readable.fromWeb(response.body!)
      return Promise.resolve(nodeStream)
    } catch (error) {
      console.error(error)
    }
    return Promise.reject()
  }

  async getBytes(key: string): Promise<Uint8Array> {
    try {
      const response = await this.#authFetch(`${this.#fileBaseUrl}/${key}/bytes`)
      if (!response.ok) {
        return Promise.reject()
      }

      const buffer = await response.arrayBuffer()
      return Promise.resolve(new Uint8Array(buffer))
    } catch (error) {
      console.error(error)
    }
    return Promise.reject()
  }

  async getMetaData(key: string): Promise<ObjectMetaData> {
    try {
      const response = await this.#authFetch(`${this.#fileBaseUrl}/${key}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
      if (!response.ok) {
        return Promise.reject()
      }

      const data = (await response.json()) as any
      return {
        contentType: data.content_type,
        contentLength: data.file_size,
        etag: data.etag,
        lastModified: data.created_at,
      }
    } catch (error) {
      console.error(error)
    }
    return Promise.reject()
  }

  async getVisibility(_: string): Promise<ObjectVisibility> {
    return this.options.visibility
  }

  async #getFileUrl(key: string): Promise<string> {
    try {
      const response = await this.#authFetch(`${this.#fileBaseUrl}/${key}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
      if (!response.ok) {
        return Promise.reject()
      }

      const data = (await response.json()) as any

      const generateURL = this.options.urlBuilder?.generateURL
      if (generateURL) {
        return Promise.resolve(data.file_stream_url)
      }
    } catch (error) {
      console.error(error)
    }
    return Promise.reject()
  }

  async getUrl(key: string): Promise<string> {
    try {
      const generateURL = this.options.urlBuilder?.generateURL
      if (generateURL) {
        const url = await this.#getFileUrl(key)
        return generateURL(key, url)
      }
    } catch (error) {
      console.error(error)
    }
    return Promise.reject()
  }

  async getSignedUrl(key: string, options?: SignedURLOptions): Promise<string> {
    try {
      const generateSignedURL = this.options.urlBuilder?.generateSignedURL
      if (generateSignedURL) {
        const normalizedOptions = Object.assign(
          {
            expiresIn: '30 mins',
          },
          options
        )
        const url = await this.#getFileUrl(key)
        return generateSignedURL(key, url, normalizedOptions)
      }
    } catch (error) {
      console.error(error)
    }
    return Promise.reject()
  }

  async getSignedUploadUrl(_: string, __: SignedURLOptions): Promise<string> {
    return ''
  }
  async setVisibility(_: string, __: ObjectVisibility): Promise<void> {}

  async put(key: string, contents: string | Uint8Array, _options?: WriteOptions): Promise<void> {
    try {
      const formData = new FormData()
      formData.append('file', contents, key)
      formData.append('file_name', key)
      const response = await this.#authFetch(`${this.#fileBaseUrl}/${key}`, {
        method: 'PUT',
        body: formData,
      })
      if (!response.ok) {
        return Promise.reject()
      }

      const data = (await response.json()) as any
      const generateURL = this.options.urlBuilder?.generateURL

      if (generateURL) {
        return Promise.resolve(data.file_stream_url)
      } else {
        return Promise.resolve()
      }
    } catch (error) {
      console.error(error)
    }
    return Promise.reject()
  }

  async putStream(key: string, contents: Readable, _options?: WriteOptions): Promise<void> {
    // try {

    // const blob = await new Response(contents).blob()
    const chunks = []

    for await (const chunk of contents) {
      chunks.push(chunk)
    }
    const blob = new Blob(chunks, { type: _options?.contentType })

    const formData = new FormData()
    formData.append('file', blob, key)
    formData.append('file_name', key)

    const response = await this.#authFetch(`${this.#fileBaseUrl}/${key}`, {
      method: 'PUT',
      body: formData,
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
    })
    if (!response.ok) {
      return Promise.reject()
    }

    const data = (await response.json()) as any

    const generateURL = this.options.urlBuilder?.generateURL

    if (generateURL) {
      return Promise.resolve(data.file_stream_url)
    } else {
      return Promise.resolve()
    }
    // } catch (error) {
    //   console.error(error)
    // }
    // return Promise.reject()
  }

  copy(_source: string, _destination: string, _options?: WriteOptions): Promise<void> {
    throw new Error('Method not implemented.')
  }
  move(_source: string, _destination: string, _options?: WriteOptions): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(key: string): Promise<void> {
    try {
      const response = await this.#authFetch(`${this.#fileBaseUrl}/${key}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
      if (!response.ok) {
        return Promise.reject()
      }

      return Promise.resolve()
    } catch (error) {
      console.error(error)
    }
    return Promise.reject()
  }

  deleteAll(_prefix: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  listAll(
    _prefix: string,
    _options?: { recursive?: boolean; paginationToken?: string }
  ): Promise<{ paginationToken?: string; objects: Iterable<DriveFile | DriveDirectory> }> {
    throw new Error('Method not implemented.')
  }
  bucket(_bucket: string): DriverContract {
    throw new Error('Method not implemented.')
  }
}

export const servicesExtended = {
  fileApi: (config: FileApiDriverOptions) => ({
    type: 'provider',
    async resolver() {
      return () => new FileApiDriver(config)
    },
  }),
}
