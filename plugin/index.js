import fs from 'fs'
import _ from 'lodash'
import path from 'path'

const routel = (options = {}) => {
    const config = {
        id: '$routel',
        name: 'sveltekit:routel',
        regexp: new RegExp('\\/\\/\\s+src\\/routes\\/(.*?)\\.(\\w+)\\s+\\[(\\s+|)\\/(\\^.*?\\$)\\/(\\s+|)[,\\]]', 'gi'),
        manifest: '../../../generated/manifest.js',
        path: null,
        context: null,
        routes: [],
    }

    const alias = _.defaultsDeep(_.get(options, 'alias', {}), {
        _: 'underscore',
        $: 'variable',
    })

    return {
        name: config.name,
        enforce: 'post',
        configResolved({ build }) {
            config.path = path.resolve(build.rollupOptions.input, config.manifest)
        },
        resolveId(id) {
            return id === config.id ? id : null
        },
        async load(id) {
            if (id === config.id) {
                config.context = String(await fs.readFileSync(config.path))
                config.routes = _.reduce(
                    [...config.context.matchAll(config.regexp)],
                    (keep, match) => {
                        const name = _(match[1])
                            .thru((name) => {
                                return _.split(_.toLower(name), /[^a-z0-9_$]+/gi)
                            })
                            .thru((parts) => {
                                return _.filter(parts)
                            })
                            .thru((parts) => {
                                return _.map(parts, (part) => {
                                    return _.reduce(
                                        alias,
                                        (keep, value, key) => {
                                            return _.replace(keep, new RegExp(_.escapeRegExp(key), 'g'), value)
                                        },
                                        part
                                    )
                                })
                            })
                            .thru((parts) => {
                                return _.join(parts, '')
                            })
                            .value()

                        const value = _({
                            path: match[1],
                            type: 'page',
                            match: match[4],
                            params: match[1].match(/\[.*?\]/g) || [],
                        })
                            .tap((value) => {
                                value.path = '/' + _.trim(_.replace(value.path, /index$/, '/'), '/')
                            })
                            .tap((value) => {
                                value.type = match[2] === 'js' ? 'endpoint' : value.type
                            })
                            .tap((value) => {
                                value.params = _.reduce(
                                    value.params,
                                    (params, param) => {
                                        return _.set(params, _.replace(param, /[[.\]]/g, ''), param)
                                    },
                                    {}
                                )
                            })
                            .value()

                        return _.set(keep, name, value)
                    },
                    {}
                )

                return 'export default ' + JSON.stringify(config.routes)
            }
        },
    }
}

export default routel
