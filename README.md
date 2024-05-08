1. npx create-next-app@latest
2. npx shadcn-ui@latest init
3. other dependencies

```sh
npm i
framer-motion
lucide-react
react-dropzone
uploadthing @uploadthing/react
zod
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

5. tailwindcss using "order-x" to change the order of sibling element

```ts
<div className="flex flex-col lg:flex-row">
  <div className="order-1">1</div>
  <div className="order-0 lg:order-2">2</div>
</div>
```

6. useRef (still not clear, need to learn more)

7. framer-motion

```ts
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const MyComponent = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  // ...
};
```

the containerRef is used to reference the element
the `once` prop is used to trigger the animation only once and `amount` is used to trigger the animation when the element is 40% in view

8. setting dynamic css

```ts
<div
  className='animate-marquee'
  style={{ '--marquee-duration': duration } as React.CSSProperties}>
  //...

</div>
```

tailwind.config.ts

```ts
//...
theme: {
  extend: {
    //...
    keyframes: {
      marquee: {
        "100%": {
          transform: "translateY(-50%)",
        },
      },
    },
    animation: {
      marquee: 'marquee var(--marquee-duration) linear infinite',
    },
  },
},
```

9. use cloudflare R2 (similar to AWS S3) for unstructured data like images, videos, etc.

10. use react query for caching server actions

```ts
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, SaveConfigArgs } from "./actions";

const { mutate: saveConfig, isPending } = useMutation({
  mutationKey: ["save-config"],
  mutationFn: async (args: SaveConfigArgs) => {
    await Promise.all([saveConfiguration(), _saveConfig(args)]);
  },
  onError: () => {
    toast({
      title: "Something went wrong",
      description: "There was an error on our end. Please try again.",
      variant: "destructive",
    });
  },
  onSuccess: () => {
    router.push(`/configure/preview?id=${configId}`);
  },
});

function saveConfiguration() {
  //...
}

```
