import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
	const newBlog = {
		title: 'Test title',
		author: 'Test author',
		url: 'Test url'
	}

	test('form calls the handler with the right details when submitted', async () => {
		const createNote = jest.fn()
		const { container } = render(<BlogForm onSubmit={createNote} />)
		const user = userEvent.setup()
		await user.type(
			container.querySelector('.blogform-title'),
			newBlog.title
		)
		await user.type(
			container.querySelector('.blogform-author'),
			newBlog.author
		)
		await user.type(
			container.querySelector('.blogform-url'),
			newBlog.url
		)
		await user.click(container.querySelector('.blogform-submit'))
		expect(createNote.mock.calls).toHaveLength(1)
		expect(createNote.mock.calls[0][0]).toEqual(newBlog)
	})
})