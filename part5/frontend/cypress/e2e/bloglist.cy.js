import blogs from '../fixtures/blogs.json'
import users from '../fixtures/users.json'

describe('Blog app', () => {
	beforeEach(() => {
		cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
		cy.request('POST', `${Cypress.env('BACKEND')}/users`, users[0])
		cy.visit('')
	})

	it('Login form is shown', () => {
		cy.contains('Log in to application')
	})

	describe('Login', () => {
		it('succeeds with correct credentials', () => {
			cy.get('.login-username').type(users[0].username)
			cy.get('.login-password').type(users[0].password)
			cy.get('.login-submit').click()
			cy.contains(`${users[0].name} logged in`)
		})

		it('fails with wrong credentials', () => {
			cy.get('.login-username').type(users[0].username)
			cy.get('.login-password').type('gabagool')
			cy.get('.login-submit').click()
			cy.get('.error').should('contain', 'wrong username or password')
			cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
			cy.get('.error').should('have.css', 'border-style', 'solid')
		})
	})

	describe('When logged in', () => {
		beforeEach(() => {
			cy.login(users[0])
		})

		it('A blog can be created', () => {
			cy.get('#bloglist').children().should('have.length', 0)
			cy.contains('new blog').click()
			cy.get('.blogform-title').type(blogs[0].title)
			cy.get('.blogform-author').type(blogs[0].author)
			cy.get('.blogform-url').type(blogs[0].url)
			cy.get('.blogform-submit').click()
			cy.get('#bloglist').children().should('have.length', 1)
		})

		it('A blog can be liked', () => {
			cy.createBlog(blogs[0])
			cy.get('.blog-showbtn').click()
			cy.get('.blog-details-likes').should('contain', '0 likes')
			cy.get('.blog-details-likebtn').click()
			cy.get('.blog-details-likes').should('contain', '1 likes')
		})

		it('A blog can be deleted', () => {
			cy.createBlog(blogs[0])
			cy.get('#bloglist').children().should('have.length', 1)
			cy.get('.blog-showbtn').click()
			cy.get('.blog-details-removebtn').click()
			cy.get('#bloglist').children().should('have.length', 0)
		})

		it('Only the creator can see the delete button', () => {
			cy.createBlog(blogs[0])
			cy.contains('logout').click()
			cy.request('POST', `${Cypress.env('BACKEND')}/users`, users[1])
			cy.login(users[1])
			cy.get('.blog-showbtn').click()
			cy.get('.blog-details-removebtn').should('not.exist')
		})

		it('Blogs are ordered according to likes', () => {
			cy.createBlog(blogs[0])
			cy.createBlog(blogs[1])
			cy.createBlog(blogs[2])
			cy.get('.blog').eq(0).should('contain', blogs[0].title)
			cy.get('.blog').eq(1).should('contain', blogs[1].title)
			cy.get('.blog').eq(2).should('contain', blogs[2].title)
		})
	})
})