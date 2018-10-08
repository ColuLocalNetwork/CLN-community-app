
export const apiMiddleware = store => next => action => {
  console.log('Middleware triggered:', action)
  next(action)
}
