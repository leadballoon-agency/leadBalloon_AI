# Fix NPM Permissions

Run this command in your terminal (you'll need to enter your password):

```bash
sudo chown -R $(whoami) ~/.npm
```

Or if that doesn't work, try:

```bash
sudo chown -R 501:20 "/Users/marktaylor/.npm"
```

After fixing permissions, come back here and we'll continue with Playwright setup.