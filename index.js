import routes from '$routel'
import * as navigation from '$app/navigation'
import _get from 'lodash/get'
import _reduce from 'lodash/reduce'
import _isEmpty from 'lodash/isEmpty'
import _trimEnd from 'lodash/trimEnd'
import _camelCase from 'lodash/camelCase'
import _escapeRegExp from 'lodash/escapeRegExp'

const resolve = (path) => {
    if (typeof path !== 'object') {
        return path
    }

    let href = _get(path, 'path', '/')

    const name = _get(path, 'name')
    if (name) {
        const route = _get(routes, name, _get(routes, _camelCase(name).toLowerCase()))
        if (route) {
            const params = _get(path, 'params', {})
            href = _reduce(
                route.params,
                (href, pattern, param) => {
                    return href.replace(new RegExp(_escapeRegExp(pattern), 'g'), _get(params, param, param))
                },
                route.path
            )
        } else {
            href = name
        }

        href = _trimEnd(href, '/')
    }

    const query = _get(path, 'query', {})
    if (!_isEmpty(query)) {
        let queries = _reduce(
            query,
            (keep, value, key) => {
                keep.push([encodeURIComponent(key), encodeURIComponent(value)].join('='))

                return keep
            },
            []
        )
        href += '?' + queries.join('&')
    }

    const hash = _get(path, 'hash')
    if (hash) {
        href += '#' + hash
    }

    return href
}

const goto = (path, options) => {
    if (_get(options, 'legacy')) {
        return navigation.goto(path, options)
    }

    return navigation.goto(resolve(path), options)
}

const invalidate = navigation.invalidate

const prefetch = navigation.prefetch

const prefetchRoutes = navigation.prefetchRoutes

export { goto, invalidate, prefetch, prefetchRoutes, resolve, routes }
