1. npx create-next-app@latest
2. npx shadcn-ui@latest init
3. other dependencies

```sh

```

## New things learned:

1. tailwindcss "!" important

this is used to override the default styles

```ts
className = "!text-white";
```

2. interface extends HTMLAttributes<...>

```ts
interface Props extends HTMLAttributes<HTMLDivElement> {
  // ...
}
```

3. using buttonvariant function of shadcn-ui with Link component

```ts
<Link href="/about" className={buttonVariant({ size: "sm", variant: "link" })}>
  About
</Link>
```

4. self closing div tag

```ts
<div />
```
