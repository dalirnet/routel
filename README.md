# routel

SvelteKit navigation patch

#### Install

```bash
npm install routel
```

#### Setup

Add the following values to `svelte.config.js`

```javascript
import routel from "routel/plugin/index.js"

export default {
    kit: {
        vite: {
            plugins: [routel()],
            optimizeDeps: {
                exclude: ["routel"],
            },
            ssr: {
                noExternal: ["routel"],
            },
        },
    },
}
```

#### Usage

Import `goto` or `resolve` to your .svelte component

```javascript
import { onMount } from "svelte"
import { goto, resolve } from "routel"


// log "index"
console.log(resolve({ name: "index" }))


// log "blog/guide-to-sveltekit"
console.log(resolve(({
    name: "blogSlug",
    params: {
        slug: "guide-to-sveltekit",
    },
}))


// log "blog/edit/guide-to-sveltekit?role=admin"
console.log(resolve(({
    name: "blog-edit-slug",
    params: {
        slug: "guide-to-sveltekit",
    },
    query: {
        role: "admin",
    },
}))


// log "blog/new#focus"
console.log(resolve(({
    name: "blog_new",
    hash: "focus",
}))


// Cannot call `goto` on the server
onMount(() => {


    // goto "index"
    goto({ name: "index" })


    // goto "blog/guide-to-sveltekit"
    goto({
        name: "blogSlug",
        params: {
            slug: "guide-to-sveltekit",
        },
    })


    // goto "blog/edit/guide-to-sveltekit?role=admin"
    goto({
        name: "blog-edit-slug",
        params: {
            slug: "guide-to-sveltekit",
        },
        query: {
            role: "admin",
        },
    })


    // goto "blog/new#focus"
    goto({
        name: "blog_new",
        hash: "focus",
    })
})
```

#### Plugin config

```javascript
import routel from "routel/plugin"

// alias option for route name generator
routel({
    alias: {
        slug: "parameter",
    },
})

// default alias
{
    _: 'underscore',
    $: 'variable'
}
```

#### Naming guide

-   `index.svelte` named to
    -   `index`
-   `blog/index.svelte` named to
    -   `blogIndex`
    -   `blog-index`
    -   `blog_index`
-   `blog/[slug].svelte` named to
    -   `blogSlug`
    -   `blog-slug`
    -   `blog_slug`
-   `blog/edit/[slug].svelte` named to
    -   `blogEditSlog`
    -   `blog-edit-slug`
    -   `blog_edit_slug`
-   `blog/delete/[$].svelte` named to
    -   `blogDeleteVariable`
    -   `blog-delete-variable`
    -   `blog_delete_variable`
-   `blog/[category]/[id]-[slug].svelte` named to
    -   `blogCategoryIdSlug`
    -   `blog-category-id-slug`
    -   `blog_category_id_slug`
