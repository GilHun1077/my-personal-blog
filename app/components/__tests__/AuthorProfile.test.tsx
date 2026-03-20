import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AuthorProfile from '../AuthorProfile'

const baseAuthor = {
  name: 'Jane Doe',
  bio: 'A software engineer who loves writing.',
  avatarUrl: 'https://example.com/avatar.jpg',
}

describe('AuthorProfile', () => {
  describe('rendering', () => {
    it('should render the author name correctly', () => {
      render(<AuthorProfile author={baseAuthor} />)
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    })

    it('should render the author bio correctly', () => {
      render(<AuthorProfile author={baseAuthor} />)
      expect(
        screen.getByText('A software engineer who loves writing.')
      ).toBeInTheDocument()
    })

    it('should render the avatar image with the correct src', () => {
      render(<AuthorProfile author={baseAuthor} />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })

    it('should render the avatar image with the author name as alt text', () => {
      render(<AuthorProfile author={baseAuthor} />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('alt', 'Jane Doe')
    })

    it('should not append any extra text to the author name', () => {
      render(<AuthorProfile author={baseAuthor} />)
      const nameEl = screen.getByText('Jane Doe')
      expect(nameEl.textContent).toBe('Jane Doe')
    })
  })

  describe('different author data', () => {
    it('should render a different author name correctly', () => {
      render(<AuthorProfile author={{ ...baseAuthor, name: 'John Smith' }} />)
      expect(screen.getByText('John Smith')).toBeInTheDocument()
    })

    it('should render a different bio correctly', () => {
      render(<AuthorProfile author={{ ...baseAuthor, bio: 'Loves open source.' }} />)
      expect(screen.getByText('Loves open source.')).toBeInTheDocument()
    })

    it('should update the avatar src when a different URL is provided', () => {
      render(
        <AuthorProfile
          author={{ ...baseAuthor, avatarUrl: 'https://example.com/other.png' }}
        />
      )
      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        'https://example.com/other.png'
      )
    })
  })

  describe('snapshot', () => {
    it('should match the snapshot', () => {
      const { container } = render(<AuthorProfile author={baseAuthor} />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
