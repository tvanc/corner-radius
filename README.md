
## Recipes

### Using `yarn link`

To use `yarn link` efficiently, do this:

```bash
> cd corner-radius
> yarn link
> yarn build --watch
> cd ../my-other-library
> yarn link corner-radius
```

### Reformating all code

```bash
yarn format
```
