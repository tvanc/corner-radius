# Tracer

Generate SVG paths that perfectly match the contours of an element, even when the children protrude or lie completely outside the parent.

Effects are controllable through CSS or JS.

### Examples

To view the examples, run these commands to clone this repo,
`cd` into it, install dependencies, and run the dev server.

```bash
git clone git@github.com:tvanc/corner-radius.git
cd corner-radius
yarn install
yarn dev-server
```

Once the dev server has launched, open your web browser to [localhost:8080/src/example.html](http://localhost:8080/src/example.html)

### TODO

- Add window resize watcher
- Clip traced element by path
- Add super-ellipse algorithm
- Remove unused GPC code
- Ensure proper licensing and attribution
