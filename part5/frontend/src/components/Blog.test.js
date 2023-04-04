import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
	const blog = {
		title: 'Test Title',
		author: 'Test Author',
		url: 'http://test.com',
		likes: 1,
		user: {
			name: 'Test User'
		}
	}

	test('renders content', () => {
		const { container } = render(
			<Blog
				blog={blog}
				isOwner={false}
				onLike={() => null}
				onRemove={() => null} />
		)
		const title = container.querySelector('.blog-title')
		expect(title).toBeDefined()
		expect(title.textContent).toEqual(blog.title)
		const author = container.querySelector('.blog-author')
		expect(author).toBeDefined()
		expect(author.textContent).toEqual(`by ${blog.author}`)
		expect(container.querySelector('.blog-details-url')).toBeNull()
		expect(container.querySelector('.blog-details-likes')).toBeNull()
	})

	test('details are shown when button is clicked', async () => {
		const { container } = render(
			<Blog
				blog={blog}
				isOwner={false}
				onLike={() => null}
				onRemove={() => null} />
		)
		const user = userEvent.setup()
		const showButton = container.querySelector('.blog-showbtn')
		await user.click(showButton)
		const details = container.querySelector('.blog-details')
		expect(details).toBeDefined()
		const url = container.querySelector('.blog-details-url')
		expect(url).toBeDefined()
		expect(url.textContent).toEqual(blog.url)
		const likes = container.querySelector('.blog-details-likes')
		expect(likes).toBeDefined()
	})

	test('clicking the likes button twice calls event handler twice', async () => {
		const likeBlog = jest.fn()
		const { container } = render(
			<Blog
				blog={blog}
				isOwner={false}
				onLike={likeBlog}
				onRemove={() => null} />
		)
		const user = userEvent.setup()
		const showButton = container.querySelector('.blog-showbtn')
		await user.click(showButton)
		const likeButton = container.querySelector('.blog-details-likebtn')
		await user.click(likeButton)
		await user.click(likeButton)
		expect(likeBlog.mock.calls).toHaveLength(2)
	})
})