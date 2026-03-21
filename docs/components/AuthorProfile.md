# AuthorProfile

> Displays an author's avatar, name, and biography below a blog post.

## Overview

`AuthorProfile` renders a compact author card intended to appear at the bottom of a blog post. It shows a circular avatar image alongside the author's display name and a short bio. The component supports both light and dark mode out of the box via Tailwind CSS utility classes, and includes a top border that visually separates it from the post content above.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `author` | `Author` | ✅ | — | An object containing the author's display name, biography, and avatar image URL. See the `Author` type definition below. |

### `Author` Type

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ✅ | The author's display name. Also used as the `alt` text for the avatar image. |
| `bio` | `string` | ✅ | A short biography or description of the author. |
| `avatarUrl` | `string` | ✅ | A fully-qualified URL (or relative path) to the author's avatar image. |

## Usage

### Basic Example

```tsx
import AuthorProfile from '@/app/components/AuthorProfile'

const author = {
  name: 'Jane Doe',
  bio: 'Frontend engineer and occasional writer. Passionate about design systems.',
  avatarUrl: 'https://example.com/avatars/jane.jpg',
}

export default function BlogPostPage() {
  return (
    <article>
      {/* ...post content... */}
      <AuthorProfile author={author} />
    </article>
  )
}
```

### Advanced Example

```tsx
import AuthorProfile from '@/app/components/AuthorProfile'

// Author data fetched from a CMS or API
async function getAuthor(slug: string) {
  const res = await fetch(`/api/authors/${slug}`)
  return res.json()
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const author = await getAuthor('jane-doe')

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <article>
        <h1>My Blog Post Title</h1>
        <p>Post content goes here...</p>
      </article>

      {/* AuthorProfile appears below the post, separated by a border */}
      <AuthorProfile author={author} />
    </main>
  )
}
```

## Notes

- **Styling**: The component uses Tailwind CSS exclusively. No additional CSS file is required.
- **Dark mode**: All color utilities have a `dark:` variant (`dark:border-neutral-700`, `dark:text-neutral-100`, `dark:text-neutral-400`). Dark mode is applied automatically when the parent document has the `dark` class or when the OS prefers dark mode, depending on your Tailwind `darkMode` configuration.
- **Avatar dimensions**: The avatar is rendered at a fixed `56px × 56px` (`h-14 w-14`) and cropped to a circle with `rounded-full object-cover`. Provide a square source image for best results.
- **Spacing**: The component adds `mt-12` top margin and `pt-8` padding above a neutral top border, placing it cleanly below the post body. If you need to adjust the spacing for a different layout, wrap the component and override the margin via a parent class.
- **Accessibility**: The author's `name` value is used as the `alt` attribute on the avatar `<img>` element, providing a meaningful accessible label for screen readers.
- **No interactivity**: This is a purely presentational component. It does not handle clicks, links, or state. If you need the author name or avatar to link to an author page, extend the component or wrap the relevant elements externally.
