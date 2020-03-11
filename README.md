# Chromatic docs

[![Netlify Status](https://api.netlify.com/api/v1/badges/3e1d4d54-1349-4c8a-b214-788ae7aac3a4/deploy-status)](https://app.netlify.com/sites/chromatic2-docs/deploys)

Available at [docs.chromatic.com](docs.chromatic.com) and via Netlify's build previews on branches/PRs.

To configure, access the Netlify [dashboard](https://app.netlify.com/sites/chromatic2-docs/overview).

The `master` branch is deployed to .com . To avoid confusion pre 1.0, this is the 1.0 documentation.

## Install jekyll

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

## How to run the site

2. Go to the /docs directory
3. Run `yarn start`

## How to update CSS

1. Compile LESS to CSS via `yarn grunt` in command line
2. Commit the compiled `style.css`
