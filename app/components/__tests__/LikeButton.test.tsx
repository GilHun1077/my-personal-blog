import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LikeButton from '../LikeButton'

function makeFetchMock(getResponse: object, postResponse?: object) {
  return vi.fn((url: string, options?: RequestInit) => {
    const isPost = options?.method === 'POST'
    const body = isPost ? postResponse : getResponse
    return Promise.resolve({
      json: () => Promise.resolve(body),
    } as Response)
  })
}

describe('LikeButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('should show loading state before the GET API responds', () => {
      // fetch never resolves during this test
      vi.stubGlobal(
        'fetch',
        vi.fn(() => new Promise(() => {}))
      )

      render(<LikeButton slug="hello-world" />)

      expect(screen.getByText('...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should display the like count returned by the GET API', async () => {
      vi.stubGlobal('fetch', makeFetchMock({ likes: 42 }))

      render(<LikeButton slug="hello-world" />)

      expect(await screen.findByText('42')).toBeInTheDocument()
    })

    it('should show the 🤍 emoji before the user has liked', async () => {
      vi.stubGlobal('fetch', makeFetchMock({ likes: 5 }))

      render(<LikeButton slug="hello-world" />)

      await screen.findByText('5')
      expect(screen.getByText('🤍')).toBeInTheDocument()
    })

    it('should render the button with the correct initial aria-label', async () => {
      vi.stubGlobal('fetch', makeFetchMock({ likes: 0 }))

      render(<LikeButton slug="hello-world" />)

      await screen.findByText('0')
      expect(screen.getByRole('button', { name: '좋아요' })).toBeInTheDocument()
    })

    it('should call GET /api/likes/{slug} with the correct slug on mount', async () => {
      const fetchMock = makeFetchMock({ likes: 7 })
      vi.stubGlobal('fetch', fetchMock)

      render(<LikeButton slug="my-post" />)

      await screen.findByText('7')
      expect(fetchMock).toHaveBeenCalledWith('/api/likes/my-post')
    })
  })

  describe('interactions', () => {
    it('should call POST /api/likes/{slug} when the button is clicked', async () => {
      const user = userEvent.setup()
      const fetchMock = makeFetchMock({ likes: 3 }, { likes: 4 })
      vi.stubGlobal('fetch', fetchMock)

      render(<LikeButton slug="my-post" />)
      await screen.findByText('3')

      await user.click(screen.getByRole('button', { name: '좋아요' }))

      expect(fetchMock).toHaveBeenCalledWith('/api/likes/my-post', { method: 'POST' })
    })

    it('should update the like count after clicking the button', async () => {
      const user = userEvent.setup()
      vi.stubGlobal('fetch', makeFetchMock({ likes: 10 }, { likes: 11 }))

      render(<LikeButton slug="my-post" />)
      await screen.findByText('10')

      await user.click(screen.getByRole('button'))

      expect(await screen.findByText('11')).toBeInTheDocument()
    })

    it('should show ❤️ after the button is clicked', async () => {
      const user = userEvent.setup()
      vi.stubGlobal('fetch', makeFetchMock({ likes: 1 }, { likes: 2 }))

      render(<LikeButton slug="my-post" />)
      await screen.findByText('1')

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('❤️')).toBeInTheDocument()
      })
    })

    it('should disable the button after clicking', async () => {
      const user = userEvent.setup()
      vi.stubGlobal('fetch', makeFetchMock({ likes: 1 }, { likes: 2 }))

      render(<LikeButton slug="my-post" />)
      await screen.findByText('1')

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeDisabled()
      })
    })

    it('should update the aria-label to reflect the liked state', async () => {
      const user = userEvent.setup()
      vi.stubGlobal('fetch', makeFetchMock({ likes: 1 }, { likes: 2 }))

      render(<LikeButton slug="my-post" />)
      await screen.findByText('1')

      await user.click(screen.getByRole('button', { name: '좋아요' }))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: '이미 좋아요를 눌렀습니다' })
        ).toBeInTheDocument()
      })
    })

    it('should not call POST a second time if the button is clicked while already liked', async () => {
      const user = userEvent.setup()
      const fetchMock = makeFetchMock({ likes: 1 }, { likes: 2 })
      vi.stubGlobal('fetch', fetchMock)

      render(<LikeButton slug="my-post" />)
      await screen.findByText('1')

      await user.click(screen.getByRole('button'))
      await waitFor(() => expect(screen.getByRole('button')).toBeDisabled())

      // Attempt a second click on the now-disabled button
      await user.click(screen.getByRole('button'))

      const postCalls = fetchMock.mock.calls.filter(
        ([, opts]) => (opts as RequestInit | undefined)?.method === 'POST'
      )
      expect(postCalls).toHaveLength(1)
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      // Suppress expected console errors from the catch branch
      vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('should stop showing loading state even when the GET request fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() => Promise.reject(new Error('Network error')))
      )

      render(<LikeButton slug="my-post" />)

      await waitFor(() => {
        expect(screen.queryByText('...')).not.toBeInTheDocument()
      })
    })

    it('should not update the count if the POST request fails', async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ likes: 5 }),
        } as Response)
        .mockRejectedValueOnce(new Error('Network error'))

      vi.stubGlobal('fetch', fetchMock)

      const user = userEvent.setup()
      render(<LikeButton slug="my-post" />)
      await screen.findByText('5')

      await user.click(screen.getByRole('button'))

      // Count should remain unchanged after a failed POST
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })
})
