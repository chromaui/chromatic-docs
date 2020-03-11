# Chromatic docs
Available at [docs.chromaticqa.com](https://docs.chromaticqa.com).

## Setup jekyll
1. Install jekyll with `gem install jekyll`

### Troubleshooting setup
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
3. Run `npm start`

## How to update CSS
1. Compile LESS to CSS via `yarn grunt` in command line
2. Commit the compiled `style.css`
