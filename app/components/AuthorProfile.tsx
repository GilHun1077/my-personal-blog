type Author = {
  name: string
  bio: string
  avatarUrl: string
}

type AuthorProfileProps = {
  author: Author
}

export default function AuthorProfile({ author }: AuthorProfileProps) {
  const { name, bio, avatarUrl } = author

  return (
    <div className="mt-12 flex items-start gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-700">
      <img
        src={avatarUrl}
        alt={name}
        className="h-14 w-14 rounded-full object-cover"
        onError={(e) => {
          e.currentTarget.src = '/images/avatar.svg'
        }}
      />
      <div>
        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
          {name}
        </p>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {bio}
        </p>
      </div>
    </div>
  )
}
