# Chromatic docs

The `main` branch is automatically deployed to https://www.chromatic.com/docs/

## Deployment

[![Netlify Status](https://api.netlify.com/api/v1/badges/3e1d4d54-1349-4c8a-b214-788ae7aac3a4/deploy-status)](https://app.netlify.com/sites/chromatic2-docs/deploys)

Available at [docs.chromatic.com](docs.chromatic.com) and via Netlify's build previews on branches/PRs. The 'website' proxies this to https://www.chromatic.com/docs/

To configure, access the Netlify [dashboard](https://app.netlify.com/sites/chromatic2-docs/overview).

Deploy previews are set up for PRs.

## Installing jekyll for local development

1. Install gems with `bundle install`

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

1. Run `yarn start`
2. Navigate to http://localhost:4000/docs/

## Styling

1. Edit `style.less` or one of the other less files.
2. Compile LESS to CSS via `yarn grunt` in command line. _Note:_ this command watches for changes. We don't have a build step for compiling from scratch so if you need to recompile styles, save one the less files whilst grunt is watching for changes.
3. Commit the compiled `style.css`

## Editing Content

Try to follow the conventions present.

### Pages

Edit the `.md` files in the root of the repo or copy them to add new pages.

### Sidebar

Edit `sidebar_nav.html` to change the sidebar.

### Images

Add the `center` css class to center images horizontally if they aren't full screen.

### Search

Algolia's Docsearch is integrated with the project. Every 24 hours it will crawl docs.chromatic.com and update it's index. The search input box is wired up to this index. You don't need to do anything special, whatever is pushed to docs.chromatic.com will be automatically indexed.
