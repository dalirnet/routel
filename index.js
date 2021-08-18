import routes from '$routel'
import * as navigation from '$app/navigation'

const resolve = (path) => {
    if (typeof path !== 'object') {
        return path
    }

    let href = typeof path.base === 'string' ? path.base : '/'

    const name = (path.name || '').replace(/[-_\s]/g, '').toLowerCase()
    const route = routes[name]
    if (route) {
        const params = path.params || {}
        href = Object.entries(route.params).reduce((href, [key, pattern]) => {
            return href.replace(pattern, params[key] || key)
        }, route.path)
    } else {
        href = name
    }

    const query = Object.entries(path.query || {}).reduce((keep, [value, key]) => {
        keep.push([encodeURIComponent(key), encodeURIComponent(value)].join('='))
        return keep
    }, [])
    if (query.length) {
        href += '?' + query.join('&')
    }

    const hash = path.hash
    if (hash) {
        href += '#' + hash
    }

    return href
}

const goto = (path, options = {}) => {
    if (options.legacy) {
        return navigation.goto(path, options)
    }

    return navigation.goto(resolve(path), options)
}

const invalidate = navigation.invalidate

const prefetch = navigation.prefetch

const prefetchRoutes = navigation.prefetchRoutes

export { goto, invalidate, prefetch, prefetchRoutes, resolve, routes }
