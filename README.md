# Chromatic docs

The `master` branch is deployed to .com (to avoid confusion pre 1.0, this will stay the 1.0 documentation until we launch 2.0)

Until then, work is happening on this branch: https://github.com/chromaui/chromatic-docs/tree/two-point-oh

## Deployment

[![Netlify Status](https://api.netlify.com/api/v1/badges/3e1d4d54-1349-4c8a-b214-788ae7aac3a4/deploy-status)](https://app.netlify.com/sites/chromatic2-docs/deploys)

Available at [docs.chromatic.com](docs.chromatic.com) and via Netlify's build previews on branches/PRs.

To configure, access the Netlify [dashboard](https://app.netlify.com/sites/chromatic2-docs/overview).

The `master` branch is deployed to .com . To avoid confusion pre 1.0, this is the 1.0 documentation.

## Installing jekyll for local development

1. Install jekyll with `bundle install`

### Troubleshooting install

Note: If you don't have permission to install gems you may need to add something to your `.bashrc`. [Link](https://jekyllrb.com/docs/troubleshooting/#no-sudo)

1. `$ nano .bashrc`
2. Append to your .bashrc:

```
# Ruby exports

export GEM_HOME=$HOME/gems
export PATH=$HOME/gems/bin:$PATH
```

3. [ctrl + o] then [return] to save
4. `$ source .bashrc`
5. Try installing jekyll again or continue on

## Running the site

2. Go to the /docs directory
3. Run `yarn start`

## Styling

1. Edit `style.less` or one of the other less files.
2. Compile LESS to CSS via `yarn grunt` in command line. _Note:_ this command watches for changes. We don't have a build step for compiling from scratch so if you need to recompile styles, save one the less files whilst grunt is watching for changes.
3. Commit the compiled `style.css`

## Editing Content

### Pages

Edit the `.md` files in the root of the repo or copy them to add new pages.

### Sidebar

Edit `sidebar_nav.html` to change the sidebar.

### Images

### Search

Algolia's Docsearch is integrated with the project. Every 24 hours it will crawl docs.chromatic.com and update it's index. The search input box is wired up to this index. You don't need to do anything special, whatever is pushed to docs.chromatic.com will be automatically indexed.
