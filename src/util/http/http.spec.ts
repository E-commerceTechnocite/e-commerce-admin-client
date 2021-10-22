import { http } from './http'
import {
  HttpClientSideException,
  HttpServerSideException,
} from './http-exception'

const mockFetch = (responseData: any, responseStatus = 200) =>
  jest.fn(
    (): Promise<any> =>
      Promise.resolve({
        json: () => Promise.resolve(responseData),
        status: responseStatus,
      })
  )

describe('Http Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Send request', () => {
    it('should send a get request', async function () {
      const response = { message: 'OK' }
      const uri = '/get-resource'
      global.fetch = mockFetch(response, 200)

      const { data, error, response: res } = await http.get(uri)

      expect(res.status).toEqual(200)
      expect(data).toEqual(response)
      expect(error).toEqual(null)
      expect(global.fetch).toHaveBeenCalledWith(uri, { method: 'GET' })
    })

    it('should return a client side error when 400+ status code', async function () {
      const response = ''
      const uri = '/unreachable-resource'
      global.fetch = mockFetch(response, 404)

      const { data, error, response: res } = await http.get(uri)

      expect(res.status).toEqual(404)
      expect(error).toBeInstanceOf(HttpClientSideException)
      expect(data).toEqual(response)

      expect(global.fetch).toHaveBeenCalledWith(uri, { method: 'GET' })
    })

    it('should return a server side error when 500+ status code', async function () {
      const response = ''
      const uri = '/server-go-boom'
      global.fetch = mockFetch(response, 500)

      const { data, error, response: res } = await http.get(uri)

      expect(res.status).toEqual(500)
      expect(error).toBeInstanceOf(HttpServerSideException)
      expect(data).toEqual(response)
      expect(global.fetch).toHaveBeenCalledWith(uri, { method: 'GET' })
    })
  })

  describe('Send request with body', () => {
    it('should parse the body to JSON', async function () {
      const response = { status: 201, message: 'created' }
      const uri = '/post-resource'
      const body = { title: 'hello world' }
      global.fetch = mockFetch(response, 201)

      const { data, error, response: res } = await http.post(uri, body)

      expect(res.status).toEqual(201)
      expect(data).toEqual(response)
      expect(error).toEqual(null)
      expect(global.fetch).toHaveBeenCalledWith(uri, {
        method: 'POST',
        body: JSON.stringify(body),
      })
    })
  })

  describe('Headers', () => {
    it('should be able to send custom headers', async function () {
      const response = ''
      const uri = '/login'
      const body = { username: 'hello', password: 'world' }
      global.fetch = mockFetch(response, 200)

      const headers = { Authorization: 'Bearer 1234' }

      const {
        data,
        error,
        response: res,
      } = await http.post(uri, body, {
        headers,
      })

      expect(res.status).toEqual(200)
      expect(data).toEqual(response)
      expect(error).toEqual(null)
      expect(global.fetch).toHaveBeenCalledWith(uri, {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
      })
    })
  })
})
